import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { SelectComponent } from './select';
import { SelectOption } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';

// ─── Mock IconComponent ───────────────────────────────────────────────────────
import { Component as NgComponent } from '@angular/core';
@NgComponent({ selector: 'opis-icon', template: '', standalone: true })
class MockIconComponent {}

// ─── Mock options ─────────────────────────────────────────────────────────────
const MOCK_OPTIONS: SelectOption[] = [
  { value: 'v1', label: 'Opzione Uno' },
  { value: 'v2', label: 'Opzione Due' },
  { value: 'v3', label: 'Opzione Tre' },
];

// ─── Host wrapper ─────────────────────────────────────────────────────────────
@NgComponent({
  standalone: true,
  imports: [SelectComponent],
  template: `
    <opis-select
      [options]="options()"
      [placeholder]="placeholder()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
})
class HostComponent {
  options = signal<SelectOption[]>(MOCK_OPTIONS);
  placeholder = signal('Seleziona...');
  value: SelectOption | null = null;
  changedSpy = vi.fn();
  onChanged(opt: SelectOption) {
    this.changedSpy(opt);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTrigger(fixture: ComponentFixture<HostComponent>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('.opis-select__trigger');
}

function getDropdown(fixture: ComponentFixture<HostComponent>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.opis-select__dropdown');
}

function getOptions(fixture: ComponentFixture<HostComponent>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('.opis-select__option'));
}

function getSearchInput(fixture: ComponentFixture<HostComponent>): HTMLInputElement | null {
  return fixture.nativeElement.querySelector('.opis-select__search-input');
}

function openDropdown(fixture: ComponentFixture<HostComponent>): void {
  getTrigger(fixture).click();
  fixture.detectChanges();
}

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    })
      .overrideComponent(SelectComponent, {
        remove: { imports: [IconComponent] },
        add: { imports: [MockIconComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering iniziale ──────────────────────────────────────────────────────
  describe('rendering iniziale', () => {
    it('dovrebbe renderizzare il trigger', () => {
      expect(getTrigger(fixture)).toBeTruthy();
    });

    it('dovrebbe mostrare il placeholder se nessun valore è selezionato', () => {
      const span = getTrigger(fixture).querySelector('span');
      expect(span?.textContent?.trim()).toBe('Seleziona...');
      expect(span?.classList).toContain('placeholder');
    });

    it('dovrebbe mostrare un placeholder personalizzato', () => {
      host.placeholder.set('Scegli un corso...');
      fixture.detectChanges();
      const span = getTrigger(fixture).querySelector('span');
      expect(span?.textContent?.trim()).toBe('Scegli un corso...');
    });

    it('il dropdown non dovrebbe essere visibile inizialmente', () => {
      expect(getDropdown(fixture)).toBeNull();
    });
  });

  // ── Toggle ─────────────────────────────────────────────────────────────────
  describe('toggle', () => {
    it('dovrebbe aprire il dropdown al click sul trigger', () => {
      openDropdown(fixture);
      expect(getDropdown(fixture)).toBeTruthy();
    });

    it('dovrebbe aggiungere la classe "open" al wrapper quando aperto', () => {
      openDropdown(fixture);
      const wrapper = fixture.nativeElement.querySelector('.opis-select');
      expect(wrapper.classList).toContain('open');
    });

    it('dovrebbe chiudere il dropdown al secondo click', () => {
      openDropdown(fixture);
      getTrigger(fixture).click();
      fixture.detectChanges();
      expect(getDropdown(fixture)).toBeNull();
    });

    it('dovrebbe resettare la searchQuery alla riapertura', () => {
      openDropdown(fixture);
      const input = getSearchInput(fixture)!;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // chiudo e riapro
      getTrigger(fixture).click();
      fixture.detectChanges();
      getTrigger(fixture).click();
      fixture.detectChanges();

      expect(getSearchInput(fixture)?.value).toBe('');
    });
  });

  // ── Opzioni ────────────────────────────────────────────────────────────────
  describe('opzioni', () => {
    beforeEach(() => openDropdown(fixture));

    it('dovrebbe renderizzare tutte le opzioni', () => {
      expect(getOptions(fixture).length).toBe(MOCK_OPTIONS.length);
    });

    it('dovrebbe mostrare le label corrette', () => {
      const labels = getOptions(fixture).map((o) => o.textContent?.trim());
      expect(labels).toEqual(MOCK_OPTIONS.map((o) => o.label));
    });

    it("dovrebbe selezionare un'opzione al click", () => {
      getOptions(fixture)[1].click();
      fixture.detectChanges();
      const span = getTrigger(fixture).querySelector('span');
      expect(span?.textContent?.trim()).toBe('Opzione Due');
      expect(span?.classList).not.toContain('placeholder');
    });

    it('dovrebbe chiudere il dropdown dopo la selezione', () => {
      getOptions(fixture)[0].click();
      fixture.detectChanges();
      expect(getDropdown(fixture)).toBeNull();
    });

    it('dovrebbe emettere l\'evento "changed" con l\'opzione selezionata', () => {
      getOptions(fixture)[2].click();
      fixture.detectChanges();
      expect(host.changedSpy).toHaveBeenCalledWith(MOCK_OPTIONS[2]);
    });

    it('dovrebbe applicare la classe "selected" all\'opzione attiva', () => {
      getOptions(fixture)[0].click();
      fixture.detectChanges();
      openDropdown(fixture);
      expect(getOptions(fixture)[0].classList).toContain('selected');
      expect(getOptions(fixture)[1].classList).not.toContain('selected');
    });
  });

  // ── Ricerca ────────────────────────────────────────────────────────────────
  describe('ricerca', () => {
    beforeEach(() => openDropdown(fixture));

    it("dovrebbe renderizzare l'input di ricerca", () => {
      expect(getSearchInput(fixture)).toBeTruthy();
    });

    it('dovrebbe filtrare le opzioni in base al testo digitato', async () => {
      const input = getSearchInput(fixture)!;
      input.value = 'due';
      input.dispatchEvent(new Event('input'));
      // ngModel è asincrono
      await fixture.whenStable();
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options.length).toBe(1);
      expect(options[0].textContent?.trim()).toBe('Opzione Due');
    });

    it('la ricerca dovrebbe essere case-insensitive', async () => {
      const input = getSearchInput(fixture)!;
      input.value = 'UNO';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();

      expect(getOptions(fixture).length).toBe(1);
    });

    it('dovrebbe mostrare "Nessun risultato" se nessuna opzione corrisponde', async () => {
      const input = getSearchInput(fixture)!;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector('.opis-select__empty');
      expect(empty?.textContent?.trim()).toBe('Nessun risultato');
      expect(getOptions(fixture).length).toBe(0);
    });

    it('dovrebbe mostrare tutte le opzioni con query vuota', async () => {
      const input = getSearchInput(fixture)!;
      input.value = 'uno';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();

      input.value = '';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();

      expect(getOptions(fixture).length).toBe(MOCK_OPTIONS.length);
    });
  });

  // ── Click esterno ──────────────────────────────────────────────────────────
  describe('click esterno', () => {
    it('dovrebbe chiudere il dropdown al click fuori dal componente', () => {
      openDropdown(fixture);
      document.body.click();
      fixture.detectChanges();
      expect(getDropdown(fixture)).toBeNull();
    });

    it('non dovrebbe chiudere il dropdown al click dentro il componente', () => {
      openDropdown(fixture);
      fixture.nativeElement.querySelector('.opis-select').click();
      fixture.detectChanges();
      expect(getDropdown(fixture)).toBeTruthy();
    });
  });

  // ── Open-up ────────────────────────────────────────────────────────────────
  describe('direzione apertura', () => {
    it('dovrebbe aggiungere la classe "open-up" se spazio insufficiente sotto', () => {
      const el = fixture.nativeElement.querySelector('.opis-select') as HTMLElement;
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        bottom: window.innerHeight - 50,
      } as DOMRect);

      openDropdown(fixture);

      expect(el.classList).toContain('open-up');
    });

    it('non dovrebbe aggiungere "open-up" se c\'è spazio sufficiente', () => {
      const el = fixture.nativeElement.querySelector('.opis-select') as HTMLElement;
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ bottom: 100 } as DOMRect);

      openDropdown(fixture);

      expect(el.classList).not.toContain('open-up');
    });
  });
});
