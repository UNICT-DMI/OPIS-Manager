import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconDimension } from '@c_types/icon-dimension.type';

@Component({
  selector: 'opis-icon',
  template: `<span class="material-symbols-outlined size-{{ dimension() }}">{{
    iconName()
  }}</span>`,
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  styles: `
    span {
      display: block;

      &.size-1rem {
        font-size: 1rem;
      }

      &.size-1-5rem {
        font-size: 1.5rem;
      }

      &.size-2rem {
        font-size: 2rem;
      }

      &.size-2-5rem {
        font-size: 2.5rem;
      }

      &.size-3rem {
        font-size: 3rem;
      }

      &.size-3-5rem {
        font-size: 3.5rem;
      }

      &.size-4rem {
        font-size: 4rem;
      }

      &.size-4-5rem {
        font-size: 4.5rem;
      }

      &.size-5rem {
        font-size: 5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly iconName = input.required<string>();
  readonly dimension = input<IconDimension>('1rem');
}
