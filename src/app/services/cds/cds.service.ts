import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { env } from '@env';
import { AllCdsInfoResp, CDS } from '@interfaces/cds.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { GraphService } from '@services/graph/graph.service';
import { DELAY_API_MS } from '@values/delay-api';
import { AcademicYear } from '@values/years';
import {
  catchError,
  delay,
  forkJoin,
  map,
  Observable,
  throwError
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CdsService {
  private readonly BASE_URL = env.api_url + '/cds';
  private readonly _http = inject(HttpClient);
  private readonly _graphService = inject(GraphService);

  readonly cdsSelected = signal<CDS | null>(null);

  private extractValidSchedeOpis(cdsList: CDS[]): SchedaOpis[] {
    return cdsList
      .flatMap((cds) => cds.insegnamenti)
      .filter((insegnamento) => insegnamento.schedeopis != null)
      .flatMap((insegnamento) => insegnamento.schedeopis)
      .filter((schedaopis) => schedaopis.domande != null);
  }

  private groupByYears(schede: SchedaOpis[]): Record<AcademicYear, SchedaOpis[]> {
    return schede.reduce((acc, scheda) => {
      const year = scheda.anno_accademico as AcademicYear;
      if (!acc[year]) acc[year] = [];
      acc[year].push(scheda);
      return acc;
    }, {} as Record<AcademicYear, SchedaOpis[]>);
  }

  private formatAllYearsCdsStats(resp: CDS[]): Record<AcademicYear, [number[], number[][]]> {
    const cdsSchede = this.extractValidSchedeOpis(resp);
    const schedeByYears = this.groupByYears(cdsSchede);

    const vCds = {} as Record<AcademicYear, [number[], number[][]]>;

    for(const year in schedeByYears) {
      const yearTyped = year as AcademicYear;
      const allSchede = schedeByYears[yearTyped];

      vCds[yearTyped] = this._graphService.elaborateFormulaFor(allSchede);
    }

    return vCds;
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

  private cdsStatsApi(unictCdsId: number): Observable<Record<AcademicYear, [number[], number[][]]>> {
    const url = `${this.BASE_URL}/coarse/${unictCdsId}/schedeopis`;

    return this._http.get<CDS[]>(url).pipe(
      map((coarse) => {
        if (!coarse) throw new Error('Schede OPIS non trovate');
        return this.formatAllYearsCdsStats(coarse);
      }),
    );
  }

  public getInfoCds(): ResourceRef<AllCdsInfoResp | undefined > {
    return rxResource({
      params: () => this.cdsSelected(),
      stream: ({ params }) => {
        if (!params?.id || !params?.unict_id) {
          return throwError(() => new Error('Id or Unict_id missing!'));
        }

        return forkJoin([
          this.teachingCdsApi(params.id),
          this.cdsStatsApi(params.unict_id),
        ]).pipe(
          delay(DELAY_API_MS),
          map(([ teachings, coarse ]) => {
            const respDTO: AllCdsInfoResp = {
              teachings, coarse,
              graphs: {
                cds_stats: this._graphService.formatCDSGraph(coarse)
              }
            }
            return respDTO;
          }),
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
