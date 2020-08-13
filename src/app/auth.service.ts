import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginResponse } from './api.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private TOKEN_KEY = 'auth_token';
    private TOKEN_EXP_KEY = 'auth_exp';

    constructor(
        public readonly apiService: ApiService,
    ) { }

    public login(email: string, password: string): void {
        this.apiService.login(email, password).subscribe(
            data => this.saveToken(data),
            err => console.log(err)
        );
    }

    public refreshToken(): void {
        this.apiService.refreshToken(localStorage.getItem(this.TOKEN_KEY).replace('bearer ', '')).subscribe(
            data => this.saveToken(data),
            err => console.log(err)
        );
    }

    public logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXP_KEY);
    }

    private saveToken(data: LoginResponse): void {
        localStorage.setItem(this.TOKEN_KEY, data.token_type + ' ' + data.access_token);
        localStorage.setItem(this.TOKEN_EXP_KEY, '' + (new Date().getTime() + (data.expires_in * 1000)));
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
