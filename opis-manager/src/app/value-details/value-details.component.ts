import { Component, Input } from '@angular/core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-value-details',
  templateUrl: './value-details.component.html',
  styleUrls: ['./value-details.component.scss']
})
export class ValueDetailsComponent {
  @Input() switcher: number;

  readonly faInfo = faInfo;
  v1Info = false;
  v2Info = false;
  v3Info = false;
}
