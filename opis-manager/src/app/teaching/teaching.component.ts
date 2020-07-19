import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { mean, std, variance } from 'mathjs';
import { Options } from 'ng5-slider';
import { GraphService } from '../graph.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import CONF from '../../assets/config.json';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.scss']
})
export class TeachingComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() teachings;
  @Input() vCds;
  @Input() selectedCds;

  selectedTeaching: string = null;
  showTeachingStats = false;
  switcherValues = 1;

  /* years slider */
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  minValue = 1;
  maxValue = 1;
  optionsSlider: Options = {
    floor: 1,
    ceil: 8,
    showTicksValues: true,
    getLegend: (value: number): string => CONF.years[value - 1],
  };

  constructor(
    private readonly http: HttpClient,
    private readonly graphService: GraphService,
  ) { }

  ngOnInit(): void {
    this.initOptions();
  }

  private initOptions(): void {
    this.maxValue = CONF.years.length;

    this.optionsSlider = {
      floor: 1,
      ceil: this.maxValue,
      showTicksValues: true,
      getLegend: (value: number): string => CONF.years[value - 1],
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
    teachingName = teachingName.options[teachingName.selectedIndex].text;

    const charts = [];
    const matr = [[], [], []];

    const yearsArray = [...CONF.years].splice(this.minValue - 1, this.maxValue - this.minValue + 1);
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

    const teachingMean = [[], [], []];

    for (let i = 0; i < CONF.years.length; i++) {
      teachingMean[0][i] = this.graphService.round(mean(this.filterZero(matr[0])));
      teachingMean[1][i] = this.graphService.round(mean(this.filterZero(matr[1])));
      teachingMean[2][i] = this.graphService.round(mean(this.filterZero(matr[2])));
    }

    this.calculateTeachingStats(matr);

    const [colorV1, colorV2, colorV3] = [
      { fill: false, backgroundColor: '', borderColor: '#00897b', },
      { fill: false, backgroundColor: '#521a7d', borderColor: '#521a7d', },
      { fill: false, backgroundColor: '#a69319', borderColor: '#a69319', },
    ];

    // line graphs config
    for (let i = 1; i <= 3; i++) {

      const config = {
        type: 'line',
        data: {
          labels: yearsArray,
          datasets: [
            { label: 'V' + i,              ...colorV1, data: matr[i - 1]                         },
            { label: 'Media CDS',          ...colorV2, data: this.vCds[this.selectedCds][i - 1]  },
            { label: 'Media Insegnamento', ...colorV3, data: teachingMean[i - 1], pointRadius: 1 },
          ]
        },
        options: {
          responsive: true,
          title: { display: true, text: `${teachingName} V` + i },
          tooltips: { mode: 'index',    intersect: false },
          hover:    { mode: 'nearest',  intersect: true  },
          scales: {
            xAxes: [{ display: true, ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Anno accademico' } }],
            yAxes: [{ display: true, ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'V' + i           } }],
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

    if (!this.selectedTeaching) { return; }

    const [id, channel]: string[] = this.selectedTeaching && this.selectedTeaching.split(' ');

    // get new data (schede) of the selected teaching
    this.http.get(CONF.apiUrl + 'schedeInsegnamento?id_ins=' + id + '&canale=' + channel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {

      const anniAccademici = [];
      for (const i of Object.keys(data)) {
        anniAccademici[i] = {};
        anniAccademici[i].v1 = 0;
        anniAccademici[i].v2 = 0;
        anniAccademici[i].v3 = 0;
        anniAccademici[i].anno = data[i].anno_accademico;

        const valori: any = [];
        valori.tot_schedeF = data[i].totale_schede;
        valori.domande = [];

        valori.domande[i] = [];

        let index = 0;
        for (let j = 0; j < data[i].domande.length; j++) {
          if (data[i].domande.hasOwnProperty(j)) {

            if (j % 5 === 0 && j !== 0) {
              index++;
              valori.domande[index] = [];
            }

            if (valori.domande[index] === undefined) {
              valori.domande[index] = [];
            }

            valori.domande[index].push(data[i].domande[j]);
          }
        }

        [anniAccademici[i].v1, anniAccademici[i].v2, anniAccademici[i].v3] = this.graphService.applyWeights(valori);
      }

      // refresh the chart
      this.showTeachingChart(anniAccademici);
    });

    this.manualRefresh.emit(); // refresh years slider
  }

  private calculateTeachingStats(matr: number[][]): void {
    for (let i = 0; i < 3; i++) {
      const paragraph = document.getElementById('v' + (i + 1) + '-stats');
      const teachingValues = this.filterZero(matr[i]);
      if (paragraph) {
        paragraph.innerHTML =  `Media: ${mean(teachingValues).toFixed(2)}<br>`;
        paragraph.innerHTML += `Varianza: ${variance(teachingValues).toFixed(3)}<br>`;
        paragraph.innerHTML += `Dev. std.: ${std(teachingValues).toFixed(3)}`;
      }
    }
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
