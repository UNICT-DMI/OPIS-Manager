import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CDS } from '@interfaces/cds.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { DELAY_API_MS } from '@values/delay-api';
import { catchError, delay, forkJoin, map, throwError } from 'rxjs';
import { env } from 'src/enviroment';

@Injectable({ providedIn: 'root' })
export class CdsService {
  private readonly BASE_URL = env.api_url + '/cds';
  private readonly _http = inject(HttpClient);

  public cdsSelected = signal<CDS | null>(null);

  private teachingCdsApi(cds: number) {
    const url = `${this.BASE_URL}/with-id/${cds}/insegnamenti`;

    return this._http.get<Teaching[]>(url);
  }

  private coarsePerCdsApi(unictCds: number) {
    const url = `${this.BASE_URL}/coarse/${unictCds}/schedeopis`;

    return this._http.get<CDS[]>(url);
  }

  public getInfoCds() {
    return rxResource({
      params: () => this.cdsSelected(),
      stream: ({ params }) => {
        if (!params?.id || !params?.unict_id) {
          return throwError(() =>
            new Error('Id or Unict_id missing!')
          );
        }

        const teachings$ = this.teachingCdsApi(params.id);
        const coarse$ = this.coarsePerCdsApi(params.unict_id);

        return forkJoin({
          teaching: teachings$,
          coarse: coarse$,
        }).pipe(
          delay(DELAY_API_MS),
          map(res => {
            if (!res.teaching?.length) {
              throw new Error('Nessun insegnamento trovato');
            }
            if (!res.coarse) {
              throw new Error('Schede OPIS non trovate');
            }
            return res;
          }),
          catchError(err => throwError(() => err))
        );
      },
    });
  }

  // TODO ???
  public updateCDS(cds: CDS, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: token })
    };

    return this._http.put(this.BASE_URL + '/with-id/' + cds.id
      + '?scostamento_numerosita=' + cds.scostamento_numerosita + '&scostamento_media=' + cds.scostamento_media, {}, httpOptions);
  }
}
