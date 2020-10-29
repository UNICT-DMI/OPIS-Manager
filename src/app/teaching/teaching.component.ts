import { Component, EventEmitter, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { mean, std, variance } from 'mathjs';
import { Options } from '@m0t0r/ngx-slider';
import { GraphService } from '../services/graph/graph.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Teaching, SchedaOpis, CDS } from '../services/api/api.model';
import { ApiService } from '../services/api/api.service';
import { TeachingSchede, Config } from '../utils/utils.model';
import { getConf } from '../utils/utils';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.scss']
})
export class TeachingComponent implements OnInit, OnDestroy, OnChanges {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly CONF: Config;

  @Input() cds: CDS;
  @Input() teachings: Teaching[];
  @Input() vCds: { [year: string]: number[] };
  @Input() nCds: { [year: string]: number };

  selectedTeachingSchede: TeachingSchede[];
  selectedTeaching: number = null;
  showTeachingStats = false;
  switcherValues = 1;

  /* years slider */
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  minValue = 1;
  maxValue = 1;
  optionsSlider: Options;

  constructor(
    private readonly apiService: ApiService,
    private readonly graphService: GraphService,
  ) {
    this.CONF = getConf();

    this.optionsSlider = {
      floor: 1,
      ceil: 8,
      showTicksValues: true,
      getLegend: (value: number): string => this.CONF.years[value - 1],
    };
  }

  ngOnInit(): void {
    this.initOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('teachings')) {
      changes.teachings.currentValue.sort((a, b) => {
        if (a.nome < b.nome) {
          return -1;
        } else if (a.nome > b.nome) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  private initOptions(): void {
    this.maxValue = this.CONF.years.length;

    this.optionsSlider = {
      floor: 1,
      ceil: this.maxValue,
      showTicksValues: true,
      getLegend: (value: number): string => this.CONF.years[value - 1],
    };

    this.manualRefresh.emit();
  }

  // TODO: refactor / remove or use Output()
  public switchVal(v: number): void {
    this.switcherValues = v;
  }

  public toggleStats(): void {
    this.showTeachingStats = !this.showTeachingStats;
  }

  private showTeachingChart(teachingResults): void {
    let teachingName: any = document.getElementById('selTeaching');
    teachingName = this.teachings[this.selectedTeaching].nome;

    const charts = [];
    const matr = [[], [], []];

    const yearsArray = [...this.CONF.years].splice(this.minValue - 1, this.maxValue - this.minValue + 1);
    for (let i = 0; i < teachingResults.length; i++) {
      if (!yearsArray.includes(teachingResults[i].anno)) {
        teachingResults.splice(i--, 1);
      }
    }

    let j = 0;
    for (const i of Object.keys(yearsArray)) {
      if (j < teachingResults.length && yearsArray[i] === teachingResults[j].anno) {
        matr[0].push(this.graphService.round(teachingResults[j].v1));
        matr[1].push(this.graphService.round(teachingResults[j].v2));
        matr[2].push(this.graphService.round(teachingResults[j].v3));
        j++;
      } else {
        matr[0].push(0);
        matr[1].push(0);
        matr[2].push(0);
      }
    }

    const teachingMean: number[][] = [[], [], []];
    const cdsMean: number[][] = [[], [], []];

    for (let i = 0; i < this.CONF.years.length; i++) {
      for (let v = 0; v < 3; v++) {
        teachingMean[v][i] = this.graphService.round(mean(this.filterZero(matr[v])));
        cdsMean[v][i] = this.graphService.round(mean(Object.values(this.vCds).map(array => array[v])));
      }
    }

    this.calculateTeachingStats(matr);

    const [colorV1, colorV2, colorV3, colorV4] = [
      { fill: false, backgroundColor: '', borderColor: '#00897b', },
      { fill: false, backgroundColor: '#521a7d', borderColor: '#521a7d', },
      { fill: false, backgroundColor: '#a69319', borderColor: '#a69319', },
      { fill: false, backgroundColor: '#ffa500', borderColor: '#ffa500', },
    ];

    // line graphs config
    for (let i = 1; i <= 3; i++) {

      const config = {
        type: 'line',
        data: {
          labels: yearsArray,
          datasets: [
            { label: 'V' + i, ...colorV1, data: matr[i - 1] },
            { label: 'V' + i + ' CDS', ...colorV2, data: Object.values(this.vCds).map(array => this.graphService.round(array[i - 1])) },
            { label: 'Media Insegnamento', ...colorV3, data: teachingMean[i - 1], pointRadius: 1 },
            { label: 'Media CDS', ...colorV4, data: cdsMean[i - 1], pointRadius: 1 },
          ]
        },
        options: {
          responsive: true,
          title: { display: true, text: `${teachingName} V` + i },
          tooltips: { mode: 'index', intersect: false },
          hover: { mode: 'nearest', intersect: true },
          scales: {
            xAxes: [{ display: true, ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Anno accademico' } }],
            yAxes: [{ display: true, ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'V' + i } }],
          },
        }
      };

      document.getElementById('v' + i + '-teaching').innerHTML =
        '<div style="width: 80%; margin: 0 auto;"><canvas id="V' + i + '"></canvas></div>';

      const ctx = (document.getElementById('V' + i) as HTMLCanvasElement).getContext('2d');
      charts.push(new Chart(ctx, config));
    }
  }

  public updateTeachingChart(): void {

    if (this.selectedTeaching == null) { return; }

    const teaching = this.teachings[this.selectedTeaching];
    // get new data (schede) of the selected teaching
    this.apiService.getSchedeOfTeaching(teaching.codice_gomp, teaching.canale, teaching.id_modulo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((schede: SchedaOpis[]) => {
        const anniAccademici: TeachingSchede[] = [];
        for (const i of Object.keys(schede)) {
          anniAccademici[i] = {};
          anniAccademici[i].anno = schede[i].anno_accademico;
          [anniAccademici[i].v1, anniAccademici[i].v2, anniAccademici[i].v3] = this.graphService.applyWeights(schede[i]);
          anniAccademici[i].totale_schede = schede[i].totale_schede + schede[i].totale_schede_nf;
        }
        this.selectedTeachingSchede = anniAccademici;
        // refresh the chart
        this.showTeachingChart(anniAccademici);
      });

    this.manualRefresh.emit(); // refresh years slider
  }

  private calculateTeachingStats(matr: number[][]): void {
    for (let i = 0; i < 3; i++) {
      const teachingValues = this.filterZero(matr[i]);
      const mediaCDS = mean(Object.values(this.vCds).map(array => array[i]));
      const mediaInsegnamento = mean(teachingValues);
      document.getElementById('v' + (i + 1) + '-cds-mean').innerHTML = `${mediaCDS.toFixed(2)}`;
      document.getElementById('v' + (i + 1) + '-ins-mean').innerHTML =
        `<span style="color:${this.getLabelColor(mediaInsegnamento, mediaCDS)};">${mediaInsegnamento.toFixed(2)}</span>`;
      document.getElementById('v' + (i + 1) + '-var').innerHTML = `${variance(teachingValues).toFixed(3)}`;
      document.getElementById('v' + (i + 1) + '-devstd').innerHTML = `${std(teachingValues).toFixed(3)}`;
    }

    const teachingSchede = this.filterZero(this.selectedTeachingSchede.map(t => t.totale_schede));
    const nMediaCDS = mean(Object.values(this.nCds));
    const nMediaInsegnamento = mean(teachingSchede);
    document.getElementById('n-cds-mean').innerHTML = `${nMediaCDS.toFixed(2)}`;
    document.getElementById('n-ins-mean').innerHTML =
      `<span style="color:${this.getLabelColor(nMediaInsegnamento, nMediaCDS, 10)}">${nMediaInsegnamento.toFixed(2)}</span>`;
    document.getElementById('n-var').innerHTML = `${variance(teachingSchede).toFixed(3)}`;
    document.getElementById('n-devstd').innerHTML = `${std(teachingSchede).toFixed(3)}`;

  }

  private getLabelColor(mediaInsegnamento: number, mediaCDS: number, divider = 1) {
    let color = 'black';
    if (Math.round(mediaInsegnamento / divider) < Math.round(mediaCDS / divider)) {
      color = 'red';
    } else if (Math.round(mediaInsegnamento / divider) > Math.round(mediaCDS / divider)) {
      color = 'green';
    }
    return color;
  }

  private filterZero(array: number[]): number[] {
    const cleanedArray: number[] = array.filter(item => item !== 0 && !isNaN(item));
    return cleanedArray.length > 0 ? cleanedArray : [0];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
