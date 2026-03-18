import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { CdsService } from './cds.service';
import { GraphService } from '@services/graph/graph.service';
import { exampleCDS } from '@mocks/cds-mock';
import { env } from '@env';

// ─── Mock GraphService ────────────────────────────────────────────────────────
const buildMockGraphService = () => ({
  graphKeySelected: signal('cds_general'),
  graphBtns: signal([]),
  manageGraphSelection: { isLoading: signal(false) },
  computeMeansPerYear: vi.fn().mockReturnValue({}),
});

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('CdsService', () => {
  let service: CdsService;
  let httpMock: HttpTestingController;
  let mockGraphService: ReturnType<typeof buildMockGraphService>;

  beforeEach(() => {
    mockGraphService = buildMockGraphService();

    TestBed.configureTestingModule({
      providers: [
        CdsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GraphService, useValue: mockGraphService },
      ],
    });

    service = TestBed.inject(CdsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // ── cdsSelected ───────────────────────────────────────────────────────────
  it('[CDS-SERVICE]: should initialize cdsSelected as null', () => {
    expect(service.cdsSelected()).toBeNull();
  });

  it('[CDS-SERVICE]: should update cdsSelected', () => {
    service.cdsSelected.set(exampleCDS);
    expect(service.cdsSelected()).toEqual(exampleCDS);
  });

  // ── isLoading ─────────────────────────────────────────────────────────────
  it('[CDS-SERVICE]: should reflect true when graphService is loading', () => {
    mockGraphService.manageGraphSelection.isLoading.set(true);
    expect(service.isLoading()).toBe(true);
  });

  // ── teachingCdsApi ────────────────────────────────────────────────────────
  it('[CDS-SERVICE]: should call teachings API with correct URL', async () => {
    const promise = firstValueFrom(service['teachingCdsApi'](exampleCDS.id));

    const req = httpMock.expectOne(`${env.api_url}/cds/with-id/${exampleCDS.id}/insegnamenti`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nome: 'Matematica' }]);

    await promise;
  });

  it('[CDS-SERVICE]: should throw when teachings API returns empty array', async () => {
    const promise = firstValueFrom(service['teachingCdsApi'](exampleCDS.id));

    httpMock.expectOne(`${env.api_url}/cds/with-id/${exampleCDS.id}/insegnamenti`).flush([]);

    await expect(promise).rejects.toThrow('Nessun insegnamento trovato');
  });

  // ── cdsStatsApi ───────────────────────────────────────────────────────────
  it('[CDS-SERVICE]: should call stats API with correct URL', async () => {
    const promise = firstValueFrom(service['cdsStatsApi'](exampleCDS.unict_id));

    const req = httpMock.expectOne(`${env.api_url}/cds/coarse/${exampleCDS.unict_id}/schedeopis`);
    expect(req.request.method).toBe('GET');
    req.flush([{ insegnamenti: [] }]);

    await promise;
  });

  it('[CDS-SERVICE]: should throw when stats API returns empty array', async () => {
    const promise = firstValueFrom(service['cdsStatsApi'](exampleCDS.unict_id));

    httpMock.expectOne(`${env.api_url}/cds/coarse/${exampleCDS.unict_id}/schedeopis`).flush([]);

    await expect(promise).rejects.toThrow('Schede OPIS non trovate');
  });

  // ── extractValidSchedeOpis ────────────────────────────────────────────────
  it('[CDS-SERVICE]: should extract only valid SchedeOpis', () => {
    const cdsList = [
      {
        insegnamenti: [
          { schedeopis: { domande: [[1, 2, 3, 4]], totale_schede: 10 } },
          { schedeopis: null },
        ],
      },
      { insegnamenti: [{ schedeopis: { domande: null } }] },
    ] as any;

    expect(service['extractValidSchedeOpis'](cdsList).length).toBe(1);
  });

  it('[CDS-SERVICE]: should return empty array when no valid SchedeOpis exist', () => {
    const cdsList = [{ insegnamenti: [{ schedeopis: null }] }] as any;
    expect(service['extractValidSchedeOpis'](cdsList)).toEqual([]);
  });

  // ── updateCDS ─────────────────────────────────────────────────────────────
  it('[CDS-SERVICE]: should call PUT with correct URL and token', async () => {
    const token = 'test-token';
    const promise = firstValueFrom(service.updateCDS(exampleCDS, token));

    const url = new URL(`${env.api_url}/cds/with-id/${exampleCDS.id}`);
    url.searchParams.set('scostamento_numerosita', String(exampleCDS.scostamento_numerosita));
    url.searchParams.set('scostamento_media', String(exampleCDS.scostamento_media));

    const req = httpMock.expectOne(url.toString());
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(token);
    req.flush({});

    await promise;
  });

  it('[CDS-SERVICE]: should complete successfully on updateCDS', async () => {
    const promise = firstValueFrom(service.updateCDS(exampleCDS, 'token'));
    httpMock.expectOne(() => true).flush({});
    await expect(promise).resolves.toBeDefined();
  });
});