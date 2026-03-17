import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DisclaimerType } from '@c_types/means-graph.type';
import { DisclaimerInfo } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-disclaimer',
  imports: [IconComponent],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disclaimer {
  readonly disclaimerInfo = input.required<DisclaimerInfo>();

  isOpen = false;
}
