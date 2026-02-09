import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ResourceStatus,
} from '@angular/core';
import { CdsService } from '@services/cds/cds.service';
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
  protected readonly ERR_STATUS: ResourceStatus = 'error';

  protected readonly cds = computed(() => this._cdsService.cdsSelected());
  protected readonly infoCds = this._cdsService.getInfoCds();
}
