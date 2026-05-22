import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'opis-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {}
