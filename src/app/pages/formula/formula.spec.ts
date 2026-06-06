import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { env } from '@env';
import { OpisGroup } from '@enums/opis-group.enum';
import { Question } from '@interfaces/question.interface';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FormulaComponent } from './formula';

const BASE_URL = env.api_url + '/v2/domande';

const makeQuestion = (
  id: number,
  gruppo: (typeof OpisGroup)[keyof typeof OpisGroup],
  peso = 0.5,
): Question => ({
  id,
  peso_standard: peso,
  gruppo,
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
});

/** Two 0.5-weighted questions per group so every group sum equals 1 (groupsValid === true). */
const validWeights = (): Question[] => [
  makeQuestion(1, OpisGroup.Group1),
  makeQuestion(2, OpisGroup.Group1),
  makeQuestion(4, OpisGroup.Group2),
  makeQuestion(5, OpisGroup.Group2),
  makeQuestion(3, OpisGroup.Group3),
  makeQuestion(6, OpisGroup.Group3),
];

describe('FormulaComponent', () => {
  let component: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FormulaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormulaComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('[FORMULA]: created', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([makeQuestion(1, OpisGroup.Group1)]);
    expect(component).toBeTruthy();
  });

  it('[FORMULA]: groups questions by V1/V2/V3', () => {
    fixture.detectChanges();

    const weights = [
      makeQuestion(1, OpisGroup.Group1),
      makeQuestion(2, OpisGroup.Group1),
      makeQuestion(4, OpisGroup.Group2),
      makeQuestion(3, OpisGroup.Group3),
    ];
    httpMock.expectOne(BASE_URL).flush(weights);

    const grouped = component['groupedRows']();
    expect(grouped.V1.map((row) => row.id)).toEqual([1, 2]);
    expect(grouped.V2.map((row) => row.id)).toEqual([4]);
    expect(grouped.V3.map((row) => row.id)).toEqual([3]);
    expect(grouped.dismissed.map((row) => row.id)).toEqual([8, 11, 12]);
  });

  it('[FORMULA]: sets hasError on HTTP failure', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([]);
    expect(component['hasError']()).toBe(true);
    expect(component['isLoading']()).toBe(false);
  });

  it('[FORMULA]: setWeight updates the weight and clears the save message', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([makeQuestion(1, OpisGroup.Group1)]);

    component['setWeight'](1, 0.7);

    expect(component['getWeight'](1)).toBe(0.7);
    expect(component['getWeight'](999)).toBeNull();
    expect(component['saveMessage']()).toBeNull();
  });

  it('[FORMULA]: computes group sums and validity', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush(validWeights());

    expect(component['groupSums']()).toEqual({ V1: 1, V2: 1, V3: 1 });
    expect(component['groupsValid']()).toBe(true);
    expect(component['groupsError']()).toBeNull();
  });

  it('[FORMULA]: groupsError reports a single invalid group', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([
      makeQuestion(1, OpisGroup.Group1),
      makeQuestion(2, OpisGroup.Group1),
      makeQuestion(4, OpisGroup.Group2, 0.3),
      makeQuestion(5, OpisGroup.Group2, 0.3),
      makeQuestion(3, OpisGroup.Group3),
      makeQuestion(6, OpisGroup.Group3),
    ]);

    expect(component['groupsValid']()).toBe(false);
    expect(component['groupsError']()).toBe('La somma V2 è diversa da 1');
  });

  it('[FORMULA]: groupsError lists multiple invalid groups', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([
      makeQuestion(1, OpisGroup.Group1, 0.2),
      makeQuestion(4, OpisGroup.Group2, 0.2),
      makeQuestion(3, OpisGroup.Group3),
      makeQuestion(6, OpisGroup.Group3),
    ]);

    expect(component['groupsError']()).toBe('Le somme V1, V2 sono diverse da 1');
  });

  it('[FORMULA]: save blocks and shows an error when a group sum is not 1', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush([makeQuestion(1, OpisGroup.Group1)]);

    component['save']();

    expect(component['saveMessage']()?.type).toBe('error');
  });

  it('[FORMULA]: save does nothing when groups are valid but no token is present', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush(validWeights());

    component['save']();

    expect(component['saving']()).toBe(false);
    expect(component['saveMessage']()).toBeNull();
  });

  it('[FORMULA]: save PUTs the weights and reports success', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush(validWeights());
    localStorage.setItem('auth_token', 'bearer xyz');

    component['save']();

    const req = httpMock.expectOne((r) => r.method === 'PUT');
    expect(req.request.headers.get('Authorization')).toBe('bearer xyz');
    req.flush({});

    expect(component['saving']()).toBe(false);
    expect(component['saveMessage']()?.type).toBe('success');
  });

  it('[FORMULA]: save reports an error when the request fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(BASE_URL).flush(validWeights());
    localStorage.setItem('auth_token', 'bearer xyz');

    component['save']();

    httpMock
      .expectOne((r) => r.method === 'PUT')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(component['saving']()).toBe(false);
    expect(component['saveMessage']()?.type).toBe('error');
  });
});
