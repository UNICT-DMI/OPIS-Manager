import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  ResourceStatus,
} from '@angular/core';
import { Graph } from '@components/graph/graph';
import { Icon } from '@components/icon/icon';
import { Loader } from '@components/loader/loader';
import { CdsService } from '@services/cds/cds.service';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [Icon, Loader, Graph],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);
  protected readonly ERR_STATUS: ResourceStatus = 'error';

  protected readonly cds = computed(() => this._cdsService.cdsSelected());
  protected readonly infoCds = this._cdsService.getInfoCds();

  constructor() {
    effect(() =>console.log(this.infoCds.value()));
    
  }
}
