import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TeachingStats } from '@interfaces/year-stats.interface';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { mean, round } from '@utils/statistics.utils/statistics.utils';

@Component({
  selector: 'opis-year-stats',
  templateUrl: './year-stats.html',
  styleUrl: './year-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearStats {
  private readonly _cdsService = inject(CdsService);
  private readonly _graphService = inject(GraphService);

  protected readonly cds = this._cdsService.cdsSelected;
  protected readonly selectedYear = this._graphService.selectedYear;
  protected readonly selectedVIndex = this._graphService.selectedVIndex;

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
}
