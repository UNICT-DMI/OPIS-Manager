import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CDS } from '@interfaces/cds.interface';

@Component({
  selector: 'opis-cds-selected-section',
  imports: [JsonPipe],
  templateUrl: './cds-selected-section.html',
  styleUrl: './cds-selected-section.scss',
})
export class CdsSelectedSection {
  public cds = input.required<CDS>();
}
