import { Component, input } from '@angular/core';

@Component({
  selector: 'opis-icon',
  imports: [],
  template: `<span
    [class.bigger]="isBig()"
    class="material-symbols-outlined"
  >{{ iconName() }}</span>`,
  styles: `
    span {
      display: block;

      &.bigger {
        font-size: 5rem;
      }
    }
  `,
})
export class Icon {
  public iconName = input.required<string>();
  public isBig = input<boolean>(false);
}
