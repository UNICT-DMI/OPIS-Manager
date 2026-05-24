import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { env } from '@env';
import { OpisGroup } from '@enums/opis-group.enum';
import { Question } from '@interfaces/question.interface';
import { describe, expect, it } from 'vitest';
import { FormulaComponent } from './formula';

const BASE_URL = env.api_url + '/v2/domande';

const makeQuestion = (id: number, gruppo: (typeof OpisGroup)[keyof typeof OpisGroup]): Question => ({
  id,
  peso_standard: 0.5,
  gruppo,
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
});

describe('FormulaComponent', () => {
  let component: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FormulaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormulaComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

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
});
