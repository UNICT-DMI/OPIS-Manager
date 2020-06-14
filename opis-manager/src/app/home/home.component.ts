import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  departments: any = [];
  cds: any = [];
  teachings: any = [];

  selectedCds: number;
  vCds: number[][][] = [];

  currentOption: number;

  stepsYears: { value: number, legend: string }[] = [];

  constructor(
    private readonly configService: ConfigService,
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
        const insegnamenti = this.graphService.parseSchede(data);
        const [means, _] = this.graphService.elaborateFormula(insegnamenti);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
