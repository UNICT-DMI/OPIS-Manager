import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authStub: {
    authTokenIsPresent: ReturnType<typeof vi.fn>;
    authTokenHasExpired: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
  };
  let navigate: ReturnType<typeof vi.fn>;

  const build = (): void => {
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    authStub = {
      authTokenIsPresent: vi.fn().mockReturnValue(false),
      authTokenHasExpired: vi.fn().mockReturnValue(false),
      refreshToken: vi.fn().mockReturnValue(of({})),
      login: vi.fn().mockReturnValue(of({})),
    };
    navigate = vi.fn();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authStub },
        { provide: Router, useValue: { navigate } },
      ],
    });
  });

  it('should create', () => {
    build();
    expect(component).toBeTruthy();
  });

  it('[INIT]: does nothing when no token is present', () => {
    authStub.authTokenIsPresent.mockReturnValue(false);
    build();
    expect(authStub.refreshToken).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('[INIT]: redirects home when a valid token is present', () => {
    authStub.authTokenIsPresent.mockReturnValue(true);
    authStub.authTokenHasExpired.mockReturnValue(false);
    build();
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('[INIT]: refreshes an expired token then redirects home', () => {
    authStub.authTokenIsPresent.mockReturnValue(true);
    authStub.authTokenHasExpired.mockReturnValue(true);
    authStub.refreshToken.mockReturnValue(of({}));
    build();
    expect(authStub.refreshToken).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('[INIT]: sets error when refreshing an expired token fails', () => {
    authStub.authTokenIsPresent.mockReturnValue(true);
    authStub.authTokenHasExpired.mockReturnValue(true);
    authStub.refreshToken.mockReturnValue(throwError(() => new Error('nope')));
    build();
    expect(component['error']()).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('[LOGIN]: posts credentials and navigates home on success', () => {
    build();
    component['email'] = 'u@unict.it';
    component['password'] = 'pw';
    authStub.login.mockReturnValue(of({}));

    component['login']();

    expect(authStub.login).toHaveBeenCalledWith('u@unict.it', 'pw');
    expect(navigate).toHaveBeenCalledWith(['/']);
    expect(component['error']()).toBe(false);
  });

  it('[LOGIN]: sets error on failure', () => {
    build();
    authStub.login.mockReturnValue(throwError(() => new Error('bad')));

    component['login']();

    expect(component['error']()).toBe(true);
  });
});
