import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ResourceStatus,
} from '@angular/core';
import { GraphView } from '@interfaces/graph-config.interface';
import { GraphMapper } from '@mappers/graph.mapper';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { Graph } from '@shared-ui/graph/graph';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';

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

  protected readonly cds = computed(this._cdsService.cdsSelected);

  protected readonly infoCds = this._cdsService.getInfoCds();
  protected readonly graphSelected = this._graphService.manageGraphSelection();
  protected readonly infoTeaching = this._teachingService.getTeachingGraph();

  protected readonly activeGraph = computed<GraphView | null>(() => {
    const graphKey = this._graphService.graphKeySelected();

    switch (graphKey) {
      case 'cds_general':
        const dataCds = this.infoCds.value();
        if (!dataCds) return null;
        return GraphMapper.toCdsGeneralGraph(dataCds.coarse);

      case 'teaching_cds':
        return this.infoTeaching.value() ?? null;

      case 'cds_year':
        return null;

      default:
        return null;
    }
  });
}
