import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSection } from './year-section';

describe('YearSection', () => {
  let component: YearSection;
  let fixture: ComponentFixture<YearSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
