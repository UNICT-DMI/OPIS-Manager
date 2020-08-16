import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { GraphService } from '../graph.service';
import { Chart } from 'chart.js';
import CONF from '../../assets/config.json';
import { Config, TeachingSummary, SchedaOpis } from '../utils.model';
import { CDS } from '../api.model';

@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnChanges {

  @Input() vCds: { [year: string]: number[]};
  @Input() cdsSchede: CDS[];

  private teachings: TeachingSummary[];
  private charts: Chart[] = [];

  readonly faSearch = faSearch;
  readonly CONF: Config = CONF;

  switcherValues = 1;
  subject: string;
  selectedYear = '--';

  constructor(
    private readonly graphService: GraphService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('cdsSchede')) {
      this.showAcademicYearChartForSelectedYear();
    }
  }

  // TODO: refactor / remove or use Output()
  public switchVal(v: number): void {
    this.switcherValues = v;
  }

  public showAcademicYearChartForSelectedYear(): void {
    if (this.selectedYear !== '--') {
        this.teachings = this.graphService.parseInsegnamentoSchede(
          this.cdsSchede.filter(cds => cds.anno_accademico === this.selectedYear)
            .flatMap(cds => cds.insegnamenti), this.subject)
            .sort((t1, t2) => {
              if (t1.anno === t2.anno) {
                if (t1.nome_completo < t2.nome_completo) {
                  return -1;
                } else if (t1.nome_completo > t2.nome_completo) {
                  return 1;
                } else {
                  return 0;
                }
              } else if (t1.anno < t2.anno) {
                return -1;
              } else {
                return 1;
              }
          });

        let means: number[];
        let values: number[][];
        [means, values] = this.graphService.elaborateFormula(this.teachings
          .map(insegnamento => ({ totale_schede: insegnamento.tot_schedeF, domande: insegnamento.domande } as SchedaOpis) ));

        this.showAcademicYearChart(values);
    }
  }

  private showAcademicYearChart(values: number[][]): void {
    const minSchede = Math.min.apply(Math, this.teachings.map((o) => o.tot_schedeF));
    const maxSchede = Math.max.apply(Math, this.teachings.map((o) => o.tot_schedeF));

    this.insertYear(values, '1', 0);
    for (let i = 2; i < this.teachings.length; i++) {
      if (this.teachings[i].anno !== this.teachings[i - 1].anno) {
        this.insertYear(values, this.teachings[i].anno, i);
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
      console.log(c);
      console.log(this.vCds);
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
        responsive: true,
        legend: { display: false },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: this.vCds[this.selectedYear][c],
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

  private insertYear(values: number[][], year: string, position: number) {
    this.teachings.splice(position, 0, {
      nome: year + ' anno',
      nome_completo: year + ' anno',
      anno: year,
      canale: '',
      nome_modulo: '',
      id_modulo: 0,
      docente: '',
      domande: null,
      tot_schedeF: 0,
      tot_schedeNF: 0
    });

    values[0].splice(position, 0, 0);
    values[1].splice(position, 0, 0);
    values[2].splice(position, 0, 0);
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
