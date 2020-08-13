import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Department, CDS, Teaching, SchedaOpis, Domanda, LoginResponse } from './api.model';
import { Observable } from 'rxjs';
import CONF from '../assets/config.json';
import { Config } from './utils.model';
import { map } from 'rxjs/operators';


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
    return this.http.get<Department[]>(this.CONF.apiUrl + 'v2/dipartimento?anno_accademico='
      + (academicYear == null ? this.CONF.years[this.CONF.years.length - 1] : academicYear));
  }

  public getCDSOfDepartment(department: number): Observable<CDS[]> {
    return this.http.get<CDS[]>(this.CONF.apiUrl + 'v2/dipartimento/with-id/' + department + '/cds');
  }

  public getTeachingsOfCDS(cds: number): Observable<Teaching[]> {
    return this.http.get<Teaching[]>(this.CONF.apiUrl + 'v2/cds/with-id/' + cds + '/insegnamenti');
  }

  public getCDSCoarse(unictCds: number): Observable<CDS[]> {
    return this.http.get<CDS[]>(this.CONF.apiUrl + 'v2/cds/coarse/' + unictCds + '/schedeopis');
  }

  public getSchedeOfTeaching(codiceGomp: number, canale?: string, idModulo?: number): Observable<SchedaOpis[]> {
    let extra = '?';
    if (canale != null) {
      extra += 'canale=' + canale + '&';
    }
    if (idModulo != null) {
      extra += 'id_modulo=' + idModulo;
    }
    return this.http.get<Teaching[]>(this.CONF.apiUrl + 'v2/insegnamento/coarse/' + codiceGomp + '/schedeopis' + extra)
    .pipe(
      map(insegnamenti =>
        insegnamenti.filter(insegnamento => insegnamento.schedeopis != null)
          .map(insegnamento => insegnamento.schedeopis))
    );
  }

  public getDomandePesi(): Observable<Domanda[]> {
    return this.http.get<Domanda[]>(this.CONF.apiUrl + 'v2/domande');
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.CONF.apiUrl + 'auth/login', { email, password});
  }

  public refreshToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.CONF.apiUrl + 'auth/refresh', { token });
  }

}
