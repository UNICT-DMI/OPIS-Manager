import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dipartimento } from './dipartimento';

describe('Dipartimento', () => {
  let component: Dipartimento;
  let fixture: ComponentFixture<Dipartimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dipartimento],
    }).compileComponents();

    fixture = TestBed.createComponent(Dipartimento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
