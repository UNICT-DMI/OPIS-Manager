import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
import { LoginResponse } from '../api.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  public error = false;

  constructor(
    public readonly apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authTokenIsPresent()) {
      if (this.authTokenHasExpired()) {
        this.refreshToken();
      } else {
        this.redirectToHome();
      }
    }
  }

  public login(): void {
    this.apiService.login(this.email, this.password).subscribe(
      data => this.saveTokenAndRedirectHome(data),
      err => {
        console.log(err);
        this.error = true;
      }
    );
  }

  private refreshToken(): void {
    this.apiService.refreshToken(localStorage.getItem('token').replace('bearer ', '')).subscribe(
      data => this.saveTokenAndRedirectHome(data),
      err => console.log(err)
    );
  }

  private saveTokenAndRedirectHome(data: LoginResponse): void {
    localStorage.setItem('token', data.token_type + ' ' + data.access_token);
    localStorage.setItem('token_expiration', '' + (new Date().getTime() + (data.expires_in * 1000)));
    this.redirectToHome();
  }

  private authTokenHasExpired(): boolean {
    const tokenExpiration = localStorage.getItem('token_expiration');
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

  private authTokenIsPresent(): boolean {
    return localStorage.getItem('token') != null;
  }

  private redirectToHome(): void {
    this.router.navigate(['/']);
  }

}
