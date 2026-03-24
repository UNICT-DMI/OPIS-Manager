import { describe, it, expect } from 'vitest';
import { GraphMapper } from './graph.mapper';
import { MeansPerYear } from '@c_types/means-graph.type';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';
import { exampleSchedaOpis } from '@mocks/scheda-mock';

const YEAR_A = '2019/2020' as AcademicYear;
const YEAR_B = '2020/2021' as AcademicYear;

const makeMeans = (v1: number, v2: number, v3: number): MeansPerYear[AcademicYear] => [
  [v1, v2, v3],
  [],
];

const makeScheda = (overrides?: Partial<SchedaOpis>): SchedaOpis => ({
  ...exampleSchedaOpis,
  ...overrides,
});

const TWO_YEARS: MeansPerYear = {
  [YEAR_A]: makeMeans(1, 2, 3),
  [YEAR_B]: makeMeans(4, 5, 6),
} as MeansPerYear;

const ONE_YEAR: MeansPerYear = {
  [YEAR_A]: makeMeans(7, 8, 9),
} as MeansPerYear;

describe('GraphMapper', () => {
  describe('toCdsGeneralGraph / toTeachingGraph', () => {
    it('[TO_CDS_GENERAL_GRAPH]: type is "line"', () => {
      expect(GraphMapper.toCdsGeneralGraph(ONE_YEAR).type).toBe('line');
    });

    it('[TO_TEACHING_GRAPH]: type is "line"', () => {
      expect(GraphMapper.toTeachingGraph(ONE_YEAR).type).toBe('line');
    });

    it('[BUILD_LINE_GRAPH]: toCdsGeneralGraph and toTeachingGraph share the same implementation', () => {
      expect(GraphMapper.toCdsGeneralGraph).toBe(GraphMapper.toTeachingGraph);
    });

    it('[BUILD_LINE_GRAPH]: dataset labels are V1, V2, V3', () => {
      const { data } = GraphMapper.toCdsGeneralGraph(TWO_YEARS);
      expect(data.datasets.map((d) => d.label)).toEqual(['V1', 'V2', 'V3']);
    });

    it('[BUILD_LINE_GRAPH]: V1 data maps yearMeans[0] for each year', () => {
      const { data } = GraphMapper.toCdsGeneralGraph(TWO_YEARS);
      expect(data.datasets[0].data).toEqual([1, 4]);
    });

    it('[BUILD_LINE_GRAPH]: V2 data maps yearMeans[1] for each year', () => {
      const { data } = GraphMapper.toCdsGeneralGraph(TWO_YEARS);
      expect(data.datasets[1].data).toEqual([2, 5]);
    });

    it('[BUILD_LINE_GRAPH]: V3 data maps yearMeans[2] for each year', () => {
      const { data } = GraphMapper.toCdsGeneralGraph(TWO_YEARS);
      expect(data.datasets[2].data).toEqual([3, 6]);
    });

    it('[BUILD_LINE_GRAPH]: empty means, labels and datasets data are empty arrays', () => {
      const { data } = GraphMapper.toCdsGeneralGraph({} as MeansPerYear);
      expect(data.labels).toEqual([]);
      data.datasets.forEach((ds) => expect(ds.data).toEqual([]));
    });

    it('[BUILD_LINE_GRAPH]: datasets are copies, mutating result does not affect input', () => {
      const { data } = GraphMapper.toCdsGeneralGraph(ONE_YEAR);
      (data.datasets[0].data as number[]).push(99);
      const again = GraphMapper.toCdsGeneralGraph(ONE_YEAR);
      expect(again.data.datasets[0].data).toEqual([7]);
    });
  });

  describe('groupByYear', () => {
    it('[GROUP_BY_YEAR]: returns a record with all academic years as keys', () => {
      const result = GraphMapper.groupByYear([], () => makeScheda({ id: 0, anno_accademico: '' }));
      ACADEMIC_YEARS.forEach((y) => expect(result).toHaveProperty(y));
    });

    it('[GROUP_BY_YEAR]: empty input, all buckets are empty arrays', () => {
      const result = GraphMapper.groupByYear([], () => makeScheda({ id: 0, anno_accademico: '' }));
      Object.values(result).forEach((bucket) => expect(bucket).toEqual([]));
    });

    it('[GROUP_BY_YEAR]: item lands in the correct year bucket', () => {
      const scheda = makeScheda({ id: 1, anno_accademico: YEAR_A });
      const result = GraphMapper.groupByYear([{ anno_accademico: YEAR_A }], () => scheda);
      expect(result[YEAR_A]).toContain(scheda);
    });

    it('[GROUP_BY_YEAR]: item with unknown year is silently ignored', () => {
      const result = GraphMapper.groupByYear([{ anno_accademico: '1999/2000' }], () =>
        makeScheda({ id: 0, anno_accademico: '1999/2000' }),
      );
      Object.values(result).forEach((bucket) => expect(bucket).toEqual([]));
    });

    it('[GROUP_BY_YEAR]: multiple items same year, all appended in order', () => {
      const s1 = makeScheda({ id: 1, anno_accademico: YEAR_A });
      const s2 = makeScheda({ id: 2, anno_accademico: YEAR_A });
      const schedas = [s1, s2];
      let i = 0;
      const result = GraphMapper.groupByYear(
        [{ anno_accademico: YEAR_A }, { anno_accademico: YEAR_A }],
        () => schedas[i++],
      );
      expect(result[YEAR_A]).toEqual([s1, s2]);
    });

    it('[GROUP_BY_YEAR]: items spread across different years', () => {
      const sA = makeScheda({ id: 1, anno_accademico: YEAR_A });
      const sB = makeScheda({ id: 2, anno_accademico: YEAR_B });
      const schedas = [sA, sB];
      let i = 0;
      const result = GraphMapper.groupByYear(
        [{ anno_accademico: YEAR_A }, { anno_accademico: YEAR_B }],
        () => schedas[i++],
      );
      expect(result[YEAR_A]).toEqual([sA]);
      expect(result[YEAR_B]).toEqual([sB]);
    });
  });
});
