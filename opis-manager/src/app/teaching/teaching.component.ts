import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Chart } from 'chart.js';
import { mean, std, variance } from 'mathjs';
import { Options } from 'ng5-slider';
import { ConfigService } from '../config.service';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.scss']
})
export class TeachingComponent implements OnInit {

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
    getLegend: (value: number): string => this.configService.config.years[value - 1],
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpClient,
    private readonly graphService: GraphService,
  ) { }

  ngOnInit(): void {

    if (!this.configService.config.apiUrl) {
      // wait to get the config
      this.configService.updateConfig().toPromise().then(() => {
        this.initOptions();
      });
    } else { // do not wait for the config
      this.initOptions();
    }

  }

  private initOptions() {
    this.maxValue = this.configService.config.years.length;

    this.optionsSlider = {
      floor: 1,
      ceil: this.maxValue,
      showTicksValues: true,
      getLegend: (value: number): string => this.configService.config.years[value - 1],
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
    const matr = [];
    matr[0] = [];
    matr[1] = [];
    matr[2] = [];

    const tmp = Array.from(this.configService.config.years);
    const yearsArray = tmp.splice(this.minValue - 1, this.maxValue - this.minValue + 1);

    for (let i = 0; i < teachingResults.length; i++) {
      if (!yearsArray.includes(teachingResults[i].anno)) {
        teachingResults.splice(i--, 1);
      }
    }

    let j = 0;
    for (const i of Object.keys(yearsArray)) {
      let val1 = 0;
      let val2 = 0;
      let val3 = 0;

      if (j < teachingResults.length && yearsArray[i] === teachingResults[j].anno) {
        val1 = this.graphService.round(teachingResults[j].v1);
        val2 = this.graphService.round(teachingResults[j].v2);
        val3 = this.graphService.round(teachingResults[j].v3);
        j++;
      }
      matr[0].push(val1);
      matr[1].push(val2);
      matr[2].push(val3);
    }

    const teachingMean = [[], [], []];

    // tslint:disable-next-line: forin
    for (const i in this.configService.config.years) {
      teachingMean[0][i] = this.graphService.round(mean(this.removeZeroValuesToArray(matr[0])));
      teachingMean[1][i] = this.graphService.round(mean(this.removeZeroValuesToArray(matr[1])));
      teachingMean[2][i] = this.graphService.round(mean(this.removeZeroValuesToArray(matr[2])));
    }

    this.calculateTeachingStats(matr);

    const [colorV1, colorV2, colorV3] = [
      { fill: false, backgroundColor: '#00897b', borderColor: '#00897b', },
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

  public getSchedeOfSelectedTeachingAndShowTeachingChart(): void {

    if (!this.selectedTeaching) { return; }

    let id: string;
    let channel: string;
    [id, channel] = this.selectedTeaching && this.selectedTeaching.split(' ');

    this.http.get(this.configService.config.apiUrl + 'schedeInsegnamento?id_ins=' + id + '&canale=' + channel).subscribe((data) => {

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

      this.showTeachingChart(anniAccademici);
    });

    this.manualRefresh.emit(); // refresh years slider
  }

  private calculateTeachingStats(matr: number[][]): void {
    for (let i = 0; i < 3; i++) {
      const paragraph = document.getElementById('v' + (i + 1) + '-stats');
      const teachingValues = this.removeZeroValuesToArray(matr[i]);
      if (paragraph) {
        paragraph.innerHTML = '';
        paragraph.innerHTML += 'Media: ' + mean(teachingValues).toFixed(2) + '<br>';
        paragraph.innerHTML += 'Varianza: ' + variance(teachingValues).toFixed(3) + '<br>';
        paragraph.innerHTML += 'Dev. std.: ' + std(teachingValues).toFixed(3);
      }
    }
  }

  private removeZeroValuesToArray(array: Array<number>): Array<number> {
    const cleanedArray: Array<number> = [];
    for (const v of array) {
      if (v !== 0 && !isNaN(v)) {
        cleanedArray.push(v);
      }
    }
    if (cleanedArray.length === 0) {
      cleanedArray.push(0);
    }
    return cleanedArray;
  }

}
