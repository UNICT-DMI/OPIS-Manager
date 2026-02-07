import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private readonly _http = inject(HttpClient);
  private readonly cache = new Map<'github' | 'linkedin', Observable<string>>();

  public load(name: 'github' | 'linkedin'): Observable<string> {
    if (!this.cache.has(name)) {
      const request$ = this._http
        .get(`/icons/${name}-icon.svg`, { responseType: 'text' })
        .pipe(
          map(svg => svg.trim()),
          shareReplay(1)
        );

      this.cache.set(name, request$);
    }

    return this.cache.get(name)!;
  }
}
