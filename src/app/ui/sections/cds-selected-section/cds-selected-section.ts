import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ResourceStatus,
} from '@angular/core';
import { GraphSelection, GraphSelectionType } from '@enums/chart-typology.enum';
import { GraphView, SelectOption } from '@interfaces/graph-config.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { Graph } from '@shared-ui/graph/graph';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';
import { typedKeys } from '@utils/object-helpers.utils';
import { GRAPH_DATA } from '@values/messages.value';
import { AcademicYear } from '@values/years';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [IconComponent, Loader, Graph],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);
  private readonly _graphService = inject(GraphService);
  private readonly _teachingService = inject(TeachingService);

  protected readonly ERR_STATUS: ResourceStatus = 'error';
  protected readonly BASE_ERROR_MSG = 'Dati non disponibili :/';

  protected readonly cds = computed(this._cdsService.cdsSelected);

  protected readonly infoCds = this._cdsService.getInfoCds();
  protected readonly graphSelected = this._graphService.manageGraphSelection();
  protected readonly infoTeaching = this._teachingService.getTeachingGraph();
  
  protected readonly isAllInfoLoading = computed<boolean>(
    () => this.infoCds.isLoading() ||
    this.graphSelected.isLoading() ||
    this.infoTeaching.isLoading()
  );

  protected readonly msgError = computed<string>(() => {
    const graphKey = this._graphService.graphKeySelected();
    const msg = GRAPH_DATA[graphKey];

    if (!this.activeGraph() && msg) {
      return msg;
    }

    return this.BASE_ERROR_MSG;
  });

  protected readonly availableYears = computed<AcademicYear[]>(() => {
    const coarse = this.infoCds.value()?.coarse;
    return coarse ? (typedKeys(coarse) as AcademicYear[]) : [];
  });

  protected readonly activeGraph = computed<GraphView | null>(() => {
    const graphKey = this._graphService.graphKeySelected();

    switch (graphKey) {
      case 'cds_general':
        const dataCds = this.infoCds.value();
        if (!dataCds) return null;
        return GraphMapper.toCdsGeneralGraph(dataCds.coarse);

      case 'teaching_cds':
        const dataTeaching = this.infoTeaching.value();
        if (!dataTeaching) return null;

        return GraphMapper.toTeachingGraph(dataTeaching);

      case 'cds_year':
        return null;

      default:
        return null;
    }
  });

  protected readonly selectorOptions = computed<SelectOption[] | null>(() => {
    const graph = this.graphSelected.value();
    if (!graph?.value || graph.value === GraphSelection.CDS_GENERAL) return null;

    const resolvers: Record<Exclude<GraphSelectionType, 'cds_general'>, () => SelectOption[]> = {
      teaching_cds: () =>
        this.infoCds.value()?.teachings.map((t) => ({ value: t.id, label: t.nome })) ?? [],
      cds_year: () =>
        this.availableYears().map((y) => ({ value: y, label: y })),
    };

    return resolvers[graph.value]?.() ?? null;
  });


  protected onSelectorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const inputType = this.graphSelected.value()?.value;

    if (inputType === 'teaching_cds') {
      const teaching = this.infoCds.value()?.teachings.find((t) => t.id === +value) ?? null;
      this._teachingService.selectedTeaching.set(teaching);
    }
    // if (inputType === 'year') {
    //   this._graphService.selectedYear.set(value as AcademicYear);
    // }
  }
}
