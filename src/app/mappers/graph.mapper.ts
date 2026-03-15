import { MeansPerYear } from '@c_types/means-graph.type';
import { GraphView } from '@interfaces/graph-config.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { typedKeys } from '@utils/object-helpers.utils';
import { AcademicYear } from '@values/years';

/**
 * Pure mapping class: transforms pre-computed data into GraphView objects
 * compatible with ng-chart. No injected dependencies, no state.
 * Use static methods directly wherever needed (service, component, resolver).
 */
export class GraphMapper {

  private static buildLineGraph(means: MeansPerYear): GraphView {
    const labels: AcademicYear[] = [];
    const v1: number[] = [], v2: number[] = [], v3: number[] = [];

    for (const year of typedKeys(means)) {
      const [yearMeans] = means[year];
      labels.push(year);
      v1.push(yearMeans[0]);
      v2.push(yearMeans[1]);
      v3.push(yearMeans[2]);
    }

    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'V1', data: [...v1] },
          { label: 'V2', data: [...v2] },
          { label: 'V3', data: [...v3] },
        ],
      },
    };
  }

  static groupByYear<T extends { anno_accademico: string }>(
    items: T[],
    getScheda: (item: T) => SchedaOpis,
  ): Record<AcademicYear, SchedaOpis[]> {
    return items.reduce((acc, item) => {
      const year = item.anno_accademico as AcademicYear;
      
      if (!acc[year]) acc[year] = [];
      acc[year].push(getScheda(item));
      
      return acc;
    }, {} as Record<AcademicYear, SchedaOpis[]>);
  }

  static toCdsGeneralGraph = GraphMapper.buildLineGraph;
  static toTeachingGraph = GraphMapper.buildLineGraph;
}