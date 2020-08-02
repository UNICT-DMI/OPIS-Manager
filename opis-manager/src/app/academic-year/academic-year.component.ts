import { Component, Input, SimpleChanges } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { GraphService } from '../graph.service';
import { Chart } from 'chart.js';
import CONF from '../../assets/config.json';
import { Config } from '../utils.model';

@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnChanges {

  @Input() vCds;
  @Input() selectedCds;

  private teachings: any[];
  public isAdmin = false;
  private charts: Chart[] = [];

  public v1meanDeviation: number;
  public v2meanDeviation: number;
  public v3meanDeviation: number;
  public meanSliderOptions: Options = {
    floor: 0,
    ceil: 10,
    step: 0.5,
    minLimit: 0.5,
    maxLimit: 10,
    showTicks: true,
  };

  public numerosityDeviation: number;
  public numerositySliderOptions: Options = {
    floor: 5,
    ceil: 100,
    step: 5,
    minLimit: 5,
    maxLimit: 100,
    showTicks: true,
  };

  readonly faSearch = faSearch;
  readonly CONF: Config = CONF;

  switcherValues = 1;
  subject: string;
  selectedYear: string;


  constructor(
    private readonly http: HttpClient,
    private readonly graphService: GraphService,
  ) {
    this.v1meanDeviation = this.v2meanDeviation = this.v3meanDeviation = 1;
    this.numerosityDeviation = 20;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('selectedCds')) {
      this.getSchedeOfCdsForSelectedYearAndShowAcademicYearChart();
    }
  }

  // TODO: refactor / remove or use Output()
  public switchVal(v: number): void {
    this.switcherValues = v;
  }

  public getSchedeOfCdsForSelectedYearAndShowAcademicYearChart(): void {
    if (this.selectedYear !== '--') {
      this.http.get(CONF.apiUrl + 'schede?cds=' + this.selectedCds + '&anno_accademico=' + this.selectedYear)
        .subscribe((data) => {
        this.teachings = this.graphService.parseInsegnamentoSchede(data, this.subject).sort((a, b) => {
          if (a.anno === b.anno) {
            if (a.nome_completo < b.nome_completo) {
              return -1;
            } else if (a.nome_completo > b.nome_completo) {
              return 1;
            } else {
              return 0;
            }
          } else if (a.anno < b.anno) {
            return -1;
          } else {
            return 1;
          }
        });

        let means: any;
        let values: any;
        [means, values] = this.graphService.elaborateFormula(this.teachings);

        this.showAcademicYearChart(values);
      });
    }
  }

  private showAcademicYearChart(values): void {
    const minSchede = Math.min.apply(Math, this.teachings.map((o) => o.tot_schedeF));
    const maxSchede = Math.max.apply(Math, this.teachings.map((o) => o.tot_schedeF));

    this.teachings.splice(0, 0, {
      nome: '1 anno',
      anno: '1',
      docente: '',
      tot_schedeF: minSchede
    });

    values[0].splice(0, 0, '0');
    values[1].splice(0, 0, '0');
    values[2].splice(0, 0, '0');

    for (let i = 2; i < this.teachings.length; i++) {
      if (this.teachings[i].anno !== this.teachings[i - 1].anno) {
        const year = this.teachings[i].anno;
        this.teachings.splice(i, 0, {
          anno: year,
          nome: year + ' anno',
          docente: '',
          tot_schedeF: minSchede
        });
        values[0].splice(i, 0, '0');
        values[1].splice(i, 0, '0');
        values[2].splice(i, 0, '0');
      }
    }

    const fitColorInsegnamenti = this.getColorTeachings(maxSchede, minSchede);

    const materie: string[] = this.teachings.map(a => a.nome); // labels chartjs
    const docenti: string[] = this.teachings.map(a => a.docente); // tooltips/labels
    const materieComplete: string[] = this.teachings.map(a => a.nome_completo); // labels chartjs

    // chartjs stuff
    const ctx = [];

    // Destroy and recreate canvas to clear
    let canv: any = [];

    canv.push(document.getElementById('v1-canvas'));
    canv.push(document.getElementById('v2-canvas'));
    canv.push(document.getElementById('v3-canvas'));

    const parents = [];
    parents.push(canv[0].parentElement, canv[1].parentElement, canv[2].parentElement);

    parents[0].removeChild(canv[0]);
    parents[1].removeChild(canv[1]);
    parents[2].removeChild(canv[2]);

    const canvWidth = '90vw';
    const canvHeight = (this.teachings.length * 25) + 'px';
    const minHeight = '150px';

    for (let i = 0; i < 3; i++) {
      const canvs: any = document.createElement('canvas');
      canvs.id = 'v' + (i + 1) + '-canvas';
      canvs.style.width = canvWidth;
      canvs.style.height = canvHeight;
      canvs.style['min-height'] = minHeight;
      parents[i].appendChild(canvs);
    }

    canv = [];
    canv.push(document.getElementById('v1-canvas'));
    canv.push(document.getElementById('v2-canvas'));
    canv.push(document.getElementById('v3-canvas'));

    ctx.push(canv[0].getContext('2d'));
    ctx.push(canv[1].getContext('2d'));
    ctx.push(canv[2].getContext('2d'));


    for (const c of Object.keys(ctx)) {
      // tslint:disable-next-line: variable-name
      const _options = {
        scales: {
          xAxes: [{ ticks: { beginAtZero: true } }],
          yAxes: [
            { ticks: { beginAtZero: true } }
          ],
        },
        tooltips: {
          titleFontSize: 25,
          bodyFontSize: 25,
          callbacks: {
            title: (data) => materieComplete[data[0].index],
            label: (data) => ' ' + docenti[data.index] + ' ' + data.value,
          }
        },
        responsive: false,
        legend: { display: false },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: this.vCds[this.selectedCds][c][this.getIndexFromSelectedYear()],
              borderColor: 'red',
              label: {
                content: 'Media CDS',
                enabled: true,
                position: 'top'
              }
            }
          ]
        },
      };

      // chartjs data
      // tslint:disable-next-line: variable-name
      const _data = {
        labels: materie,
        datasets: [{
          data: values[c],
          backgroundColor: fitColorInsegnamenti,
          hoverBackgroundColor: fitColorInsegnamenti,
          fill: true,
          borderWidth: 1
        }]
      };

      const opt = Object.assign({}, _options);

      this.charts.push(new Chart(ctx[c], {
        type: 'horizontalBar',
        data: _data,
        options: opt
      }));
    }
  }

  private getIndexFromSelectedYear(): number {
    return parseInt(this.selectedYear.charAt(3), 10) - 3;
  }

  private getColorTeachings(maxSchede: number, minSchede: number): string[] {
    let Rx: number;
    let Gx: number;
    let Bx: number;
    const RGB1 = [255, 200, 45];
    const RGB2 = [0, 121, 107];

    const colorInsegnamenti = [];

    for (const i of Object.keys(this.teachings)) {
      Rx = RGB1[0] + ((RGB2[0] - RGB1[0]) * (this.teachings[i].tot_schedeF - minSchede) / (maxSchede - minSchede));
      Gx = RGB1[1] + ((RGB2[1] - RGB1[1]) * (this.teachings[i].tot_schedeF - minSchede) / (maxSchede - minSchede));
      Bx = RGB1[2] + ((RGB2[2] - RGB1[2]) * (this.teachings[i].tot_schedeF - minSchede) / (maxSchede - minSchede));

      colorInsegnamenti.push(`rgba(${Rx.toFixed(2)}, ${Gx.toFixed(2)}, ${Bx.toFixed(2)}, 1)`);
    }

    return colorInsegnamenti;
  }

}
