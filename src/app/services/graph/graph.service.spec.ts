import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, beforeEach, expect } from 'vitest';
import { GraphService } from './graph.service';
import { QuestionService } from '@services/questions/questions.service';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { CHART_BTNS } from '@values/selection-graph';
import { exampleSchedaOpis } from '@mocks/scheda-mock';
import { firstValueFrom } from 'rxjs';
import { AcademicYear } from '@values/years';

// ─── Mock SchedaOpis factory ──────────────────────────────────────────────────
const mockScheda = (overrides: Partial<SchedaOpis> = {}): SchedaOpis => ({ ...exampleSchedaOpis, ...overrides});

// ─── Mock QuestionService ─────────────────────────────────────────────────────
const buildMockQuestionService = () => ({
  questionWeights: [
    { id: 1, gruppo: 'V1', peso_standard: 1 },
    { id: 2, gruppo: 'V2', peso_standard: 1 },
    { id: 3, gruppo: 'V3', peso_standard: 1 },
  ],
});

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('GraphService', () => {
  let service: GraphService;
  let mockQuestionService: ReturnType<typeof buildMockQuestionService>;

  beforeEach(() => {
    mockQuestionService = buildMockQuestionService();

    TestBed.configureTestingModule({
      providers: [
        GraphService,
        { provide: QuestionService, useValue: mockQuestionService },
      ],
    });

    service = TestBed.inject(GraphService);
  });

  // ── graphKeySelected ──────────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should initialize graphKeySelected as cds_general', () => {
    expect(service.graphKeySelected()).toBe('cds_general');
  });

  it('[GRAPH-SERVICE]: should update graphKeySelected', () => {
    service.graphKeySelected.set('teaching_cds');
    expect(service.graphKeySelected()).toBe('teaching_cds');
  });

  // ── graphBtns ─────────────────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should initialize graphBtns with CHART_BTNS', () => {
    expect(service.graphBtns()).toEqual(CHART_BTNS);
  });

  // ── manageGraphSelection ──────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should set cds_general as active on init', async () => {
    await new Promise(r => setTimeout(r, 0));
    const activeBtns = service.graphBtns().filter(b => b.active);
    expect(activeBtns.length).toBe(1);
    expect(activeBtns[0].value).toBe('cds_general');
  });

  it('[GRAPH-SERVICE]: should update active button when graphKeySelected changes', async () => {
    service.graphKeySelected.set('teaching_cds');
    await new Promise(r => setTimeout(r, 0));
    const activeBtns = service.graphBtns().filter(b => b.active);
    expect(activeBtns.length).toBe(1);
    expect(activeBtns[0].value).toBe('teaching_cds');
  });

  // ── applyWeights ──────────────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should return [0,0,0] when totale_schede < 5', () => {
    const scheda = mockScheda({ totale_schede: 4 });
    expect(service['applyWeights'](scheda)).toEqual([0, 0, 0]);
  });

  it('[GRAPH-SERVICE]: should compute V1/V2/V3 correctly', () => {
    const scheda = mockScheda();
    expect(service['applyWeights'](scheda)).toEqual([1, 4, 7]);
  });

  it('[GRAPH-SERVICE]: should skip questions not found in questionWeights', () => {
    const scheda = mockScheda({
      domande: [
        [10, 0, 0, 0], // Q1 → V1
        [0, 10, 0, 0], // Q2 → V2
        [0, 0, 10, 0], // Q3 → V3
        [0, 0, 0, 10], // Q4 → not in weights, skipped
      ],
    });
    expect(service['applyWeights'](scheda)).toEqual([1, 4, 7]);
  });

  // ── elaborateFormulaFor ───────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should return means and per-schedule values', () => {
    const scheda = mockScheda();
    const [means, perSchedule] = service['elaborateFormulaFor']([scheda]);

    expect(means).toEqual([1, 4, 7]);
    expect(perSchedule).toEqual([[1], [4], [7]]);
  });

  it('[GRAPH-SERVICE]: should compute means across multiple schedules', () => {
    const scheda1 = mockScheda();
    const scheda2 = mockScheda({
      domande: [
        [0, 0, 0, 10], // Q1 → d=100, V1 += (100/10)*1 = 10
        [0, 0, 0, 10], // Q2 → d=100, V2 += (100/10)*1 = 10
        [0, 0, 0, 10], // Q3 → d=100, V3 += (100/10)*1 = 10
      ],
    });

    const [means] = service['elaborateFormulaFor']([scheda1, scheda2]);
    expect(means).toEqual([5.5, 7, 8.5]);
  });

  it('[GRAPH-SERVICE]: should return empty means for empty array', () => {
    const [means, perSchedule] = service['elaborateFormulaFor']([]);
    expect(means).toEqual([0, 0, 0]);
    expect(perSchedule).toEqual([[], [], []]);
  });

  // ── computeMeansPerYear ───────────────────────────────────────────────────
  it('[GRAPH-SERVICE]: should compute means for each academic year', () => {
    const schedeByYear = {
      '2020/2021': [mockScheda({ anno_accademico: '2020/2021' })],
      '2019/2020': [mockScheda({ anno_accademico: '2019/2020' })],
    } as Record<AcademicYear, SchedaOpis[]>;

    const result = service.computeMeansPerYear(schedeByYear);

    expect(result['2020/2021']).toBeDefined();
    expect(result['2019/2020']).toBeDefined();
    expect(result['2020/2021'][0]).toEqual([1, 4, 7]);
    expect(result['2019/2020'][0]).toEqual([1, 4, 7]);
  });

  it('[GRAPH-SERVICE]: should return empty object for empty input', () => {
    expect(service.computeMeansPerYear({} as any)).toEqual({});
  });
});