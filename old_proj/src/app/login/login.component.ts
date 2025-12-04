import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


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
    this.authService.login(this.email, this.password).subscribe(
      data => this.redirectToHome(),
      err => this.error = true
    );
  }

  private refreshToken(): void {
    this.authService.refreshToken().subscribe(
      data => this.redirectToHome(),
      err => this.error = true
    );
  }

  private redirectToHome(): void {
    this.router.navigate(['/']);
  }

}
