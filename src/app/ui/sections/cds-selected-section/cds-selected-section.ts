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

  private readonly _graphResolvers = GraphResolvers(this.infoCds, this.infoTeaching);
  protected readonly activeGraph = computed<GraphView | null>(() => {
    const graphKey = this._graphService.graphKeySelected();
    return this._graphResolvers[graphKey]?.() || null;
  });

  private readonly _selectorResolvers = SelectorResolvers(this.infoCds, this.availableYears);
  protected readonly selectorOptions = computed<SelectOption[] | null>(() => {
    const graph = this.graphSelected.value();
    if (!graph?.value || graph.value === GraphSelection.CDS_GENERAL) return null;

    return this._selectorResolvers[graph.value]?.() ?? null;
  });

  // TODO: enhancement
  protected onSelectorChange(option: SelectOption): void {
    const graphKey = this._graphService.graphKeySelected();

    if (graphKey === 'teaching_cds') {
      const teaching = this.infoCds.value()?.teachings.find((t) => t.id === option.value) ?? null;
      this._teachingService.selectedTeaching.set(teaching);
    }
    // if (graphKey === 'cds_year') {
    //   this._graphService.selectedYear.set(option.value as AcademicYear);
    // }
  }

  private resetTeachingGraph(): EffectRef {
    return effect(() => {
      if (this._graphService.graphKeySelected() !== 'teaching_cds') {
        this._teachingService.selectedTeaching.set(null);
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
