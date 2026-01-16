import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, ResourceStatus } from '@angular/core';
import { Icon } from '@components/icon/icon';
import { Loader } from '@components/loader/loader';
import { CdsService } from '@services/cds/cds.service';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [Icon, Loader, JsonPipe],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);
  protected readonly ERR_STATUS: ResourceStatus = 'error';

  protected cds = computed(() => this._cdsService.cdsSelected());
  protected infoCds = this._cdsService.getInfoCds();
}
