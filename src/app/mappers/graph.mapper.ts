import { MeansPerYear } from '@c_types/means-graph.type';
import { GraphView } from '@interfaces/graph-config.interface';
import { typedKeys } from '@utils/object-helpers.utils';
import { AcademicYear } from '@values/years';

/**
 * Pure mapping class: transforms pre-computed data into GraphView objects
 * compatible with ng-chart. No injected dependencies, no state.
 * Use static methods directly wherever needed (service, component, resolver).
 */
export class GraphMapper {

  /**
   * General CDS trend by academic year.
   * Input: V1/V2/V3 means already computed per year.
   */
  static toCdsGeneralGraph(means: MeansPerYear): GraphView {
    const labels: AcademicYear[] = [];
    const v1: number[] = [];
    const v2: number[] = [];
    const v3: number[] = [];

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

  static toTeachingGraph(means: MeansPerYear): GraphView {
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
}