import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, ResourceStatus } from '@angular/core';
import { Icon } from '@components/icon/icon';
import { Loader } from '@components/loader/loader';
import { CDS } from '@interfaces/cds.interface';
import { CdsService } from '@services/cds/cds.service';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [Icon, Loader, JsonPipe],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
})
export class CdsSelectedSection {
  private readonly _cdsService = inject(CdsService);

  public ERR_STATUS: ResourceStatus = "error";

  public cds = computed(() => this._cdsService.cdsSelected());
  
  public infoCds = this._cdsService.getInfoCds();
}
