import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  public readonly faGithub = faGithub;

  public isLogged = false;

  constructor(
    public readonly authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.authTokenIsPresent()) {
      if (this.authService.authTokenHasExpired()) {
        this.authService.refreshToken();
      }
      this.isLogged = true;
    }
  }

  public logout(): void {
    this.authService.logout();
    this.isLogged = false;
    this.router.navigate(['/login']);
  }

}
