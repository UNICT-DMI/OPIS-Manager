import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AcademicYearComponent } from '../academic-year/academic-year.component';
import { ConfigService } from '../config.service';
import { TeachingComponent } from '../teaching/teaching.component';
import { NgSliderStubComponent } from '../teaching/teaching.component.spec';
import { ValueDetailsComponent } from '../value-details/value-details.component';
import { HomeComponent } from './home.component';
import { CdsComponent } from '../cds/cds.component';

describe('HomeComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ValueDetailsComponent,
        TeachingComponent,
        AcademicYearComponent,
        ValueDetailsComponent,
        NgSliderStubComponent, // TODO: move this mocked component in a "utils" file
        CdsComponent,
      ],
      imports: [
        BrowserModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
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
