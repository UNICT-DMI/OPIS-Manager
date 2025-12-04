import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAnimated } from './logo-animated';

describe('LogoAnimated', () => {
  let component: LogoAnimated;
  let fixture: ComponentFixture<LogoAnimated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoAnimated],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoAnimated);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
