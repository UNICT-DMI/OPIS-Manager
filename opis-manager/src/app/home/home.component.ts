import { Component, OnInit, getDebugNode } from '@angular/core';
import { ConfigService, Config } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Identifiers } from '@angular/compiler';

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
  selectedTeaching: number;

  currentOption: number;

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

  getDepartmnets() {
    this.http.get(this.config.apiUrl + 'dipartimento').subscribe((data) => {
      this.departments = data;
    });
  }

  resetSettings() {
    this.selectedCds        = null;
    this.selectedTeaching   = null;
    this.currentOption      = null;
    this.selectedYear       = null;
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
  }

  enableOption(val) {
    this.currentOption = val;
  }

  performTeachings(data) {
    const insegnamenti:any = [];

    for (let i in data) {

      if (data[i].tot_schedeF < 6) { continue; }

      insegnamenti[i] = {};
      insegnamenti[i].nome = data[i].nome;

      if (insegnamenti[i].nome.length > 35) {
        insegnamenti[i].nome = insegnamenti[i].nome.substring(0, 35) + '... ';
        insegnamenti[i].nome += insegnamenti[i].nome.substring(insegnamenti[i].nome.length - 5, insegnamenti[i].nome.length);
      }

      if (data[i].canale !== 'no') {
        insegnamenti[i].nome += ' (' + data[i].canale + ')';
      }

      if (data[i].id_modulo.length > 2) {
        insegnamenti[i].nome += ' (' + data[i].id_modulo.substring(0, data[i].id_modulo.indexOf('-') - 1) + ')';
      }

      insegnamenti[i].nome += ' - ' + data[i].tot_schedeF;
      insegnamenti[i].canale        = data[i].canale;
      insegnamenti[i].id_modulo     = data[i].id_modulo;
      insegnamenti[i].docente       = data[i].docente;
      insegnamenti[i].tot_schedeF   = data[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];
      let index = 0;

      let j:any;

      for (j in data[i].domande) {

        if (j % 5 == 0 && j != 0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(data[i].domande[j]);
      }
    }

    return insegnamenti;
  }

  calculateFormula(insegnamenti) {
    // pesi singole domande
    let pesi = [
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
    let risposte = [
      1,    // Decisamente no
      4,    // Più no che sì
      7,    // Più sì che no
      10    // Decisamente sì
    ];

    let v1 = [];
    let v2 = [];
    let v3 = [];

    for (let i in insegnamenti) {

      const N = insegnamenti[i].tot_schedeF;
      let d = 0;
      let _v1 = 0;
      let _v2 = 0;
      let _v3 = 0;

      if (N > 5) {

        for (let j = 0; j < insegnamenti[i].domande.length; j++) {

          d = 0;
          d += insegnamenti[i].domande[j][0] * risposte[0]; // Decisamente no
          d += insegnamenti[i].domande[j][1] * risposte[1]; // Più no che sì
          d += insegnamenti[i].domande[j][2] * risposte[2]; // Più sì che no
          d += insegnamenti[i].domande[j][3] * risposte[3]; // Decisamente sì

          if (j === 0 || j === 1) {                               // V1 domande: 1,2
            _v1 += ((d / N) * pesi[j % 12]);
          } else if (j === 3 || j === 4 || j === 8 || j === 9) {  // V2 domande: 4,5,9,10
            _v2 += (d / N) * pesi[j % 12];
          } else if (j === 2 || j === 5 || j === 6) {             // V3 domande: 3,6,7
            _v3 += (d / N) * pesi[j % 12];
          }
        }
      }

      v1.push(_v1.toFixed(2));
      v2.push(_v2.toFixed(2));
      v3.push(_v3.toFixed(2));
    }

    const means = [0, 0, 0];

    for (let x in v1) {
      means[0] += parseFloat(v1[x]);
      means[1] += parseFloat(v2[x]);
      means[2] += parseFloat(v3[x]);
    }
    means[0] = means[0] / v1.length;
    means[1] = means[1] / v2.length;
    means[2] = means[2] / v3.length;

    return [means, [v1,v2,v3]];
  }

  getDataForYear() {

    this.http.get(this.config.apiUrl + 'schede?cds=' + this.selectedCds + '&anno_accademico=' + this.selectedYear).subscribe((data) => {

      const insegnamenti:any = this.performTeachings(data);

      const labels:  string[] = ['V1', "V2", "V3"];
      const materie: string[] = insegnamenti.map(a => a.nome); // labels chartjs

      let means:  any;
      let values: any;  // data chartjs
      [means, values] = this.calculateFormula(insegnamenti);

      // // chartjs stuff
      // let charts = [];
      // let ctx = [];

      // // Destroy and recreate canvas to clear (need refactoring)
      // let canv = [];
      // canv.push(document.getElementById(tabPosition + "v1"));
      // canv.push(document.getElementById(tabPosition + 'v2'));
      // canv.push(document.getElementById(tabPosition + 'v3'));

      // const parents = [];
      // parents.push(canv[0].parentElement, canv[1].parentElement, canv[2].parentElement);

      // parents[0].removeChild(canv[0]);
      // parents[1].removeChild(canv[1]);
      // parents[2].removeChild(canv[2]);

      // const canvWidth = '90vw', canv_height = (insegnamenti.length*25) + 'px';

      // let canvs = document.createElement('canvas');
      // canvs.id = tabPosition + 'v1';
      // canvs.style.width = canvWidth;
      // canvs.style.height = canv_height;
      // parents[0].appendChild(canvs);

      // canvs = document.createElement('canvas');
      // canvs.id = tabPosition + 'v2';
      // canvs.style.width = canvWidth;
      // canvs.style.height = canv_height;
      // parents[1].appendChild(canvs);

      // canvs = document.createElement('canvas');
      // canvs.id = tabPosition + 'v3';
      // canvs.style.width = canvWidth;
      // canvs.style.height = canv_height;
      // parents[2].appendChild(canvs);

      // canv = [];
      // canv.push(document.getElementById(tabPosition + 'v1'));
      // canv.push(document.getElementById(tabPosition + 'v2'));
      // canv.push(document.getElementById(tabPosition + 'v3'));

      // ctx.push(canv[0].getContext('2d'));
      // ctx.push(canv[1].getContext('2d'));
      // ctx.push(canv[2].getContext('2d'));

      // const _options = {
      //   scales: {
      //     xAxes: [{
      //       ticks: {
      //         beginAtZero: true,
      //       },
      //     }],
      //     yAxes: [{
      //       ticks: {
      //         beginAtZero: true
      //       }
      //     }]
      //   },
      //   responsive: false,
      //   legend: { display: false }
      // };

      // for (let c in ctx) {
      //   // chartjs data
      //   const _data = {
      //     labels: materie,
      //     datasets: [{
      //       label: labels[c],
      //       data: values[c],
      //       backgroundColor: '#28a745',
      //       // borderColor: 'red',
      //       borderWidth: 1
      //     }]
      //   };

      //   const opt = Object.assign({}, _options);
      //   opt.lineAtIndex = means[c];

      //   charts.push(new Chart(ctx[c], {
      //       type: 'horizontalBar',
      //       data: _data,
      //       options: opt
      //   }));
      // }

    });

  }

}
