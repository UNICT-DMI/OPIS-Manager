import { Component, OnInit, getDebugNode } from '@angular/core';
import { ConfigService, Config } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  config: {
    apiUrl: string;
    years: any;
  } = {
    apiUrl: '',
    years: []
  };

  departments: any = [];
  cds: any = [];
  teachings: any = [];

  selectedCds: number;
  selectedYear: string;
  selectedTeaching: string;

  currentOption: number;

  switcherValues = 1;
  v1Info = false;
  v2Info = false;
  v3Info = false;

  constructor(
    public configService: ConfigService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.configService.getConfig()
    .subscribe((data: Config) => {
      this.config = {
        apiUrl: data.apiUrl,
        years: data.years
      };

      this.getDepartmnets();
    });
  }

  resetInfo() {
    this.v1Info = false;
    this.v2Info = false;
    this.v3Info = false;
  }

  switchVal(v) {
    this.resetInfo();
    this.switcherValues = v;
  }

  getDepartmnets() {
    this.http.get(this.config.apiUrl + 'dipartimento').subscribe((data) => {
      this.departments = data;
    });
  }

  resetSettings() {
    this.selectedCds        = null;
    this.selectedTeaching   = null;
    // this.currentOption      = null;
  }

  showCds(department: number) {
    this.http.get(this.config.apiUrl + 'cds/' + department).subscribe((data) => {
      this.cds = data;
    });

    this.resetSettings();
  }

  selectCds(cds: number) {
    this.resetSettings();

    this.selectedCds = cds;

    this.http.get(this.config.apiUrl + 'insegnamento/' + cds).subscribe((data) => {
      this.teachings = data;
    });

    if (this.selectedYear) {
      this.getDataForYear();
    }
  }

  enableOption(val) {
    this.resetInfo();
    this.currentOption = val;
  }

  performTeachings(data) {
    let insegnamenti: any = [];

    for (let i = 0; i < data.length; i++) {

      if (data[i].tot_schedeF < 6) { continue; }

      insegnamenti[i] = {};
      insegnamenti[i].nome = data[i].nome;
      insegnamenti[i].anno = data[i].anno;

      if (insegnamenti[i].nome.length > 35) {
        insegnamenti[i].nome = insegnamenti[i].nome.substring(0, 35) + '... ';
        insegnamenti[i].nome += insegnamenti[i].nome.substring(insegnamenti[i].nome.length - 5, insegnamenti[i].nome.length);
      }

      if (data[i].canale.indexOf('no') == -1) {
        insegnamenti[i].nome += ' (' + data[i].canale + ')';
      }

      if (data[i].id_modulo.length > 3 && data[i].id_modulo != '0') {
        insegnamenti[i].nome += ' (' + data[i].id_modulo + ')';
      }

      insegnamenti[i].nome += ' - ' + data[i].tot_schedeF;
      insegnamenti[i].canale        = data[i].canale;
      insegnamenti[i].id_modulo     = data[i].id_modulo;
      insegnamenti[i].docente       = data[i].docente;
      insegnamenti[i].tot_schedeF   = data[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];

      let index = 0;
      for (let j = 0; j < data[i].domande.length; j++) {
        if (j % 5 === 0 && j !== 0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(data[i].domande[j]);
      }
    }

    // remove empty slot
    insegnamenti = insegnamenti.filter((el) => {
      return el != null;
    });

    return insegnamenti;
  }

  applyWeights(vals) {
    // pesi singole domande
    const pesi = [
      0.7,  // 1
      0.3,  // 2
      0.1,  // 3
      0.1,  // 4
      0.3,  // 5
      0.5,  // 6
      0.4,  // 7
      0.0,  // 8   questa domanda non viene considerata
      0.3,  // 9
      0.3,  // 10
      0.3,  // 11
      0.0   // 12  questa domanda non viene considerata
    ];

    // pesi risposte
    const risposte = [
      1,    // Decisamente no
      4,    // Più no che sì
      7,    // Più sì che no
      10    // Decisamente sì
    ];

    const N = vals.tot_schedeF;
    let d = 0;
    let V1 = 0;
    let V2 = 0;
    let V3 = 0;

    if (N > 5) {

      for (let j = 0; j < vals.domande.length; j++) {

        d = 0.0;
        d += vals.domande[j][0] * risposte[0];   // Decisamente no
        d += vals.domande[j][1] * risposte[1];   // Più no che sì
        d += vals.domande[j][2] * risposte[2];   // Più sì che no
        d += vals.domande[j][3] * risposte[3];   // Decisamente sì

        if (j === 0 || j === 1) {                                 // V1 domande: 1,2
          V1 += ((d / N) * pesi[j]);
        } else if (j === 3 || j === 4 || j === 8 || j === 9) {    // V2 domande: 4,5,9,10
          V2 += (d / N) * pesi[j];
        } else if (j === 2 || j === 5 || j === 6) {               // V3 domande: 3,6,7
          V3 += (d / N) * pesi[j];
        }
      }

    }

    return [V1.toFixed(2), V2.toFixed(2), V3.toFixed(2)];
  }

  calculateFormula(insegnamenti) {
    const v1 = [];
    const v2 = [];
    const v3 = [];

    for (let i in insegnamenti) {

      if (insegnamenti.hasOwnProperty(i)) {
        let V1: any;
        let V2: any;
        let V3: any;

        [V1, V2, V3] = this.applyWeights(insegnamenti[i]);

        v1.push(V1);
        v2.push(V2);
        v3.push(V3);
      }
    }

    const means = [0.0, 0.0, 0.0];

    for (let x in v1) {
      if (v1.hasOwnProperty(x)) {
        means[0] += parseFloat(v1[x]);
        means[1] += parseFloat(v2[x]);
        means[2] += parseFloat(v3[x]);
      }
    }
    means[0] = means[0] / v1.length;
    means[1] = means[1] / v2.length;
    means[2] = means[2] / v3.length;

    return [means, [v1, v2, v3]];
  }

  generateGraphs(means, values, insegnamenti) {

    const labels: string[] = ['V1', 'V2', 'V3'];

    const fitColor = [];
    let Rx: any;
    let Gx: any;
    let Bx: any;
    let param: any;

    const min = Math.min.apply(Math, insegnamenti.map((o) => o.tot_schedeF));
    const max = Math.max.apply(Math, insegnamenti.map((o) => o.tot_schedeF));
    const RGB = [100, 200, 200];

    insegnamenti.splice(0, 0, {
      nome: '1 anno',
      anno: '1',
      tot_schedeF: min
    });

    values[0].splice(0, 0, '0');
    values[1].splice(0, 0, '0');
    values[2].splice(0, 0, '0');

    for (let i = 2; i < insegnamenti.length; i++) {
      if (insegnamenti[i].anno != insegnamenti[i - 1].anno) {
        let year = insegnamenti[i].anno;
        insegnamenti.splice(i, 0, {
          anno: year,
          nome: year + ' anno',
          tot_schedeF: min
        });
        values[0].splice(i, 0, '0');
        values[1].splice(i, 0, '0');
        values[2].splice(i, 0, '0');
      }
    }


    for (let i in insegnamenti) {
      if (insegnamenti.hasOwnProperty(i)) {
        param = (125 * (insegnamenti[i].tot_schedeF - min) / (max - min));

        Rx = RGB[0] - param;
        Gx = RGB[1] - param;
        Bx = RGB[2] - param;

        fitColor.push(`rgba(${Rx.toFixed(2)}, ${Gx.toFixed(2)}, ${Bx.toFixed(2)}, 1)`);
      }
    }

    const materie: string[] = insegnamenti.map(a => a.nome); // labels chartjs

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

    let canvs: any = document.createElement('canvas');
    canvs.id = 'v1-canvas';
    canvs.style.width = canvWidth;
    canvs.style.height = canvHeight;
    parents[0].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = 'v2-canvas';
    canvs.style.width = canvWidth;
    canvs.style.height = canvHeight;
    parents[1].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = 'v3-canvas';
    canvs.style.width = canvWidth;
    canvs.style.height = canvHeight;
    parents[2].appendChild(canvs);

    canv = [];
    canv.push(document.getElementById('v1-canvas'));
    canv.push(document.getElementById('v2-canvas'));
    canv.push(document.getElementById('v3-canvas'));

    ctx.push(canv[0].getContext('2d'));
    ctx.push(canv[1].getContext('2d'));
    ctx.push(canv[2].getContext('2d'));

    const _options = {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: false,
      legend: { display: false },
      lineAtIndex: 0
    };

    for (let c in ctx) {
      if (ctx.hasOwnProperty(c)) {

        // chartjs data
        const _data = {
          labels: materie,
          datasets: [{
            label: labels[c],
            data: values[c],
            backgroundColor: fitColor,
            hoverBackgroundColor: fitColor,
            fill: true,
            borderWidth: 1
          }]
        };

        const opt = Object.assign({}, _options);
        opt.lineAtIndex = means[c];

        charts.push(new Chart(ctx[c], {
          type: 'horizontalBar',
          data: _data,
          options: opt
        }));
      }
    }
  }

  getDataForYear() {
    if (this.selectedYear != '--') {
      this.http.get(this.config.apiUrl + 'schede?cds=' + this.selectedCds + '&anno_accademico=' + this.selectedYear).subscribe((data) => {
        const insegnamenti: any = this.performTeachings(data);

        let means: any;
        let values: any;
        [means, values] = this.calculateFormula(insegnamenti);

        this.generateGraphs(means, values, insegnamenti);
      });
    }
  }

  showTeachingChart(teachingResults) {

    let teachingName: any = document.getElementById('selTeaching');
    teachingName = teachingName.options[teachingName.selectedIndex].text;

    const charts = [];
    const matr = [];
    matr[0] = [];
    matr[1] = [];
    matr[2] = [];

    const yearsArray = this.config.years;

    let j = 0;
    for (let i in yearsArray) {
      if (yearsArray.hasOwnProperty(i)) {

        let val1 = 0;
        let val2 = 0;
        let val3 = 0;

        if (j < teachingResults.length && yearsArray[i] == teachingResults[j].anno) {
            val1 = Math.round(teachingResults[j].v1 * 100) / 100;
            val2 = Math.round(teachingResults[j].v2 * 100) / 100;
            val3 = Math.round(teachingResults[j].v3 * 100) / 100;
            j++;
        }
        matr[0].push(val1);
        matr[1].push(val2);
        matr[2].push(val3);
      }
    }

    // line graphs config
    for (let i = 1; i < 4; i++) {

      const config = {
        type: 'line',
        data: {
          labels: yearsArray,
          datasets: [{
            label: 'V' + i,
            fill: false,
            backgroundColor: '#00897b',
            borderColor: '#00897b',
            data: matr[i - 1],
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text:  teachingName + ' V' + i
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Anno accademico'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'V' + i
              }
            }]
          }
        }
      };

      const container: any = document.getElementById('v' + i + '-teaching');
      container.innerHTML = '<div style="width: 100%; margin: 0 auto;"><canvas id="V' + i + '"></canvas></div>';

      let ctx: any = document.getElementById('V' + i);
      ctx = ctx.getContext('2d');
      charts.push(new Chart(ctx, config));
    }
  }

  getDataForTeaching() {

    let id: string;
    let channel: string;
    [id, channel] = this.selectedTeaching.split(' ');

    this.http.get(this.config.apiUrl + 'schedeInsegnamento?id_ins=' + id + '&canale=' + channel).subscribe((data) => {

      const anniAccademici = [];
      for (let i in data) {
        if (data.hasOwnProperty(i)) {

          anniAccademici[i] = {};
          anniAccademici[i].v1 = 0;
          anniAccademici[i].v2 = 0;
          anniAccademici[i].v3 = 0;
          anniAccademici[i].anno = data[i].anno_accademico;

          const valori: any = [];
          valori.tot_schedeF   = data[i].totale_schede;
          valori.domande = [];

          valori.domande[i] = [];

          let index = 0;
          for (let j = 0; j < data[i].domande.length; j++) {
            if (data[i].domande.hasOwnProperty(j)) {

              if (j % 5 == 0 && j != 0) {
                index++;
                valori.domande[index] = [];
              }

              if (valori.domande[index] == undefined) {
                valori.domande[index] = [];
              }

              valori.domande[index].push(data[i].domande[j]);
            }
          }

          [anniAccademici[i].v1, anniAccademici[i].v2, anniAccademici[i].v3] = this.applyWeights(valori);
        }
      }

      this.showTeachingChart(anniAccademici);

    });

  }

}
