import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-login',
  imports: [FormsModule, IconComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly error = signal(false);

  ngOnInit(): void {
    if (!this._authService.authTokenIsPresent()) return;

    if (this._authService.authTokenHasExpired()) {
      this._authService.refreshToken().subscribe({
        next: () => this.redirectToHome(),
        error: () => this.error.set(true),
      });
    } else {
      this.redirectToHome();
    }
  }

  protected login(): void {
    this.error.set(false);
    this._authService.login(this.email, this.password).subscribe({
      next: () => this.redirectToHome(),
      error: () => this.error.set(true),
    });
  }

  private redirectToHome(): void {
    this._router.navigate(['/']);
  }
}
