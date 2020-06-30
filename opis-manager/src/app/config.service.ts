import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

export interface Config {
  apiUrl: string;
  years: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Config = {
    apiUrl: '',
    years: [],
  };

  constructor(private readonly http: HttpClient) {
    this.updateConfig();
  }

  getConfig(): Observable<Config> {
    return this.http.get<Config>('assets/config.json');
  }

  updateConfig(): Observable<Config> {
    return this.getConfig().pipe(
      take(1),
      tap((c: Config) => {
        this.config.apiUrl = c.apiUrl;
        this.config.years = c.years;
      })
    );
  }

}
