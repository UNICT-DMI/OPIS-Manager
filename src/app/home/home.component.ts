import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { Subject, from } from 'rxjs';
import { take, takeUntil, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { GraphService } from '../graph.service';
import { ApiService } from '../api.service';
import { Department, CDS, Teaching } from '../api.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  departments: Department[];
  cds: CDS[];
  teachings: Teaching[];
  selectedCds: number;

  vCds: { [year: string]: number[]} = {};
  nCds: { [year: string]: number} = {};
  cdsWithSchede: CDS[];

  currentOption: number;

  stepsYears: { value: number, legend: string }[] = [];

  constructor(
    private readonly graphService: GraphService,
    private readonly apiService: ApiService,
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
    this.apiService.getDepartments().pipe(take(1)).subscribe((data) => {
      this.departments = data;
    });
  }

  public getAllCdsOfSelectedDepartment(department: number): void {
    this.apiService.getCDSOfDepartment(department).pipe(take(1)).subscribe((data) => {
      this.cds = data;
    });

    this.selectedCds = null;
  }

  public getAllTeachingsOfSelectedCds(cds: number): void {
    this.selectedCds = cds;
    const selectedCdsValue = this.cds[this.selectedCds];
    this.getSelectedCdsStats(selectedCdsValue);
    this.apiService.getTeachingsOfCDS(selectedCdsValue.id).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.teachings = data;
    });
  }

  private getSelectedCdsStats(cds: CDS): void {
    this.apiService.getCDSCoarse(cds.unict_id).subscribe(cdsArray => {
      this.cdsWithSchede = cdsArray;
      const cdsSchede = cdsArray.flatMap(cdsCoarse => cdsCoarse.insegnamenti)
      .filter(insegnamento => insegnamento.schedeopis != null)
      .flatMap(insegnamento => insegnamento.schedeopis)
      .filter(schedaopis => schedaopis.domande != null);
      const annoSchede = from(cdsSchede).pipe(
        groupBy(scheda => scheda.anno_accademico),
        mergeMap(group => group.pipe(toArray())));
      annoSchede.subscribe(schede => {
        this.vCds[schede[0].anno_accademico] = this.graphService.elaborateFormula(schede)[0];
        this.vCds = Object.assign({}, this.vCds); // copy into new object to trigger ngOnChange in child components
        this.nCds[schede[0].anno_accademico] = schede.map(scheda => scheda.totale_schede)
                                                  .reduce((acc, val) => acc + val) / schede.length;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
