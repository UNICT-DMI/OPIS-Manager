import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { GraphResolvers, SelectorResolvers } from './graph-resolvers.value';
import { GraphMapper } from '@mappers/graph.mapper';
import { GraphView } from '@interfaces/graph-config.interface';
import { AcademicYear } from '@values/years';

type CdsArg = Parameters<typeof GraphResolvers>[0];
type TeachingArg = Parameters<typeof GraphResolvers>[1];
type GraphSvcArg = NonNullable<Parameters<typeof GraphResolvers>[2]>;
type SelectorCdsArg = Parameters<typeof SelectorResolvers>[0];

// ─── Mock factory ─────────────────────────────────────────────────────────────
const mockResource = (value: unknown = null): { value: WritableSignal<unknown> } => ({
  value: signal(value),
});

// ─── GraphResolvers ───────────────────────────────────────────────────────────
describe('GraphResolvers', () => {
  it('cds_general: should return null when infoCds has no value', () => {
    const resolvers = GraphResolvers(
      mockResource() as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
    );
    expect(resolvers.cds_general()).toBeNull();
  });

  it('cds_general: should call GraphMapper.toCdsGeneralGraph when data is available', () => {
    vi.spyOn(GraphMapper, 'toCdsGeneralGraph').mockReturnValue({} as unknown as GraphView);

    const courses = { '2023/2024': [] };
    const infoCds = mockResource({ teachings: [], courses });
    const resolvers = GraphResolvers(
      infoCds as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
    );

    resolvers.cds_general();

    expect(GraphMapper.toCdsGeneralGraph).toHaveBeenCalledWith(courses);
  });

  it('teaching_cds: should return null when infoTeaching has no value', () => {
    const resolvers = GraphResolvers(
      mockResource() as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
    );
    expect(resolvers.teaching_cds()).toBeNull();
  });

  it('teaching_cds: should call GraphMapper.toTeachingGraph when data is available', () => {
    vi.spyOn(GraphMapper, 'toTeachingGraph').mockReturnValue({} as unknown as GraphView);

    const teachingData = { id: 1 };
    const resolvers = GraphResolvers(
      mockResource() as unknown as CdsArg,
      mockResource(teachingData) as unknown as TeachingArg,
    );

    resolvers.teaching_cds();

    expect(GraphMapper.toTeachingGraph).toHaveBeenCalledWith(teachingData);
  });

  it('cds_general: should map the range-filtered courses when a graphService is given', () => {
    vi.spyOn(GraphMapper, 'toCdsGeneralGraph').mockReturnValue({} as unknown as GraphView);

    const courses = { '2014/2015': [], '2020/2021': [] };
    const filtered = { '2020/2021': [] };
    const graphService = { filterMeansByRange: vi.fn().mockReturnValue(filtered) };

    const resolvers = GraphResolvers(
      mockResource({ teachings: [], courses }) as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );

    resolvers.cds_general();

    expect(graphService.filterMeansByRange).toHaveBeenCalledWith(courses);
    expect(GraphMapper.toCdsGeneralGraph).toHaveBeenCalledWith(filtered);
  });

  it('teaching_cds: should map the range-filtered means when a graphService is given', () => {
    vi.spyOn(GraphMapper, 'toTeachingGraph').mockReturnValue({} as unknown as GraphView);

    const means = { '2014/2015': [], '2020/2021': [] };
    const filtered = { '2014/2015': [] };
    const graphService = { filterMeansByRange: vi.fn().mockReturnValue(filtered) };

    const resolvers = GraphResolvers(
      mockResource() as unknown as CdsArg,
      mockResource(means) as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );

    resolvers.teaching_cds();

    expect(graphService.filterMeansByRange).toHaveBeenCalledWith(means);
    expect(GraphMapper.toTeachingGraph).toHaveBeenCalledWith(filtered);
  });

  it('cds_year: should return null without data or year', () => {
    const resolvers = GraphResolvers(
      mockResource() as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
    );
    expect(resolvers.cds_year()).toBe(null);
  });

  it('cds_year: should return null when selectedYear is not set', () => {
    const infoCds = mockResource({ teachingsByYear: {}, courses: {} });
    const graphService = {
      selectedYear: signal(null),
      teachingSearch: signal(''),
      selectedVIndex: signal(0),
      elaborateFormulaFor: vi.fn(),
    };
    const resolvers = GraphResolvers(
      infoCds as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );
    expect(resolvers.cds_year()).toBe(null);
  });

  it('cds_year: should return null when no teachings match for the selected year', () => {
    const infoCds = mockResource({ teachingsByYear: { '2023/2024': [] }, courses: {} });
    const graphService = {
      selectedYear: signal('2023/2024'),
      teachingSearch: signal(''),
      selectedVIndex: signal(0),
      elaborateFormulaFor: vi.fn(),
    };
    const resolvers = GraphResolvers(
      infoCds as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );
    expect(resolvers.cds_year()).toBe(null);
  });

  it('cds_year: should filter, sort and call GraphMapper.toAcademicYearGraph', () => {
    const spy = vi.spyOn(GraphMapper, 'toAcademicYearGraph').mockReturnValue({} as unknown as GraphView);

    const teachings = [
      { id: 1, nome: 'Fisica', anno: 2, schedeopis: { domande: [[1]] } },
      { id: 2, nome: 'Algebra', anno: 1, schedeopis: { domande: [[1]] } },
      { id: 3, nome: 'NoSchede', anno: 1, schedeopis: { domande: null } },
    ];
    const infoCds = mockResource({
      teachingsByYear: { '2023/2024': teachings },
      courses: { '2023/2024': [[5, 6, 7]] },
    });
    const graphService = {
      selectedYear: signal('2023/2024'),
      teachingSearch: signal(''),
      selectedVIndex: signal(1),
      elaborateFormulaFor: vi.fn(() => [
        [0, 0, 0],
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      ]),
    };

    const resolvers = GraphResolvers(
      infoCds as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );
    resolvers.cds_year();

    expect(graphService.elaborateFormulaFor).toHaveBeenCalled();
    const [teachingsArg, valuesArg, cdsMeanArg, vIndexArg] = spy.mock.calls[0];
    expect((teachingsArg as { id: number }[]).map((t) => t.id)).toEqual([2, 1]);
    expect(valuesArg).toEqual([3, 4]);
    expect(cdsMeanArg).toBe(6);
    expect(vIndexArg).toBe(1);
  });

  it('cds_year: should filter by search query (case-insensitive)', () => {
    const spy = vi.spyOn(GraphMapper, 'toAcademicYearGraph').mockReturnValue({} as unknown as GraphView);
    spy.mockClear();

    const teachings = [
      { id: 1, nome: 'Fisica', anno: 1, schedeopis: { domande: [[1]] } },
      { id: 2, nome: 'Algebra', anno: 1, schedeopis: { domande: [[1]] } },
    ];
    const infoCds = mockResource({
      teachingsByYear: { '2023/2024': teachings },
      courses: { '2023/2024': [[1, 2, 3]] },
    });
    const graphService = {
      selectedYear: signal('2023/2024'),
      teachingSearch: signal('fisica'),
      selectedVIndex: signal(0),
      elaborateFormulaFor: vi.fn(() => [
        [0, 0, 0],
        [[1], [2], [3]],
      ]),
    };

    const resolvers = GraphResolvers(
      infoCds as unknown as CdsArg,
      mockResource() as unknown as TeachingArg,
      graphService as unknown as GraphSvcArg,
    );
    resolvers.cds_year();

    const [teachingsArg] = spy.mock.calls[0];
    expect((teachingsArg as { id: number }[]).map((t) => t.id)).toEqual([1]);
  });
});

// ─── SelectorResolvers ────────────────────────────────────────────────────────
describe('SelectorResolvers', () => {
  it('teaching_cds: should return empty array when infoCds has no value', () => {
    const resolvers = SelectorResolvers(mockResource() as unknown as SelectorCdsArg, signal([]));
    expect(resolvers.teaching_cds()).toEqual([]);
  });

  it('teaching_cds: should map teachings to SelectOption[]', () => {
    const teachings = [
      { id: 1, nome: 'Matematica', canale: 'A - L' },
      { id: 2, nome: 'Fisica', canale: 'no' },
    ];
    const infoCds = mockResource({ teachings, courses: {} });
    const resolvers = SelectorResolvers(infoCds as unknown as SelectorCdsArg, signal([]));

    expect(resolvers.teaching_cds()).toEqual([
      { value: 1, label: 'Matematica (A - L)' },
      { value: 2, label: 'Fisica' },
    ]);
  });

  it('cds_year: should return empty array when no years available', () => {
    const resolvers = SelectorResolvers(mockResource() as unknown as SelectorCdsArg, signal([]));
    expect(resolvers.cds_year()).toEqual([]);
  });

  it('cds_year: should map years to SelectOption[]', () => {
    const years = ['2022/2023', '2023/2024'] as AcademicYear[];
    const resolvers = SelectorResolvers(mockResource() as unknown as SelectorCdsArg, signal(years));

    expect(resolvers.cds_year()).toEqual([
      { value: '2023/2024', label: '2023/2024' },
      { value: '2022/2023', label: '2022/2023' },
    ]);
  });
});
