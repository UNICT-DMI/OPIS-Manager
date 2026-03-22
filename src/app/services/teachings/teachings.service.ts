import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MeansPerYear } from '@c_types/means-graph.type';
import { env } from '@env';
import { Teaching } from '@interfaces/teaching.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { GraphService } from '@services/graph/graph.service';
import { map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeachingService {
  private readonly BASE_URL = env.api_url + '/insegnamento';

  private readonly _http = inject(HttpClient);
  private readonly _graphService = inject(GraphService);

  readonly selectedTeaching = signal<Teaching | null>(null);

  private teachingCoarseApi(teaching: Teaching): Observable<Teaching[]> {
    const url = `${this.BASE_URL}/coarse/${teaching.codice_gomp}/schedeopis`;
    const params = new HttpParams()
      .set('canale', teaching.canale ?? 'no')
      .set('id_modulo', teaching.id_modulo ?? '0');

    return this._http
      .get<Teaching[]>(url, { params })
      .pipe(map((rows) => rows.filter((t) => t.schedeopis?.domande != null)));
  }

  private computeTeachingMeans(rows: Teaching[]) {
    const teachingScheduleByYear = GraphMapper.groupByYear(rows, (teaching) => teaching.schedeopis);
    return this._graphService.computeMeansPerYear(teachingScheduleByYear);
  }

  getTeachingGraph(): ResourceRef<MeansPerYear | null | undefined> {
    return rxResource({
      params: this.selectedTeaching,
      stream: ({ params }) => {
        if (!params) return of(null);

        return this.teachingCoarseApi(params).pipe(map((rows) => this.computeTeachingMeans(rows)));
      },
    });
  }
}
