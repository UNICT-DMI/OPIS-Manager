import { MeansPerYear } from '@c_types/means-graph.type';
import { GraphView } from '@interfaces/graph-config.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { boxplotStats, round } from '@utils/statistics.utils/statistics.utils';
import { typedKeys } from '@utils/object-helpers.utils';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';
import { ChartData, ChartType } from 'chart.js';

/**
 * Pure mapping class: transforms pre-computed data into GraphView objects
 * compatible with ng-chart. No injected dependencies, no state.
 * Use static methods directly wherever needed (service, component, resolver).
 */
export class GraphMapper {
  private static buildLineGraph(means: MeansPerYear): GraphView {
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

  static groupByYear<T extends { anno_accademico: string }>(
    items: T[],
    getScheda: (item: T) => SchedaOpis,
  ): Record<AcademicYear, SchedaOpis[]> {
    const initial = Object.fromEntries(
      ACADEMIC_YEARS.map((year) => [year, []]),
    ) as unknown as Record<AcademicYear, SchedaOpis[]>;

    return items.reduce((acc, item) => {
      const year = item.anno_accademico as AcademicYear;
      acc[year]?.push(getScheda(item));
      return acc;
    }, initial);
  }
  static toCdsGeneralGraph = GraphMapper.buildLineGraph;
  static toTeachingGraph = GraphMapper.buildLineGraph;

  static toAcademicYearGraph(
    teachings: Teaching[],
    values: number[],
    cdsMean: number | null = null,
    vIndex: 0 | 1 | 2 = 0,
  ): GraphView {
    const vLabel = `V${vIndex + 1}`;
    const schedeCounts = teachings.map((t) => t.schedeopis?.totale_schede ?? 0);
    const colors = GraphMapper.buildSchedeColorGradient(schedeCounts);

    const labels = teachings.map((t) =>
      t.canale && t.canale !== 'no' ? `${t.nome} (${t.canale})` : t.nome,
    );

    const meta = teachings.map((t, i) => ({
      docente: t.docente ?? '—',
      schede: schedeCounts[i],
      label: labels[i],
    }));

    const annotations: Record<string, object> = {};
    if (cdsMean != null && Number.isFinite(cdsMean)) {
      annotations['cdsMean'] = {
        type: 'line',
        xMin: cdsMean,
        xMax: cdsMean,
        borderColor: 'red',
        borderWidth: 2,
        label: {
          content: `Media ${vLabel} CDS`,
          display: true,
          position: 'end',
          backgroundColor: 'red',
          color: 'white',
          font: { size: 11 },
        },
      };
    }

    return {
      type: 'bar',
      heightPx: 80 + teachings.length * 32,
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleFont: { size: 16 },
            bodyFont: { size: 15 },
            padding: 10,
            callbacks: {
              title: (items) => meta[items[0].dataIndex]?.label ?? '',
              label: (item): string | string[] => {
                const m = meta[item.dataIndex];
                if (!m) return '';
                return [
                  `Docente: ${m.docente}`,
                  `Schede OPIS: ${m.schede}`,
                  `${vLabel}: ${item.parsed.x}`,
                ];
              },
            },
          },
          annotation: { annotations },
        },
      },
    };
  }

  static toBoxplotGraph(valuesPerV: number[][]): GraphView {
    const groups = ['V1', 'V2', 'V3'] as const;
    const allStats = groups.map((_, i) => boxplotStats(valuesPerV[i] ?? []));

    const dataMin = Math.min(...allStats.map((s) => s.min));
    const dataMax = Math.max(...allStats.map((s) => s.max));
    const padding = Math.max(0.5, round((dataMax - dataMin) * 0.1));

    return {
      type: 'boxplot' as ChartType,
      data: {
        labels: [''],
        datasets: groups.map((label, i) => ({
          label,
          data: [allStats[i]],
        })),
      } as unknown as ChartData,
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            min: round(dataMin - padding),
            max: round(dataMax + padding),
          },
        },
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (item) => {
                const p = item.raw as {
                  min: number;
                  q1: number;
                  median: number;
                  mean: number;
                  q3: number;
                  max: number;
                };
                return [
                  `Min: ${p.min}`,
                  `Q1: ${p.q1}`,
                  `Mediana: ${p.median}`,
                  `Media: ${p.mean}`,
                  `Q3: ${p.q3}`,
                  `Max: ${p.max}`,
                ];
              },
            },
          },
        },
      },
    };
  }

  /**
   * Returns a yellow-to-green color per teaching, scaled by its schede count.
   * Yellow (255, 200, 45) at min schede, green (0, 121, 107) at max schede.
   */
  private static buildSchedeColorGradient(schedeCounts: number[]): string[] {
    if (schedeCounts.length === 0) return [];

    const min = Math.min(...schedeCounts);
    const max = Math.max(...schedeCounts);
    const range = max - min;
    const yellow = [255, 200, 45] as const;
    const green = [0, 121, 107] as const;

    return schedeCounts.map((count) => {
      const t = range === 0 ? 1 : (count - min) / range;
      const r = Math.round(yellow[0] + (green[0] - yellow[0]) * t);
      const g = Math.round(yellow[1] + (green[1] - yellow[1]) * t);
      const b = Math.round(yellow[2] + (green[2] - yellow[2]) * t);
      return `rgba(${r}, ${g}, ${b}, 1)`;
    });
  }
}
