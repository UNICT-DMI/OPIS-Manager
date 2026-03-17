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
import { FormsModule } from '@angular/forms';
import { SelectOption } from '@interfaces/graph-config.interface';

const DROPDOWN_HEIGHT = 240;

@Component({
  selector: 'opis-select',
  imports: [FormsModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  private readonly _el = inject(ElementRef);

  readonly options = input.required<SelectOption[]>();
  readonly placeholder = input<string>('Seleziona...');
  readonly searchPlaceholder = input<string>('Cerca...');
  readonly value = model<SelectOption | null>(null);
  readonly changed = output<SelectOption>();

  protected readonly isOpen = signal(false);
  protected readonly openUp = signal(false);
  protected readonly searchQuery = signal('');

  protected readonly selectedLabel = computed(() => this.value()?.label ?? this.placeholder());

  protected readonly filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(query));
  });

  protected toggle(): void {
    if (!this.isOpen()) {
      this._checkDirection();
      this.searchQuery.set('');
    }
    this.isOpen.update(v => !v);
  }

  protected select(option: SelectOption): void {
    this.value.set(option);
    this.changed.emit(option);
    this.isOpen.set(false);
    this.searchQuery.set('');
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