import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CDS } from '@interfaces/cds.interface';
import { SaveMessage } from '@interfaces/save-message.interface';
import { TeachingStats } from '@interfaces/year-stats.interface';
import { AuthService } from '@services/auth/auth.service';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { mean, round } from '@utils/statistics.utils/statistics.utils';

@Component({
  selector: 'opis-year-stats',
  imports: [FormsModule],
  templateUrl: './year-stats.html',
  styleUrl: './year-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearStats {
  private readonly _cdsService = inject(CdsService);
  private readonly _graphService = inject(GraphService);
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly cds = this._cdsService.cdsSelected;
  protected readonly selectedYear = this._graphService.selectedYear;
  protected readonly selectedVIndex = this._graphService.selectedVIndex;

  protected readonly isLogged = this._authService.isLogged;
  protected readonly saving = signal<boolean>(false);
  protected readonly saveMessage = signal<SaveMessage | null>(null);

  /** Editable copies of the deviation thresholds; reset whenever the selected CDS changes. */
  protected readonly editMedia = linkedSignal(() => this.cds()?.scostamento_media ?? 0);
  protected readonly editNumerosita = linkedSignal(
    () => this.cds()?.scostamento_numerosita ?? 0,
  );

  private readonly _infoCds = this._cdsService.getInfoCds;

  protected readonly yearTeachings = computed(() => {
    const year = this.selectedYear();
    const data = this._infoCds.value();
    if (!year || !data) return [];

    return (data.teachingsByYear[year] ?? []).filter((t) => t.schedeopis?.domande != null);
  });

  protected readonly vCdsMean = computed<number | null>(() => {
    const year = this.selectedYear();
    const data = this._infoCds.value();
    if (!year || !data) return null;

    return data.courses[year]?.[0]?.[this.selectedVIndex()] ?? null;
  });

  protected readonly nCdsMean = computed<number | null>(() => {
    const teachings = this.yearTeachings();
    if (teachings.length === 0) return null;

    return round(mean(teachings.map((t) => t.schedeopis.totale_schede)));
  });

  protected readonly stats = computed<TeachingStats>(() => {
    const teachings = this.yearTeachings();
    const vCds = this.vCdsMean();
    const nCds = this.nCdsMean();
    const cds = this.cds();

    const empty: TeachingStats = { badVal: [], goodVal: [], badN: [], goodN: [] };
    if (!teachings.length || vCds == null || nCds == null || !cds) return empty;

    const vIndex = this.selectedVIndex();
    const [, perScheduleValues] = this._graphService.elaborateFormulaFor(
      teachings.map((t) => t.schedeopis),
    );
    const values = perScheduleValues[vIndex] ?? [];

    const scostMedia = Math.max(0, cds.scostamento_media ?? 0);
    const scostNum = Math.max(0, cds.scostamento_numerosita ?? 0);

    const result: TeachingStats = { badVal: [], goodVal: [], badN: [], goodN: [] };

    for (let i = 0; i < teachings.length; i++) {
      const name = this.fullName(teachings[i]);
      const v = values[i];
      const n = teachings[i].schedeopis.totale_schede;

      if (v <= vCds - scostMedia) result.badVal.push(name);
      else if (v >= vCds + scostMedia) result.goodVal.push(name);

      if (n <= nCds - scostNum) result.badN.push(name);
      else if (n >= nCds + scostNum) result.goodN.push(name);
    }

    return result;
  });

  private fullName(teaching: { nome: string; canale?: string; docente?: string }): string {
    const channel = teaching.canale && teaching.canale !== 'no' ? ` (${teaching.canale})` : '';
    const prof = teaching.docente ? ` — ${teaching.docente}` : '';
    return `${teaching.nome}${channel}${prof}`;
  }

  protected saveDeviations(): void {
    const current = this.cds();
    const token = this._authService.getAuthToken();
    if (!current || !token) return;

    const updated: CDS = {
      ...current,
      scostamento_media: this.editMedia(),
      scostamento_numerosita: this.editNumerosita(),
    };

    this.saving.set(true);
    this.saveMessage.set(null);
    this._cdsService
      .updateCDS(updated, token)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          // Reflect the new thresholds so the good/bad split recomputes.
          this._cdsService.cdsSelected.set(updated);
          this.saveMessage.set({ type: 'success', text: 'Scostamenti aggiornati correttamente!' });
        },
        error: () => {
          this.saving.set(false);
          this.saveMessage.set({ type: 'error', text: "Errore nell'aggiornare gli scostamenti." });
        },
      });
  }
}
