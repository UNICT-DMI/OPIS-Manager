import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { env } from '@env';
import { CDS } from '@interfaces/cds.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { GraphService } from '@services/graph/graph.service';
import { DELAY_API_MS } from '@values/delay-api';
import { AcademicYear } from '@values/years';
import {
  catchError,
  delay,
  forkJoin,
  from,
  groupBy,
  map,
  mergeMap,
  Observable,
  throwError,
  toArray,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CdsService {
  private readonly BASE_URL = env.api_url + '/cds';
  private readonly _http = inject(HttpClient);
  private readonly _graphService = inject(GraphService);

  private vCds: Record<AcademicYear, number[] | null> = {
    '2013/2014': null,
    '2014/2015': null,
    '2015/2016': null,
    '2016/2017': null,
    '2017/2018': null,
    '2018/2019': null,
    '2019/2020': null,
    '2020/2021': null,
  };

  readonly cdsSelected = signal<CDS | null>(null);

  private extractValidSchedeOpis(cdsList: CDS[]): SchedaOpis[] {
    return cdsList
      .flatMap((cds) => cds.insegnamenti)
      .filter((insegnamento) => insegnamento.schedeopis != null)
      .flatMap((insegnamento) => insegnamento.schedeopis)
      .filter((schedaopis) => schedaopis.domande != null);
  }

  private formatAllYearsCdsStats(resp: CDS[]) {
    const cdsSchede = this.extractValidSchedeOpis(resp);

    from(cdsSchede).pipe(
        groupBy((scheda) => scheda.anno_accademico),
        mergeMap((group) => group.pipe(toArray())),
      )
      .subscribe((schede) => {
        const academicYear = schede[0].anno_accademico as AcademicYear;

        this.vCds[academicYear] = this._graphService.elaborateFormulaFor(schede)[0];
        // debugger
        //   this.vCds = Object.assign({}, this.vCds); // copy into new object to trigger ngOnChange in child components
        // this.nCds[academicYear] = this.graphService.round(schede.map(scheda => scheda.totale_schede)
        //     .reduce((acc, val) => acc + val) / schede.length);
      });
    return this.vCds;
  }

  private teachingCdsApi(cds: number): Observable<Teaching[]> {
    const url = `${this.BASE_URL}/with-id/${cds}/insegnamenti`;

    return this._http.get<Teaching[]>(url).pipe(
      map((teaching) => {
        if (!teaching?.length) {
          throw new Error('Nessun insegnamento trovato');
        }
        return teaching;
      }),
    );
  }

  private coarsePerCdsApi(unictCdsId: number) {
    const url = `${this.BASE_URL}/coarse/${unictCdsId}/schedeopis`;

    return this._http.get<CDS[]>(url).pipe(
      map((coarse) => {
        if (!coarse) throw new Error('Schede OPIS non trovate');
        return this.formatAllYearsCdsStats(coarse);
      }),
    );
  }

  public getInfoCds() {
    return rxResource({
      params: () => this.cdsSelected(),
      stream: ({ params }) => {
        if (!params?.id || !params?.unict_id) {
          return throwError(() => new Error('Id or Unict_id missing!'));
        }

        const teachings$ = this.teachingCdsApi(params.id);
        const coarse$ = this.coarsePerCdsApi(params.unict_id);

        return forkJoin({
          teaching: teachings$,
          coarse: coarse$,
        }).pipe(
          delay(DELAY_API_MS),
          catchError((err) => throwError(() => err)),
        );
      },
    });
  }

  // TODO ???
  public updateCDS(cds: CDS, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: token }),
    };

    return this._http.put(
      this.BASE_URL +
        '/with-id/' +
        cds.id +
        '?scostamento_numerosita=' +
        cds.scostamento_numerosita +
        '&scostamento_media=' +
        cds.scostamento_media,
      {},
      httpOptions,
    );
  }
}
