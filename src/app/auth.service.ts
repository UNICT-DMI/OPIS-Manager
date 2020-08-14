import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { LoginResponse } from './api.model';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/of';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isLogged = new Subject<boolean>();
    private currentTimeoutFunction: any;
    private TOKEN_KEY = 'auth_token';
    private TOKEN_EXP_KEY = 'auth_exp';

    constructor(
        public readonly apiService: ApiService,
    ) {
        if (this.authTokenIsPresent()) {
            if (this.authTokenHasExpired()) {
                this.refreshToken();
            } else {
                this.isLogged.next(true);
            }
        } else {
            this.isLogged.next(false);
        }
     }

    public login(email: string, password: string): Observable<LoginResponse> {
        const response = this.apiService.login(email, password);
        response.subscribe(
            data => this.saveToken(data),
            err => console.log(err)
        );
        return response;
    }

    public refreshToken(): Observable<LoginResponse> {
        console.log(this.isLogged);
        const response = this.apiService.refreshToken(localStorage.getItem(this.TOKEN_KEY).replace('bearer ', ''));
        response.subscribe(
            data => this.saveToken(data),
            err => console.log(err)
        );
        return response;
    }

    public authStatus(): Observable<boolean> {
        return this.isLogged.asObservable();
    }

    public logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXP_KEY);
        this.isLogged.next(false);
        this.removeTimeout();
    }

    private saveToken(data: LoginResponse): void {
        localStorage.setItem(this.TOKEN_KEY, data.token_type + ' ' + data.access_token);
        localStorage.setItem(this.TOKEN_EXP_KEY, '' + (new Date().getTime() + (data.expires_in * 1000)));
        this.isLogged.next(true);
        this.removeTimeout();
        this.currentTimeoutFunction = setTimeout(() => this.refreshToken(), data.expires_in * 1000);
    }

    private removeTimeout(): void {
        if (this.currentTimeoutFunction != null) {
            clearTimeout(this.currentTimeoutFunction);
        }
    }


    public authTokenHasExpired(): boolean {
        const tokenExpiration = localStorage.getItem(this.TOKEN_EXP_KEY);
        if (tokenExpiration == null) {
            return true;
        } else {
            if (parseInt(tokenExpiration, 10) <= new Date().getTime()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public authTokenIsPresent(): boolean {
        return localStorage.getItem(this.TOKEN_KEY) != null;
    }
}
