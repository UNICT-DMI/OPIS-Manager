import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'opis-info',
  templateUrl: './info.html',
  styleUrl: './info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent {}
