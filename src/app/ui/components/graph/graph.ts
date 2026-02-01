import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { GraphView } from '@interfaces/graph-config.interface';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'opis-graph',
  imports: [BaseChartDirective ],
  template: `
  @if (dataChart()) {
    <section id=graph>
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

  ngOnInit(): void {
    console.log(this.dataChart().data);
    
  }

  private setInitOptions(): ChartConfiguration['options'] {
    return {
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 10,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    }
  }
}
