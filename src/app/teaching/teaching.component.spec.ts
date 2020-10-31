import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'angular2-chartjs';
import { ValueDetailsComponent } from '../value-details/value-details.component';
import { TeachingComponent } from './teaching.component';

/* Mock NgSliderComponent */
// tslint:disable-next-line: component-selector
@Component({selector: 'ngx-slider', template: ''})
export class NgSliderStubComponent {
    @Input() value;
    @Input() highValue;
    @Input() options;
    @Input() manualRefresh;
    @Output() valueChange =  new EventEmitter<any>();
}

describe('TeachingComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeachingComponent,
        NgSliderStubComponent,
        ValueDetailsComponent,
      ],
      imports: [
        FontAwesomeModule,
        HttpClientTestingModule,
        FormsModule,
        ChartModule,
        NgbModule,
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(TeachingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
