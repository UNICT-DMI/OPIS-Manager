import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faInfo, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ConfigService, Config } from '../config.service';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  readonly faInfo = faInfo;
  readonly faSearch = faSearch;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  departments: any = [];
  cds: any = [];
  teachings: any = [];

  selectedCds: number;
  selectedYear: string;

  vCds: number[][][] = [];

  currentOption: number;
  switcherValues = 1;
  subject: string;

  stepsYears: { value: number, legend: string }[] = [];

  constructor(
    public readonly configService: ConfigService,
    private readonly http: HttpClient,
    private readonly graphService: GraphService,
  ) { }

  ngOnInit(): void {

    if (!this.configService.config.apiUrl) {
      // wait to get the config
      this.configService.updateConfig().toPromise().then(() => {
        this.getAllDepartments();
      });
    } else { // do not wait for the config
      this.getAllDepartments();
    }

    // ChartJS Annotation plugin stuff
    const namedChartAnnotation = ChartAnnotation;
    namedChartAnnotation.id = 'annotation';
    Chart.pluginService.register(namedChartAnnotation);
  }

  public enableOption(val: number): void {
    this.currentOption = val;

    if (this.currentOption === 0) {
      this.showCdsBoxplot();
    }
  }

  public switchVal(v: number): void {
    this.switcherValues = v;
  }

  private resetSettings(): void {
    this.selectedCds = null;
  }

  private getAllDepartments(): void {
    this.http.get(this.configService.config.apiUrl + 'dipartimento').pipe(take(1)).subscribe((data) => {
      this.departments = data;
    });
  }

  public getAllCdsOfSelectedDepartment(department: number): void {
    this.http.get(this.configService.config.apiUrl + 'cds/' + department).pipe(take(1)).subscribe((data) => {
      this.cds = data;
      this.getCdsStats();
    });

    this.resetSettings();
  }

  public getAllTeachingsOfSelectedCds(cds: number): void {
    this.resetSettings();

    this.selectedCds = cds;

    this.http.get(this.configService.config.apiUrl + 'insegnamento/' + cds).subscribe((data) => {
      this.teachings = data;
    });
  }

  public getSchedeOfCdsForSelectedYearAndShowAcademicYearChart(): void {
    if (this.selectedYear !== '--') {
      this.http.get(this.configService.config.apiUrl + 'schede?cds=' + this.selectedCds + '&anno_accademico=' + this.selectedYear)
        .subscribe((data) => {
        const insegnamenti: any = this.parseSchede(data);

        let means: any;
        let values: any;
        [means, values] = this.elaborateFormula(insegnamenti);

        this.showAcademicYearChart(values, insegnamenti);
      });
    }
  }

  private parseSchede(schede): [] {
    let insegnamenti: any = [];

    for (let i = 0; i < schede.length; i++) {

      if (schede[i].tot_schedeF < 6) { continue; }
      if (this.subject != null && schede[i].nome.toUpperCase().indexOf(this.subject.toUpperCase()) === -1) { continue; }

      insegnamenti[i] = {};
      insegnamenti[i].nome = schede[i].nome;
      insegnamenti[i].anno = schede[i].anno;

      if (insegnamenti[i].nome.length > 35) {
        insegnamenti[i].nome = insegnamenti[i].nome.substring(0, 35) + '... ';
        insegnamenti[i].nome += insegnamenti[i].nome.substring(insegnamenti[i].nome.length - 5, insegnamenti[i].nome.length);
      }

      if (schede[i].canale.indexOf('no') === -1) {
        insegnamenti[i].nome += ' (' + schede[i].canale + ')';
      }

      if (schede[i].id_modulo.length > 3 && schede[i].id_modulo !== '0') {
        insegnamenti[i].nome += ' (' + schede[i].id_modulo + ')';
      }

      insegnamenti[i].nome += ' - ' + schede[i].tot_schedeF;
      insegnamenti[i].canale = schede[i].canale;
      insegnamenti[i].id_modulo = schede[i].id_modulo;
      insegnamenti[i].docente = schede[i].docente;
      insegnamenti[i].tot_schedeF = schede[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];

      let index = 0;
      for (let j = 0; j < schede[i].domande.length; j++) {
        if (j % 5 === 0 && j !== 0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(schede[i].domande[j]);
      }
    }

    // remove empty slot
    insegnamenti = insegnamenti.filter((el) => {
      return el != null;
    });

    return insegnamenti;
  }

  private getColorTeachings(insegnamenti: [], maxSchede: number, minSchede: number): string[] {
    let Rx: number;
    let Gx: number;
    let Bx: number;
    const RGB1 = [255, 200, 45];
    const RGB2 = [0, 121, 107];

    const colorInsegnamenti = [];

    for (const i of Object.keys(insegnamenti)) {
      Rx = RGB1[0] + ((RGB2[0] - RGB1[0]) * (insegnamenti[i].tot_schedeF - minSchede) / (maxSchede - minSchede));
      Gx = RGB1[1] + ((RGB2[1] - RGB1[1]) * (insegnamenti[i].tot_schedeF - minSchede) / (maxSchede - minSchede));
      Bx = RGB1[2] + ((RGB2[2] - RGB1[2]) * (insegnamenti[i].tot_schedeF - minSchede) / (maxSchede - minSchede));

      colorInsegnamenti.push(`rgba(${Rx.toFixed(2)}, ${Gx.toFixed(2)}, ${Bx.toFixed(2)}, 1)`);
    }

    return colorInsegnamenti;
  }

  private showAcademicYearChart(values, insegnamenti): void {
    const minSchede = Math.min.apply(Math, insegnamenti.map((o) => o.tot_schedeF));
    const maxSchede = Math.max.apply(Math, insegnamenti.map((o) => o.tot_schedeF));

    insegnamenti.splice(0, 0, {
      nome: '1 anno',
      anno: '1',
      docente: '',
      tot_schedeF: minSchede
    });

    values[0].splice(0, 0, '0');
    values[1].splice(0, 0, '0');
    values[2].splice(0, 0, '0');

    for (let i = 2; i < insegnamenti.length; i++) {
      if (insegnamenti[i].anno !== insegnamenti[i - 1].anno) {
        const year = insegnamenti[i].anno;
        insegnamenti.splice(i, 0, {
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

    const fitColorInsegnamenti = this.getColorTeachings(insegnamenti, maxSchede, minSchede);

    const materie: string[] = insegnamenti.map(a => a.nome); // labels chartjs
    const docenti: string[] = insegnamenti.map(a => a.docente); // tooltips/labels

    // chartjs stuff
    const charts = [];
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
    const canvHeight = (insegnamenti.length * 25) + 'px';
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
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
        tooltips: {
          titleFontSize: 25,
          bodyFontSize: 25,
          callbacks: {
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

      charts.push(new Chart(ctx[c], {
        type: 'horizontalBar',
        data: _data,
        options: opt
      }));
    }
  }

  private elaborateFormula(insegnamenti: []): [number[], string[][]] {
    const v1 = [];
    const v2 = [];
    const v3 = [];

    for (const i of Object.keys(insegnamenti)) {
      const [V1, V2, V3] = this.graphService.applyWeights(insegnamenti[i]);

      v1.push(V1);
      v2.push(V2);
      v3.push(V3);
    }

    const means = [0.0, 0.0, 0.0];

    for (const x of Object.keys(v1)) {
      means[0] += parseFloat(v1[x]);
      means[1] += parseFloat(v2[x]);
      means[2] += parseFloat(v3[x]);
    }
    means[0] = means[0] / v1.length;
    means[1] = means[1] / v2.length;
    means[2] = means[2] / v3.length;

    return [means, [v1, v2, v3]];
  }

  private getCdsStats(): void {
    for (const cds of this.cds) {
      const means$ = [];
      for (const year of this.configService.config.years) {
        means$.push(this.getMeans(year, cds.id));
      }

      this.vCds[cds.id] = [[], [], []];
      combineLatest(means$).pipe(takeUntil(this.destroy$)).subscribe((means: Array<Array<number>>) => {
        for (const v of means) {
          for (let i = 0; i < 3; i++) {
            this.vCds[cds.id][i].push(
              this.graphService.round(v[i], 4)
            );
          }
        }
      });
    }
  }

  private getMeans(year, cds): Observable<object> {
    return this.http.get(this.configService.config.apiUrl + 'schede?cds=' + cds + '&anno_accademico=' + year)
      .pipe(map((data) => {
        const insegnamenti = this.parseSchede(data);
        const [means, _] = this.elaborateFormula(insegnamenti);
        return means;
      }));
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

  private getIndexFromSelectedYear(): number {
    return parseInt(this.selectedYear.charAt(3), 10) - 3;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
