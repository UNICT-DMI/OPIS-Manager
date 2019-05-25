import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Config {
  apiUrl: string;
  years: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  configUrl = 'assets/config.json';

  getConfig() {
    return this.http.get(this.configUrl);
  }
}
