import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { CDS } from '../api.model';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-cds',
  templateUrl: './cds.component.html',
  styleUrls: ['./cds.component.scss']
})
export class CdsComponent implements OnChanges {

  @Input() vCds: { [year: string]: number[]};
  @Input() selectedCds: CDS;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('vCds')) {
      this.showCdsBoxplot();
    }
  }

  constructor(
    private readonly graphService: GraphService,
  ) { }

  public showCdsBoxplot(): void {
    const sharedProps = { borderWidth: 1, outlierColor: '#999999', padding: 10, itemRadius: 0 };
    const boxplotData = {
      // define label tree
      labels: [''],
      datasets: [
        { label: 'V1', backgroundColor: 'rgba(255,0,0,0.5)', borderColor: 'red',   ...sharedProps,
          data: [Object.values(this.vCds).map(array => array[0]).map(val => this.graphService.round(val)) ] },
        { label: 'V2', backgroundColor: 'rgba(0,255,0,0.5)', borderColor: 'green', ...sharedProps,
          data: [Object.values(this.vCds).map(array => array[1]).map(val => this.graphService.round(val)) ] },
        { label: 'V3', backgroundColor: 'rgba(0,0,255,0.5)', borderColor: 'blue',  ...sharedProps,
          data: [Object.values(this.vCds).map(array => array[2]).map(val => this.graphService.round(val)) ] },
      ],
    };

    document.getElementById('corso-studio').innerHTML = '<canvas id="cds-canvas"></canvas>';

    const ctx = (document.getElementById('cds-canvas') as HTMLCanvasElement).getContext('2d');
    const chart = new Chart(ctx, {
      type: 'horizontalBoxplot',
      data: boxplotData,
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'CDS Stats'
        }
      }
    });
  }

}
