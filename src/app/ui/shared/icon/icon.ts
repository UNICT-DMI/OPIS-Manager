import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconDimension } from '@c_types/icon-dimension.type';

@Component({
  selector: 'opis-icon',
  templateUrl: './icon.component.html',
  styles: `
    span {
      display: block;
      /* stylelint-disable */
      &.size-1-5rem { font-size: 1.5rem; }
      &.size-2rem { font-size: 2rem; }
      &.size-2-5rem { font-size: 2.5rem; }
      &.size-3rem { font-size: 3rem; }
      &.size-3-5rem { font-size: 3.5rem; }
      &.size-4rem { font-size: 4rem; }
      &.size-4-5rem { font-size: 4.5rem; }
      &.size-5rem { font-size: 5rem; }
      /* stylelint-enable */
      svg {
        width: 1em;
        height: 1em;
        vertical-align: middle;
        fill: currentColor;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly iconName = input.required<string>();
  readonly dimension = input<IconDimension>('1-5rem');
  readonly svgIcon = input<string | undefined>();
}
