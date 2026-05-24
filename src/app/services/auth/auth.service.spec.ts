import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { env } from '@env';
import { LoginResponse } from '@interfaces/auth.interface';
import { AuthService } from './auth.service';

const BASE_URL = env.api_url + '/auth';

const loginResponse: LoginResponse = {
  access_token: 'abc123',
  token_type: 'bearer',
  expires_in: 3600,
};

describe('[SERVICE] == Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.logout();
    localStorage.clear();
  });

  it('[LOGIN]: posts credentials, stores the token and flips isLogged', () => {
    service.login('user@unict.it', 'secret').subscribe((res) => {
      expect(res).toEqual(loginResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@unict.it', password: 'secret' });
    req.flush(loginResponse);

    expect(service.isLogged()).toBe(true);
    expect(service.getAuthToken()).toBe('bearer abc123');
    expect(service.authTokenIsPresent()).toBe(true);
    expect(service.authTokenHasExpired()).toBe(false);
  });

  it('[REFRESH]: posts the raw token (without the "bearer " prefix)', () => {
    localStorage.setItem('auth_token', 'bearer abc123');

    service.refreshToken().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'abc123' });
    req.flush(loginResponse);

    expect(service.isLogged()).toBe(true);
  });

  it('[LOGOUT]: clears storage and isLogged', () => {
    service.login('user@unict.it', 'secret').subscribe();
    httpMock.expectOne(`${BASE_URL}/login`).flush(loginResponse);

    service.logout();

    expect(service.isLogged()).toBe(false);
    expect(service.getAuthToken()).toBeNull();
    expect(service.authTokenIsPresent()).toBe(false);
  });

  it('[EXPIRY]: reports an expired token when the expiry is in the past', () => {
    localStorage.setItem('auth_token', 'bearer abc123');
    localStorage.setItem('auth_exp', `${Date.now() - 1000}`);

    expect(service.authTokenHasExpired()).toBe(true);
  });
});
