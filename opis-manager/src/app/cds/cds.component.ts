import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-cds',
  templateUrl: './cds.component.html',
  styleUrls: ['./cds.component.scss']
})
export class CdsComponent implements OnInit {
  @Input() vCds;
  @Input() selectedCds;

  constructor(
    public readonly configService: ConfigService,
  ) { }

  ngOnInit(): void {
    if (!this.configService.config.apiUrl) {
      // wait to get the config
      this.configService.updateConfig().toPromise().then(() => {
        this.showCdsBoxplot();
      });
    } else { // do not wait for the config
      this.showCdsBoxplot();
    }
  }

  public showCdsBoxplot(): void {
    const sharedProps = { borderWidth: 1, outlierColor: '#999999', padding: 10, itemRadius: 0 };
    const boxplotData = {
      // define label tree
      labels: [''],
      datasets: [
        { label: 'V1', backgroundColor: 'rgba(255,0,0,0.5)', borderColor: 'red',   ...sharedProps, data: [this.vCds[this.selectedCds][0]] },
        { label: 'V2', backgroundColor: 'rgba(0,255,0,0.5)', borderColor: 'green', ...sharedProps, data: [this.vCds[this.selectedCds][1]] },
        { label: 'V3', backgroundColor: 'rgba(0,0,255,0.5)', borderColor: 'blue',  ...sharedProps, data: [this.vCds[this.selectedCds][2]] },
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
