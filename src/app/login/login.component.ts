import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoginResponse } from '../api.model';
import { AuthService } from '../auth.service';


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
    public readonly authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.authTokenIsPresent()) {
      if (this.authService.authTokenHasExpired()) {
        this.refreshToken();
      } else {
        this.redirectToHome();
      }
    }
  }

  public login(): void {
    this.authService.login(this.email, this.password)/*.subscribe(
      data => this.saveTokenAndRedirectHome(data),
      err => {
        console.log(err);
        this.error = true;
      }
    );*/
  }

  private refreshToken(): void {
    this.authService.refreshToken()/*.subscribe(
      data => this.saveTokenAndRedirectHome(data),
      err => console.log(err)
    );*/
  }

  private redirectToHome(): void {
    this.router.navigate(['/']);
  }

}
