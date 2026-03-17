import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { DisclaimerInfo } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';
import { slug } from '@utils/strings.utils';

@Component({
  selector: 'opis-disclaimers',
  imports: [IconComponent],
  templateUrl: './disclaimers.html',
  styleUrl: './disclaimers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disclaimers {
  readonly disclaimers = input.required<DisclaimerInfo[]>();

  private readonly _openId = linkedSignal(() => {
    const defaultOpen = this.disclaimers().find(d => d.isOpen);
    return this.getIdentityKey(defaultOpen);
  });

  private getIdentityKey(disclaimer?: DisclaimerInfo): string | null {
    if (!disclaimer) return null;

    const slugTitle = slug(disclaimer.title);
    return `${disclaimer.type}-${slugTitle}`;
  }

  protected isOpen(disclaimer: DisclaimerInfo): boolean {
    if (!disclaimer.isAccordion) return false;

    return this._openId() === this.getIdentityKey(disclaimer);
  }

  protected manageOpening(disclaimer: DisclaimerInfo): void {
    if (!disclaimer.isAccordion) return;
    
    const identityKey = this.getIdentityKey(disclaimer);
    this._openId.set(this._openId() === identityKey ? null : identityKey);
  }
}
