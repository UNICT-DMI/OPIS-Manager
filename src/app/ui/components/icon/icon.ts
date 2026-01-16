import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'opis-icon',
  template: `<span [class.bigger]="isBig()" class="material-symbols-outlined">{{
    iconName()
  }}</span>`,
  styles: `
    span {
      display: block;

      &.bigger {
        font-size: 5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Icon {
  readonly iconName = input.required<string>();
  readonly isBig = input<boolean>(false);
}
