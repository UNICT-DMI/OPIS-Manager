import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './utils/animations';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from './services/auth/auth.service';
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
    if (this.authService.authTokenIsPresent() && !this.authService.authTokenHasExpired()) {
      this.isLogged = true;
    }
    this.authService.authStatus().subscribe(
      status => this.isLogged = status
    );
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
