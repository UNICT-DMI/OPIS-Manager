import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MeansPerYear } from "@c_types/means-graph.type";
import { env } from "@env";
import { SchedaOpis } from "@interfaces/opis-record.interface";
import { Teaching } from "@interfaces/teaching.interface";
import { GraphService } from "@services/graph/graph.service";
import { AcademicYear } from "@values/years";
import { map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TeachingService {
  private readonly BASE_URL = env.api_url + '/insegnamento';

  private readonly _http = inject(HttpClient);
  private readonly _graphService = inject(GraphService);

  selectedTeaching = signal<Teaching | null>(null);

  private teachingCoarseApi(teaching: Teaching): Observable<Teaching[]> {
    const url = `${this.BASE_URL}/coarse/${teaching.codice_gomp}/schedeopis`;
    const params = new HttpParams()
      .set('canale', teaching.canale ?? 'no')
      .set('id_modulo', teaching.id_modulo ?? '0');

    return this._http.get<Teaching[]>(url, { params }).pipe(
      map((rows) => rows.filter((t) => t.schedeopis?.domande != null)),
    );
  }

  private formatTeachings(rows: Teaching[]) {
    const byYear: Record<string, SchedaOpis[]> = {};

    for (const row of rows) {
      const year = row.anno_accademico;
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(row.schedeopis!);
    }

    const meansPerYear = {} as MeansPerYear;
    for (const year of Object.keys(byYear) as AcademicYear[]) {
      meansPerYear[year] = this._graphService.elaborateFormulaFor(byYear[year]);
    }

    return meansPerYear;
  }

  public getTeachingGraph() {
    return rxResource({
      params: this.selectedTeaching,
      stream: ({ params }) => {
        if (!params) return of(null);

        return this.teachingCoarseApi(params).pipe(
          map((rows) => this.formatTeachings(rows)),
        );
      },
    });
  }

  // public getYearGraph(
  //   coarse: Signal<MeansPerYear | undefined>,
  //   year: Signal<AcademicYear | null>,
  // ): ResourceRef<GraphView | null | undefined> {
  //   return rxResource({
  //     params: () => ({ coarse: coarse(), year: year() }),
  //     stream: ({ params }) => {
  //       if (!params.coarse || !params.year) return of(null);
  //       return of(GraphMapper.toCdsYearGraph(params.coarse, params.year));
  //     },
  //   });
  // }
}