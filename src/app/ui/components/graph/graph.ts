import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { OpisGroup, OpisGroupType } from '@enums/opis-group.enum';
import { GraphView } from '@interfaces/graph-config.interface';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'opis-graph',
  imports: [BaseChartDirective],
  template: ` @if (dataChart()) {
    <section id="graph">
      <canvas
        baseChart
        [data]="dataChart().data"
        [options]="chartOptions"
        [type]="dataChart().type"
      ></canvas>
    </section>
  }`,
  styleUrl: './graph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Graph implements OnInit {
  protected readonly chartOptions = this.setInitOptions();

  readonly dataChart = input.required<GraphView>();
  protected coloredDataChart: ChartData;

  ngOnInit(): void {
    this.addBrandColorToDataset();
  }

  private isOpisGroup(value: unknown): value is OpisGroupType {
    return Object.values(OpisGroup).includes(value as OpisGroupType);
  }

  private cssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private getColor(labelGroup: OpisGroupType) {
    const blue = this.cssVar('--blue-900');
    const red = this.cssVar('--red-900');
    const sand = this.cssVar('--sand-500');
    const defaultGrey = this.cssVar('--gray-700');

    const colors = new Map([
      [OpisGroup.Group1, blue],
      [OpisGroup.Group2, red],
      [OpisGroup.Group3, sand],
    ]);

    return colors.get(labelGroup) ?? defaultGrey;
  }

  private addBrandColorToDataset() {
    const datasets = this.dataChart().data.datasets;

    this.dataChart().data.datasets = datasets.map((set) => {
      const label = set.label;

      if (!this.isOpisGroup(label)) {
        return set;
      }

      const color = this.getColor(label);

      return {
        ...set,
        borderColor: color,
        backgroundColor: this.hexToRgba(color, 0.6),
      };
    });
  }

  private setInitOptions(): ChartConfiguration['options'] {
    return {
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {},
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    };
  }
}
