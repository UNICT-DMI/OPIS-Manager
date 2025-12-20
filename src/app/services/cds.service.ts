import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { CDS } from "@interfaces/cds.interface";
import { Teaching } from "@interfaces/teaching.interface";
import { env } from "src/enviroment";

@Injectable({ providedIn: 'root' })
export class CdsService {
  private readonly BASE_URL = env.api_url + '/cds';
  private readonly _http = inject(HttpClient);

  public cdsSelected = signal<CDS | null>(null);

  private teachingCdsApi(cds: number) {
    const url = `${this.BASE_URL}/width-id/${cds}/insegnamenti`;

    return this._http.get<Teaching[]>(url);
  }

  private coarsePerCdsApi(unictCds: number) {
    const url = `${this.BASE_URL}/coarse/${unictCds}/schedeopis`;

    return this._http.get<CDS[]>(url);
  }

  



  // RIPORTO DA VECCHIO PROGETTO
  // public updateCDS(cds: CDS, token: string): Observable<object> {
  //   const httpOptions = {
  //     headers: new HttpHeaders(
  //       {
  //         Authorization: token,
  //       }
  //     )
  //   };

  //   return this.http.put(this.CONF.apiUrl + 'v2/cds/with-id/' + cds.id
  //     + '?scostamento_numerosita=' + cds.scostamento_numerosita + '&scostamento_media=' + cds.scostamento_media, {}, httpOptions);
  // }
}