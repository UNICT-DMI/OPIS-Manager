import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from '@sections/footer/footer';
import { HeaderNav } from '@sections/header-nav/header-nav';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { filter } from 'rxjs';

@Component({
  selector: 'opis-root',
  imports: [HeaderNav, RouterOutlet, Footer],
  template: ` <opis-header-nav />
    <main class="opis-app">
      <router-outlet />
    </main>
    <opis-footer />`,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.analytics.trackPageView(event.urlAfterRedirects));
  }
}
