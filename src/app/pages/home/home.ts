import { Component } from '@angular/core';
import { LogoAnimated } from '@components/logo-animated/logo-animated';

@Component({
  selector: 'app-home',
  imports: [ LogoAnimated ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
