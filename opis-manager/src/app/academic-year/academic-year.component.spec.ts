import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValueDetailsComponent } from '../value-details/value-details.component';
import { AcademicYearComponent } from './academic-year.component';

describe('AcademicYearComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AcademicYearComponent,
        ValueDetailsComponent,
      ],
      imports: [
        FontAwesomeModule,
        FormsModule,
        NgbModule,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(AcademicYearComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
