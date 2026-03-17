import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { SelectOption } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';

const DROPDOWN_HEIGHT = 240; // max-height + margine di sicurezza

@Component({
  selector: 'opis-select',
  imports: [IconComponent],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  private readonly _el = inject(ElementRef);

  readonly options = input.required<SelectOption[]>();
  readonly placeholder = input<string>('Seleziona...');
  readonly value = model<SelectOption | null>(null);
  readonly changed = output<SelectOption>();

  protected readonly isOpen = signal(false);
  protected readonly openUp = signal(false);

  protected readonly selectedLabel = computed(() => this.value()?.label ?? this.placeholder());

  protected toggle(): void {
    if (!this.isOpen()) {
      this._checkDirection();
    }
    this.isOpen.update((v) => !v);
  }

  protected select(option: SelectOption): void {
    this.value.set(option);
    this.changed.emit(option);
    this.isOpen.set(false);
  }

  private _checkDirection(): void {
    const rect = (this._el.nativeElement as HTMLElement).getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    this.openUp.set(spaceBelow < DROPDOWN_HEIGHT);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this._el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}