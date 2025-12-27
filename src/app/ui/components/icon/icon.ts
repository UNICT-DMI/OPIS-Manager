import { Component, input } from '@angular/core';

@Component({
  selector: 'opis-icon',
  imports: [],
  template: `<span class="material-symbols-outlined">{{ iconName() }}</span>`,
  styles: `
    span {
      display: block;
    }
  `,
})
export class Icon {
  public iconName = input.required<string>();
}
