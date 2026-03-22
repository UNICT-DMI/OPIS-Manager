import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Department } from '@interfaces/department.interface';
import { exampleCDS } from '@mocks/cds-mock';
import { exampleDepartment } from '@mocks/department-mock';
import { DepartmentsService } from './departments.service';
import { UNICT_ID_DEPARTMENT_MAP } from '@values/deps-id-unict';
import { DEPARTMENT_ICONS } from '@values/icons-deps';

vi.mock('@values/delay-api', () => ({ DELAY_API_MS: 0 }));

const BASE_URL = 'https://api-opis.unictdev.org/api/v2/dipartimento';

const flush = async (times = 2): Promise<void> => {
  for (let i = 0; i < times; i++) await TestBed.tick();
};

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DepartmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // ─── Signals ────────────────────────────────────────────────────────────────

  describe('signals', () => {
    it.each([
      ['logoAlreadyAnimated', false],
      ['canStartUserFlow', false],
      ['selectedYear', '2020/2021'],
    ])('[SIGNAL]: %s has correct initial value', (key, expected) => {
      const signalFn = service[key as keyof DepartmentsService] as () => unknown;
      expect(signalFn()).toBe(expected);
    });
  });

  // ─── getDepartmentByYear ─────────────────────────────────────────────────────

  describe('getDepartmentByYear', () => {
    it('[GET_DEPARTMENT_BY_YEAR]: Maps department with correct icon', async () => {
      const resource = TestBed.runInInjectionContext(() => service.getDepartmentByYear());
      await flush();

      httpMock.expectOne(`${BASE_URL}?anno_accademico=2020/2021`).flush([exampleDepartment]);

      await vi.waitFor(async () => {
        await TestBed.tick();
        const expectedIcon = DEPARTMENT_ICONS[UNICT_ID_DEPARTMENT_MAP[exampleDepartment.unict_id]];
        expect(resource.value()).toEqual([{ ...exampleDepartment, icon: expectedIcon }]);
      });
    });

    it('[GET_DEPARTMENT_BY_YEAR]: Uses DEFAULT icon if unict_id is not in map', async () => {
      const resource = TestBed.runInInjectionContext(() => service.getDepartmentByYear());
      await flush();

      httpMock
        .expectOne(`${BASE_URL}?anno_accademico=2020/2021`)
        .flush([{ ...exampleDepartment, unict_id: 999 }]);

      await vi.waitFor(async () => {
        await TestBed.tick();
        expect(resource.value()?.[0].icon).toBe(DEPARTMENT_ICONS.DEFAULT);
      });
    });

    it('[GET_DEPARTMENT_BY_YEAR]: Refetches on selectedYear change', async () => {
      const resource = TestBed.runInInjectionContext(() => service.getDepartmentByYear());
      await flush();

      httpMock.expectOne(`${BASE_URL}?anno_accademico=2020/2021`).flush([]);
      await flush();

      service.selectedYear.set('2019/2020');
      await flush();
      httpMock.expectOne(`${BASE_URL}?anno_accademico=2019/2020`).flush([exampleDepartment]);

      await vi.waitFor(async () => {
        await TestBed.tick();
        expect(resource.value()).toHaveLength(1);
      });
    });
  });

  // ─── getCdsDepartment ────────────────────────────────────────────────────────

  describe('getCdsDepartment', () => {
    it('[GET_CDS_DEPARTMENT]: Returns [] without http call if department is null', async () => {
      const dep = signal<Department | null>(null);
      const resource = TestBed.runInInjectionContext(() => service.getCdsDepartment(dep));
      await flush();

      httpMock.expectNone(`${BASE_URL}/with-id/${exampleDepartment.id}/cds`);
      expect(resource.value()).toEqual([]);
    });

    it('[GET_CDS_DEPARTMENT]: Fetches CDS when department is set', async () => {
      const dep = signal<Department | null>(exampleDepartment);
      const resource = TestBed.runInInjectionContext(() => service.getCdsDepartment(dep));
      await flush();

      httpMock.expectOne(`${BASE_URL}/with-id/${exampleDepartment.id}/cds`).flush([exampleCDS]);

      await vi.waitFor(async () => {
        await TestBed.tick();
        expect(resource.value()).toEqual([exampleCDS]);
      });
    });

    it('[GET_CDS_DEPARTMENT]: Refetches on department change', async () => {
      const dep = signal<Department | null>(null);
      const resource = TestBed.runInInjectionContext(() => service.getCdsDepartment(dep));
      await flush();

      dep.set(exampleDepartment);
      await flush();
      httpMock.expectOne(`${BASE_URL}/with-id/${exampleDepartment.id}/cds`).flush([exampleCDS]);

      await vi.waitFor(async () => {
        await TestBed.tick();
        expect(resource.value()).toEqual([exampleCDS]);
      });
    });
  });
});