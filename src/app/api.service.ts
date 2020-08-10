import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department, CDS, Teaching, SchedaOpis } from './api.model';
import { Observable } from 'rxjs';
import CONF from '../assets/config.json';
import { Config } from './utils.model';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit {

  readonly CONF: Config = CONF;

  constructor(
    private readonly http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  public getDepartments(): Observable<Department[]>;

  public getDepartments(academicYear?: string): Observable<Department[]> {
    return this.http.get<Department[]>(this.CONF.apiUrl + 'dipartimento?anno_accademico='
      + (academicYear == null ? this.CONF.years[this.CONF.years.length - 1] : academicYear));
  }

  public getCDSOfDepartment(department: number): Observable<CDS[]> {
    return this.http.get<CDS[]>(this.CONF.apiUrl + 'dipartimento/with-id/' + department + '/cds');
  }

  public getTeachingsOfCDS(cds: number): Observable<Teaching[]> {
    return this.http.get<Teaching[]>(this.CONF.apiUrl + 'cds/with-id/' + cds + '/insegnamenti');
  }

  public getCDSCoarse(unictCds: number): Observable<CDS[]> {
    return this.http.get<CDS[]>(this.CONF.apiUrl + 'cds/coarse/' + unictCds + '/schedeopis');
  }

  public getSchedeOfTeaching(codiceGomp: number, canale?: string, idModulo?: number): Observable<SchedaOpis[]> {
    let extra = '?';
    if (canale != null) {
      extra += 'canale=' + canale + '&';
    }
    if (idModulo != null) {
      extra += 'id_modulo=' + idModulo;
    }
    return this.http.get<Teaching[]>(this.CONF.apiUrl + 'insegnamento/coarse/' + codiceGomp + '/schedeopis' + extra)
    .pipe(
      map(insegnamenti =>
        insegnamenti.filter(insegnamento => insegnamento.schedeopis != null)
          .map(insegnamento => insegnamento.schedeopis))
    );
  }

}
