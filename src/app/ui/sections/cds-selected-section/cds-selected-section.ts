import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  ElementRef,
  inject,
  ResourceStatus,
  signal,
  viewChild,
} from '@angular/core';
import { GraphSelection } from '@enums/chart-typology.enum';
import { GraphView, SelectOption } from '@interfaces/graph-config.interface';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { Graph } from '@shared-ui/graph/graph';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';
import { SelectComponent } from '@shared-ui/select/select';
import { typedKeys } from '@utils/object-helpers.utils';
import { GraphResolvers, SelectorResolvers } from '@values/graph-resolvers/graph-resolvers.value';
import { GRAPH_DATA } from '@values/messages.value';
import { AcademicYear } from '@values/years';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [IconComponent, Loader, Graph, SelectComponent],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);
  private readonly _graphService = inject(GraphService);
  private readonly _teachingService = inject(TeachingService);

  private readonly _graphDescrRef = viewChild<ElementRef>('graphDesc');

  protected readonly minHeight = signal(0);

  protected readonly ERR_STATUS: ResourceStatus = 'error';
  protected readonly BASE_ERROR_MSG = 'Dati non disponibili :/';

  protected readonly cds = computed(this._cdsService.cdsSelected);

  protected readonly infoCds = this._cdsService.getInfoCds;
  protected readonly graphSelected = this._graphService.manageGraphSelection;
  protected readonly infoTeaching = this._teachingService.getTeachingGraph();
  protected readonly selectedYear = this._graphService.selectedYear;
  protected readonly selectedVIndex = this._graphService.selectedVIndex;
  protected readonly teachingSearch = this._graphService.teachingSearch;
  protected readonly vIndexes: (0 | 1 | 2)[] = [0, 1, 2];

  protected readonly isAllInfoLoading = this._cdsService.isLoading;

  constructor() {
    this.resetTeachingGraph();
    this.trackMinHeight();
  }

  protected readonly msgError = computed<string>(() => {
    const graphKey = this._graphService.graphKeySelected();
    const msg = GRAPH_DATA[graphKey];

    if (!this.activeGraph() && msg) {
      return msg;
    }

    return this.BASE_ERROR_MSG;
  });

  protected readonly availableYears = computed<AcademicYear[]>(() => {
    const courses = this.infoCds.value()?.courses;
    return courses ? (typedKeys(courses) as AcademicYear[]) : [];
  });

  private readonly _graphResolvers = GraphResolvers(
    this.infoCds,
    this.infoTeaching,
    this._graphService,
  );
  protected readonly activeGraph = computed<GraphView | null>(() => {
    const graphKey = this._graphService.graphKeySelected();
    return this._graphResolvers[graphKey]?.() || null;
  });

  private readonly _selectorResolvers = SelectorResolvers(this.infoCds, this.availableYears);
  protected readonly selectorOptions = computed<SelectOption[] | null>(() => {
    const graph = this.graphSelected.value();
    if (!graph?.value || graph.value === GraphSelection.CDS_GENERAL) {
      return null;
    }

    return this._selectorResolvers[graph.value]?.() ?? null;
  });

  protected readonly currentSelectorValue = computed<SelectOption | null>(() => {
    const opts = this.selectorOptions();
    if (!opts?.length) return null;

    const graphKey = this._graphService.graphKeySelected();
    if (graphKey === GraphSelection.YEAR || graphKey === GraphSelection.BOXPLOT) {
      const year = this._graphService.selectedYear();
      return year ? (opts.find((o) => o.value === year) ?? null) : null;
    }

    if (graphKey === GraphSelection.TEACHINGS_CDS) {
      const teaching = this._teachingService.selectedTeaching();
      if (teaching) {
        return opts.find((o) => o.value === teaching.id) ?? null;
      }
    }

    return null;
  });

  protected onSelectorChange(option: SelectOption): void {
    const graphKey = this._graphService.graphKeySelected();

    if (graphKey === GraphSelection.TEACHINGS_CDS) {
      const teaching = this.infoCds.value()?.teachings.find((t) => t.id === option.value) ?? null;
      this._teachingService.selectedTeaching.set(teaching);
    }
    if (graphKey === GraphSelection.YEAR || graphKey === GraphSelection.BOXPLOT) {
      this._graphService.selectedYear.set(option.value as AcademicYear);
    }
  }

  protected selectVIndex(index: 0 | 1 | 2): void {
    this._graphService.selectedVIndex.set(index);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._graphService.teachingSearch.set(value);
  }

  private resetTeachingGraph(): EffectRef {
    return effect(() => {
      const graphKey = this._graphService.graphKeySelected();
      this.minHeight.set(0);
      if (graphKey !== 'teaching_cds') {
        this._teachingService.selectedTeaching.set(null);
      }
      if (graphKey !== 'cds_year') {
        this._graphService.selectedYear.set(null);
        this._graphService.selectedVIndex.set(0);
        this._graphService.teachingSearch.set('');
      }
    });
  }

  private trackMinHeight(): EffectRef {
    return effect(() => {
      const el = this._graphDescrRef()?.nativeElement;
      if (!el) return;

      const observer = new ResizeObserver(([entry]) => {
        const h = entry.contentRect.height;
        if (h > this.minHeight()) this.minHeight.set(h);
      });

      observer.observe(el);
      return () => observer.disconnect();
    });
  }
}
