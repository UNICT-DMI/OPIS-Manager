import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavItem } from '@interfaces/header-nav-interface';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/departments/departments.service';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-header-nav',
  imports: [RouterLink, IconComponent],
  templateUrl: './header-nav.html',
  styleUrl: './header-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNav {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  protected readonly currentDepartment = inject(DepartmentsService).currentDepartment;
  protected readonly isLogged = this._authService.isLogged;

  protected readonly NavItems: NavItem[] = [
    { label: 'Formula', route: '/formula' },
    { label: 'Info', route: '/info' },
  ];

  protected readonly loginItem: NavItem = {
    label: 'Login',
    route: '/login',
    icon: {
      name: 'account_circle',
      dimension: '2rem',
    },
  };

  protected logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
