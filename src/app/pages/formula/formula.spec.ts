import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formula } from './formula';

describe('Formula', () => {
  let component: Formula;
  let fixture: ComponentFixture<Formula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formula],
    }).compileComponents();

    fixture = TestBed.createComponent(Formula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
