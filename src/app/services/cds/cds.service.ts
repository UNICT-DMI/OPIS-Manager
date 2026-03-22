import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MeansPerYear } from '@c_types/means-graph.type';
import { env } from '@env';
import { AllCdsInfoResp, CDS } from '@interfaces/cds.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { GraphService } from '@services/graph/graph.service';
import { DELAY_API_MS } from '@values/delay-api';
import { delay, forkJoin, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CdsService {
  private readonly BASE_URL = env.api_url + '/cds';
  private readonly _http = inject(HttpClient);
  private readonly _graphService = inject(GraphService);

  readonly cdsSelected = signal<CDS | null>(null);
  readonly isLoading = computed(
    () => this.getInfoCds.isLoading() || this._graphService.manageGraphSelection.isLoading(),
  );

  /**
   * Extracts valid SchedaOpis from a CDS list.
   * Each CDS in the /coarse response represents one academic year,
   * and each teaching has a single schedeopis (or null) for that year.
   */
  private extractValidSchedeOpis(cdsList: CDS[]): SchedaOpis[] {
    return cdsList
      .flatMap((cds) => cds.insegnamenti)
      .map((insegnamento) => insegnamento.schedeopis)
      .filter((scheda): scheda is SchedaOpis => scheda?.domande != null);
  }

  private computeCdsMeans(cdsList: CDS[]): MeansPerYear {
    const cdsSchede = this.extractValidSchedeOpis(cdsList);
    const schedeByYears = GraphMapper.groupByYear(cdsSchede, (scheda) => scheda);

    return this._graphService.computeMeansPerYear(schedeByYears);
  }

  private teachingCdsApi(cds: number): Observable<Teaching[]> {
    const url = `${this.BASE_URL}/with-id/${cds}/insegnamenti`;

    return this._http.get<Teaching[]>(url).pipe(
      map((teachings) => {
        if (!teachings?.length) throw new Error('Nessun insegnamento trovato');
        return teachings;
      }),
    );
  }

  private cdsStatsApi(unictCdsId: number): Observable<MeansPerYear> {
    const url = `${this.BASE_URL}/coarse/${unictCdsId}/schedeopis`;

    return this._http.get<CDS[]>(url).pipe(
      map((rawCourse) => {
        if (!rawCourse?.length) throw new Error('Schede OPIS non trovate');
        return this.computeCdsMeans(rawCourse);
      }),
    );
  }

  readonly getInfoCds = rxResource<AllCdsInfoResp, CDS | null>({
    params: this.cdsSelected,
    stream: ({ params }) => {
      if (!params?.id || !params?.unict_id) {
        return throwError(() => new Error('Id or Unict_id missing!'));
      }

      return forkJoin([this.teachingCdsApi(params.id), this.cdsStatsApi(params.unict_id)]).pipe(
        delay(DELAY_API_MS),
        map(([teachings, courses]) => ({ teachings, courses })),
      );
    },
  });

  updateCDS(cds: CDS, token: string): Observable<unknown> {
    const url = new URL(`${this.BASE_URL}/with-id/${cds.id}`);
    url.searchParams.set('scostamento_numerosita', String(cds.scostamento_numerosita));
    url.searchParams.set('scostamento_media', String(cds.scostamento_media));

    const headers = new HttpHeaders({ Authorization: token });

    return this._http.put(url.toString(), {}, { headers });
  }
}
