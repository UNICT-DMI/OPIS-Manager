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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GraphSelection } from '@enums/chart-typology.enum';
import { GraphView, SelectOption } from '@interfaces/graph-config.interface';
import { YearRangeSelection } from '@interfaces/year-range.interface';
import { YearStats } from '@sections/year-stats/year-stats';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { Graph } from '@shared-ui/graph/graph';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';
import { SelectComponent } from '@shared-ui/select/select';
import { YearRange } from '@shared-ui/year-range/year-range';
import { typedKeys } from '@utils/object-helpers.utils';
import { GraphResolvers, SelectorResolvers } from '@values/graph-resolvers/graph-resolvers.value';
import { GRAPH_DATA } from '@values/messages.value';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';
import { debounceTime, distinctUntilChanged, filter, map, Subject } from 'rxjs';

/** Quiet window (ms) after the last resize before the graph is considered fully rendered. */
const GRAPH_SETTLE_MS = 200;

@Component({
  selector: 'opis-cds-selected-section',
  imports: [IconComponent, Loader, Graph, SelectComponent, YearStats, YearRange],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);
  private readonly _graphService = inject(GraphService);
  private readonly _teachingService = inject(TeachingService);
  private readonly _analytics = inject(AnalyticsService);

  private readonly _searchTracking$ = new Subject<string>();

  private readonly _graphDescrRef = viewChild<ElementRef>('graphDesc');

  protected readonly minHeight = signal(0);
  protected readonly showStats = signal(false);

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
    this.trackTeachingSearch();
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

  protected readonly rangeYears = computed<AcademicYear[]>(() => {
    const graphKey = this._graphService.graphKeySelected();

    let years: AcademicYear[] = [];
    if (graphKey === GraphSelection.CDS_GENERAL) {
      const courses = this.infoCds.value()?.courses;
      years = courses ? (typedKeys(courses) as AcademicYear[]) : [];
    } else if (graphKey === GraphSelection.TEACHINGS_CDS) {
      const teachingMeans = this.infoTeaching.value();
      years = teachingMeans ? (typedKeys(teachingMeans) as AcademicYear[]) : [];
    }

    return [...years].sort((a, b) => ACADEMIC_YEARS.indexOf(a) - ACADEMIC_YEARS.indexOf(b));
  });

  protected onRangeChange(range: YearRangeSelection): void {
    this._graphService.yearRange.set({
      startYear: range.startYear as AcademicYear,
      endYear: range.endYear as AcademicYear,
    });
  }

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
      this._graphService.yearRange.set(null);
      this._analytics.trackEvent('select_teaching', {
        teaching_id: option.value,
        teaching_name: option.label,
      });
    }
    if (graphKey === GraphSelection.YEAR || graphKey === GraphSelection.BOXPLOT) {
      this._graphService.selectedYear.set(option.value as AcademicYear);
      this._analytics.trackEvent('select_year', {
        academic_year: String(option.value),
        context: 'per_anno',
      });
    }
  }

  protected selectVIndex(index: 0 | 1 | 2): void {
    this._graphService.selectedVIndex.set(index);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._graphService.teachingSearch.set(value);
    this._searchTracking$.next(value);
  }

  private trackTeachingSearch(): void {
    this._searchTracking$
      .pipe(
        debounceTime(600),
        map((term) => term.trim()),
        distinctUntilChanged(),
        filter((term) => term.length > 0),
        takeUntilDestroyed(),
      )
      .subscribe((term) => this._analytics.trackEvent('search_teaching', { search_term: term }));
  }

  protected toggleStats(): void {
    this.showStats.update((v) => !v);
  }

  private resetTeachingGraph(): EffectRef {
    return effect(() => {
      const graphKey = this._graphService.graphKeySelected();
      this.minHeight.set(0);
      this._graphService.yearRange.set(null);
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
    return effect((onCleanup) => {
      const el = this._graphDescrRef()?.nativeElement;
      if (!el) return;

      let settleTimer: ReturnType<typeof setTimeout> | undefined;

      const observer = new ResizeObserver(([entry]) => {
        const height = entry.contentRect.height;
        // Record the height only once the element has stopped resizing, i.e. the
        // graph has finished loading/rendering. Measuring mid-render would lock in
        // a transient overshoot that ends up taller than the settled graph.
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          if (height > this.minHeight()) this.minHeight.set(height);
        }, GRAPH_SETTLE_MS);
      });

      observer.observe(el);

      onCleanup(() => {
        clearTimeout(settleTimer);
        observer.disconnect();
      });
    });
  }
}
