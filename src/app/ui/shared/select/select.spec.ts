import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';
import { describe, expect, it, vi } from 'vitest';
import { SelectComponent } from './select';

// ─── Mock ─────────────────────────────────────────────────────────────────────
@Component({
  selector: 'opis-icon',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockIconComponent {}

@Component({
  selector: 'opis-host',
  imports: [SelectComponent],
  standalone: true,
  template: `
    <opis-select
      [options]="options()"
      [placeholder]="placeholder()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  readonly options = signal<SelectOption[]>([
    { value: 'v1', label: 'Option One' },
    { value: 'v2', label: 'Option Two' },
    { value: 'v3', label: 'Option Three' },
  ]);
  readonly placeholder = signal('Select...');
  value: SelectOption | null = null;
  changedSpy = vi.fn();
  onChanged(opt: SelectOption) {
    this.changedSpy(opt);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTrigger = (f: ComponentFixture<HostComponent>): HTMLButtonElement =>
  f.nativeElement.querySelector('.opis-select__trigger');

const getDropdown = (f: ComponentFixture<HostComponent>): HTMLElement | null =>
  f.nativeElement.querySelector('.opis-select__dropdown');

const getOptions = (f: ComponentFixture<HostComponent>): HTMLElement[] =>
  Array.from(f.nativeElement.querySelectorAll('.opis-select__option'));

const getSearchInput = (f: ComponentFixture<HostComponent>): HTMLInputElement | null =>
  f.nativeElement.querySelector('.opis-select__search-input');

const openDropdown = (f: ComponentFixture<HostComponent>): void => {
  getTrigger(f).click();
  f.detectChanges();
};

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] })
      .overrideComponent(SelectComponent, {
        remove: { imports: [IconComponent] },
        add: { imports: [MockIconComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Initial rendering ───────────────────────────────────────────────────────
  it('[SELECT]: Created', () => expect(fixture.componentInstance).toBeTruthy());

  it('[SELECT]: should render the trigger button', () => expect(getTrigger(fixture)).toBeTruthy());

  it('[SELECT]: should show placeholder when no value is selected', () => {
    const span = getTrigger(fixture).querySelector('span');
    expect(span?.textContent?.trim()).toBe('Select...');
    expect(span?.classList).toContain('placeholder');
  });

  it('[SELECT]: should reflect a custom placeholder', () => {
    host.placeholder.set('Choose a course...');
    fixture.detectChanges();
    expect(getTrigger(fixture).querySelector('span')?.textContent?.trim()).toBe(
      'Choose a course...',
    );
  });

  it('[SELECT]: should not render the dropdown initially', () =>
    expect(getDropdown(fixture)).toBeNull());

  // ── Toggle ──────────────────────────────────────────────────────────────────
  it('[SELECT]: should open the dropdown on trigger click', () => {
    openDropdown(fixture);
    expect(getDropdown(fixture)).toBeTruthy();
  });

  it('[SELECT]: should add "open" class to the wrapper when open', () => {
    openDropdown(fixture);
    expect(fixture.nativeElement.querySelector('.opis-select').classList).toContain('open');
  });

  it('[SELECT]: should close the dropdown on second click', () => {
    openDropdown(fixture);
    getTrigger(fixture).click();
    fixture.detectChanges();
    expect(getDropdown(fixture)).toBeNull();
  });

  it('[SELECT]: should reset search query on reopen', () => {
    openDropdown(fixture);
    const input = getSearchInput(fixture)!;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    getTrigger(fixture).click();
    fixture.detectChanges();
    getTrigger(fixture).click();
    fixture.detectChanges();

    expect(getSearchInput(fixture)?.value).toBe('');
  });

  // ── Options ─────────────────────────────────────────────────────────────────
  it('[SELECT]: should render all options', () => {
    openDropdown(fixture);
    expect(getOptions(fixture).length).toBe(3);
  });

  it('[SELECT]: should display correct option labels', () => {
    openDropdown(fixture);
    const labels = getOptions(fixture).map((o) => o.textContent?.trim());
    expect(labels).toEqual(['Option One', 'Option Two', 'Option Three']);
  });

  it('[SELECT]: should select an option on click and show its label', () => {
    openDropdown(fixture);
    getOptions(fixture)[1].click();
    fixture.detectChanges();
    const span = getTrigger(fixture).querySelector('span');
    expect(span?.textContent?.trim()).toBe('Option Two');
    expect(span?.classList).not.toContain('placeholder');
  });

  it('[SELECT]: should close the dropdown after selection', () => {
    openDropdown(fixture);
    getOptions(fixture)[0].click();
    fixture.detectChanges();
    expect(getDropdown(fixture)).toBeNull();
  });

  it('[SELECT]: should emit "changed" with the selected option', () => {
    openDropdown(fixture);
    getOptions(fixture)[2].click();
    fixture.detectChanges();
    expect(host.changedSpy).toHaveBeenCalledWith({ value: 'v3', label: 'Option Three' });
  });

  it('[SELECT]: should apply "selected" class to the active option', () => {
    openDropdown(fixture);
    getOptions(fixture)[0].click();
    fixture.detectChanges();
    openDropdown(fixture);
    expect(getOptions(fixture)[0].classList).toContain('selected');
    expect(getOptions(fixture)[1].classList).not.toContain('selected');
  });

  it('[SELECT]: should render the search input', () => {
    openDropdown(fixture);
    expect(getSearchInput(fixture)).toBeTruthy();
  });

  it('[SELECT]: should filter options by search query', async () => {
    openDropdown(fixture);
    const input = getSearchInput(fixture)!;
    input.value = 'two';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    const options = getOptions(fixture);
    expect(options.length).toBe(1);
    expect(options[0].textContent?.trim()).toBe('Option Two');
  });

  it('[SELECT]: should filter options case-insensitively', async () => {
    openDropdown(fixture);
    const input = getSearchInput(fixture)!;
    input.value = 'ONE';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getOptions(fixture).length).toBe(1);
  });

  it('[SELECT]: should show "Nessun risultato" when no options match', async () => {
    openDropdown(fixture);
    const input = getSearchInput(fixture)!;
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.opis-select__empty')?.textContent?.trim()).toBe(
      'Nessun risultato',
    );
    expect(getOptions(fixture).length).toBe(0);
  });

  it('[SELECT]: should restore all options when query is cleared', async () => {
    openDropdown(fixture);
    const input = getSearchInput(fixture)!;
    input.value = 'one';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getOptions(fixture).length).toBe(3);
  });

  it('[SELECT]: should close the dropdown on outside click', () => {
    openDropdown(fixture);
    document.body.click();
    fixture.detectChanges();
    expect(getDropdown(fixture)).toBeNull();
  });

  it('[SELECT]: should not close the dropdown on inside click', () => {
    openDropdown(fixture);
    fixture.nativeElement.querySelector('.opis-select').click();
    fixture.detectChanges();
    expect(getDropdown(fixture)).toBeTruthy();
  });

  it('[SELECT]: should add "open-up" class when space below is insufficient', () => {
    const hostEl = fixture.nativeElement.querySelector('opis-select') as HTMLElement;
    vi.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      bottom: window.innerHeight - 50,
    } as DOMRect);
    openDropdown(fixture);
    const wrapper = fixture.nativeElement.querySelector('.opis-select');
    expect(wrapper.classList).toContain('open-up');
  });

  it('[SELECT]: should not add "open-up" class when space below is sufficient', () => {
    const hostEl = fixture.nativeElement.querySelector('opis-select') as HTMLElement;
    vi.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({ bottom: 100 } as DOMRect);
    openDropdown(fixture);
    const wrapper = fixture.nativeElement.querySelector('.opis-select');
    expect(wrapper.classList).not.toContain('open-up');
  });
});
