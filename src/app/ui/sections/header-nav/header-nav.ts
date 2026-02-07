import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavItem } from '@interfaces/header-nav-interface';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-header-nav',
  imports: [RouterLink, IconComponent],
  templateUrl: './header-nav.html',
  styleUrl: './header-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNav {
  protected readonly NavItems: NavItem[] = [
    { label: 'Formula', route: '/formula' },
    { label: 'Info', route: '/info' },
    {
      label: 'Login',
      route: '/login',
      icon: {
        name: 'account_circle',
        dimension: '2rem'
      }
    }
  ];
}
