import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationSliderComponent } from './deviation-slider.component';

describe('DeviationSliderComponent', () => {
  let component: DeviationSliderComponent;
  let fixture: ComponentFixture<DeviationSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviationSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
