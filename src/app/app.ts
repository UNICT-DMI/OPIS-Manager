import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@sections/footer/footer';
import { HeaderNav } from '@sections/header-nav/header-nav';

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
export class App {}
