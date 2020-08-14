import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Options } from 'ng5-slider';
import { CDS } from '../api.model';

@Component({
  selector: 'app-deviation-slider',
  templateUrl: './deviation-slider.component.html',
  styleUrls: ['./deviation-slider.component.scss']
})
export class DeviationSliderComponent implements OnInit, OnChanges {

  @Input() cds: CDS;

  public meanDeviation: number;
  public numerosityDeviation: number;

  public meanSliderOptions: Options = {
    floor: 1,
    ceil: 10,
    step: 0.5,
    minLimit: 0.5,
    maxLimit: 10,
    showTicks: true,
  };

  public numerositySliderOptions: Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    minLimit: 5,
    maxLimit: 100,
    showTicks: true,
  };

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.meanDeviation = changes.cds.currentValue.scostamento_media;
    this.numerosityDeviation = changes.cds.currentValue.scostamento_numerosita;
  }

}
