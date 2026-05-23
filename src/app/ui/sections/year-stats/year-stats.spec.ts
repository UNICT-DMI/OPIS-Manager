import { ResourceStatus, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { YearStats } from './year-stats';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { exampleCDS } from '@mocks/cds-mock';
import { Teaching } from '@interfaces/teaching.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';

type MockResourceShape = {
  status: WritableSignal<ResourceStatus>;
  isLoading: WritableSignal<boolean>;
  hasValue: WritableSignal<boolean>;
  value: WritableSignal<unknown>;
  error: WritableSignal<unknown>;
  refresh: ReturnType<typeof vi.fn>;
};

const mockResource = (overrides: Partial<MockResourceShape> = {}): MockResourceShape => ({
  status: signal<ResourceStatus>('idle'),
  isLoading: signal(false),
  hasValue: signal(false),
  value: signal<unknown>(null),
  error: signal<unknown>(null),
  refresh: vi.fn(),
  ...overrides,
});

const buildSchedaOpis = (totale: number): SchedaOpis =>
  ({
    totale_schede: totale,
    domande: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
  }) as SchedaOpis;

const buildTeaching = (id: number, nome: string, totale: number): Teaching => ({
  id,
  codice_gomp: id,
  nome,
  anno_accademico: '2024/2025',
  anno: '1',
  semestre: '1',
  cfu: '6',
  docente: 'Prof X',
  canale: 'no',
  id_modulo: 0,
  nome_modulo: '',
  tipo: '',
  ssd: '',
  assegn: '',
  id_cds: 1,
  schedeopis: buildSchedaOpis(totale),
});

describe('YearStats', () => {
  let component: YearStats;
  let fixture: ComponentFixture<YearStats>;

  const teachings = [
    buildTeaching(1, 'Algebra', 10),
    buildTeaching(2, 'Analisi', 80),
    buildTeaching(3, 'Fisica', 40),
  ];

  const cdsServiceMock = {
    cdsSelected: signal({ ...exampleCDS, scostamento_media: 0, scostamento_numerosita: 0 }),
    getInfoCds: mockResource({
      hasValue: signal(true),
      value: signal({
        teachings,
        courses: { '2024/2025': [[3, 3, 3], [[3, 3, 3], [3, 3, 3], [3, 3, 3]]] },
        teachingsByYear: { '2024/2025': teachings },
      }),
    }),
    isLoading: signal(false),
  };

  const graphServiceMock = {
    selectedYear: signal('2024/2025'),
    selectedVIndex: signal(0),
    elaborateFormulaFor: vi.fn(() => [
      [3, 3, 3],
      [
        [1, 5, 3],
        [1, 5, 3],
        [1, 5, 3],
      ],
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearStats],
      providers: [
        { provide: CdsService, useValue: cdsServiceMock },
        { provide: GraphService, useValue: graphServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(YearStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[YEAR_STATS]: created', () => expect(component).toBeTruthy());

  it('[YEAR_STATS]: computes nCdsMean as rounded mean of totale_schede', () => {
    expect(component['nCdsMean']()).toBeCloseTo((10 + 80 + 40) / 3, 2);
  });

  it('[YEAR_STATS]: classifies teachings into bad/good buckets', () => {
    const stats = component['stats']();
    expect(stats.badVal.some((s) => s.startsWith('Algebra'))).toBe(true);
    expect(stats.goodVal.some((s) => s.startsWith('Analisi'))).toBe(true);
    expect(stats.badN.some((s) => s.startsWith('Algebra'))).toBe(true);
    expect(stats.goodN.some((s) => s.startsWith('Analisi'))).toBe(true);
  });
});
