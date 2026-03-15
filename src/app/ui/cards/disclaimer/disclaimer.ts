import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'opis-disclaimer',
  imports: [],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disclaimer {
  readonly disclaimerInfo = input.required<{ title: string, description: string }>();
}
