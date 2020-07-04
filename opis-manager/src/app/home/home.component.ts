import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GraphService } from '../graph.service';
import CONF from '../../assets/config.json';

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
  nCds: number[][][] = [];

  currentOption: number;

  stepsYears: { value: number, legend: string }[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly graphService: GraphService,
  ) { }

  ngOnInit(): void {
    this.getAllDepartments();

    // ChartJS Annotation plugin stuff
    const namedChartAnnotation = ChartAnnotation;
    namedChartAnnotation.id = 'annotation';
    Chart.pluginService.register(namedChartAnnotation);
  }

  public enableOption(val: number): void {
    this.currentOption = val;
  }

  private getAllDepartments(): void {
    this.http.get(CONF.apiUrl + 'dipartimento').pipe(take(1)).subscribe((data) => {
      this.departments = data;
    });
  }

  public getAllCdsOfSelectedDepartment(department: number): void {
    this.http.get(CONF.apiUrl + 'cds/' + department).pipe(take(1)).subscribe((data) => {
      this.cds = data;
      this.getCdsStats();
    });

    this.selectedCds = null;
  }

  public getAllTeachingsOfSelectedCds(cds: number): void {
    this.selectedCds = null;

    this.selectedCds = cds;

    this.http.get(CONF.apiUrl + 'insegnamento/' + cds).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.teachings = data;
    });
  }

  private getCdsStats(): void {
    for (const cds of this.cds) {
      const means$ = CONF.years.map(year => this.getMeans(year, cds.id));

      this.vCds[cds.id] = [[], [], []];
      this.nCds[cds.id] = [];
      combineLatest(means$).pipe(takeUntil(this.destroy$)).subscribe((means: any[][]) => {
        this.nCds[cds.id].push(means.map(a => a[1]));
        const meansV = means.map(a => a[0]);
        for (const v of meansV) {
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
    return this.http.get(CONF.apiUrl + 'schede?cds=' + cds + '&anno_accademico=' + year)
      .pipe(map((data) => {
        const insegnamenti = this.graphService.parseSchede(data);
        const meanSchede = (insegnamenti.map(t => (t.tot_schedeF/*  + t.tot_schedeNF */))
                            .reduce((acc, val) => acc + val)) / insegnamenti.length;
        const [meansV, _] = this.graphService.elaborateFormula(insegnamenti);
        return [meansV, meanSchede];
      }), takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
