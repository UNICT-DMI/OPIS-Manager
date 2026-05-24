import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '@env';
import { LoginResponse } from '@interfaces/auth.interface';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE_URL = env.api_url + '/auth';
  private readonly _http = inject(HttpClient);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXP_KEY = 'auth_exp';

  /** Reactive login state, consumed by the header and the protected pages. */
  readonly isLogged = signal<boolean>(false);

  private _refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (this.authTokenIsPresent()) {
      if (this.authTokenHasExpired()) {
        this.refreshToken().subscribe({ error: () => this.logout() });
      } else {
        this.isLogged.set(true);
        this.scheduleRefresh(this.remainingMs());
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this.BASE_URL}/login`, { email, password })
      .pipe(tap((data) => this.saveToken(data)));
  }

  refreshToken(): Observable<LoginResponse> {
    const token = (localStorage.getItem(this.TOKEN_KEY) ?? '').replace('bearer ', '');
    return this._http
      .post<LoginResponse>(`${this.BASE_URL}/refresh`, { token })
      .pipe(tap((data) => this.saveToken(data)));
  }

  /** Full token in the "bearer xxx" form expected by the protected API methods. */
  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXP_KEY);
    this.isLogged.set(false);
    this.clearRefresh();
  }

  authTokenIsPresent(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) != null;
  }

  authTokenHasExpired(): boolean {
    const expiration = localStorage.getItem(this.TOKEN_EXP_KEY);
    if (expiration == null) {
      return true;
    }
    return parseInt(expiration, 10) <= new Date().getTime();
  }

  private saveToken(data: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, `${data.token_type} ${data.access_token}`);
    localStorage.setItem(this.TOKEN_EXP_KEY, `${new Date().getTime() + data.expires_in * 1000}`);
    this.isLogged.set(true);
    this.scheduleRefresh(data.expires_in * 1000);
  }

  private scheduleRefresh(delayMs: number): void {
    this.clearRefresh();
    this._refreshTimer = setTimeout(
      () => this.refreshToken().subscribe({ error: () => this.logout() }),
      Math.max(delayMs, 0),
    );
  }

  private clearRefresh(): void {
    if (this._refreshTimer != null) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
  }

  private remainingMs(): number {
    const expiration = localStorage.getItem(this.TOKEN_EXP_KEY);
    if (expiration == null) {
      return 0;
    }
    return parseInt(expiration, 10) - new Date().getTime();
  }
}
