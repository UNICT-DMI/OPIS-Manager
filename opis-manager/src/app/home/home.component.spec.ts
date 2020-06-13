import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'angular2-chartjs';
import { ConfigService } from '../config.service';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

/* Mock NgSliderComponent */
// tslint:disable-next-line: component-selector
@Component({selector: 'ng5-slider', template: ''})
class NgSliderStubComponent {
    @Input() value;
    @Input() highValue;
    @Input() options;
    @Input() manualRefresh;
    @Output() valueChange =  new EventEmitter<any>();
}

describe('HomeComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgSliderStubComponent,
        HomeComponent,
      ],
      imports: [
        BrowserModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
        ChartModule,
        NgbModule,
      ],
      providers: [
        ConfigService,
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
