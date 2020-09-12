import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Department, CDS, Teaching, SchedaOpis, Domanda, LoginResponse } from './api.model';
import { Observable } from 'rxjs';
import { Config } from '../../utils/utils.model';
import { getConf } from '../../utils/utils';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly CONF: Config;

  constructor(
    private readonly http: HttpClient,
  ) {
    this.CONF = getConf();
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

  public updateDomandePesi(domande: Domanda[], token: string): Observable<object> {
    const domandeJson = JSON.stringify(domande.map(domanda => {
      return {
        id: domanda.id,
        peso: domanda.peso_standard,
        gruppo: domanda.gruppo,
      };
    }));
    const httpOptions = {
      headers: new HttpHeaders(
        {
          Authorization: token,
        }
      )
    };
    return this.http.put(this.CONF.apiUrl + 'v2/domande?pesi_domande=' + domandeJson, {}, httpOptions);
  }

  public updateCDS(cds: CDS, token: string): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          Authorization: token,
        }
      )
    };

    return this.http.put(this.CONF.apiUrl + 'v2/cds/with-id/' + cds.id
    + '?scostamento_numerosita=' + cds.scostamento_numerosita + '&scostamento_media=' + cds.scostamento_media, {}, httpOptions);
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.CONF.apiUrl + 'auth/login', { email, password});
  }

  public refreshToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.CONF.apiUrl + 'auth/refresh', { token });
  }

}
