import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';


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
  }

  public login(): void {
    this.apiService.login(this.email, this.password).subscribe(
      data => {
        localStorage.setItem('token', data.token_type + ' ' + data.access_token);
        localStorage.setItem('token_expiration', '' + new Date().getTime() + (data.expires_in * 1000));
        this.router.navigate(['/']);
      },
      err => {
        console.log(err);
        this.error = true;
      }
    );
  }

}
