import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Department } from './department';

describe('Dipartimento', () => {
  let component: Department;
  let fixture: ComponentFixture<Department>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Department],
    }).compileComponents();

    fixture = TestBed.createComponent(Department);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[DEPARTMENT]: created', () => expect(component).toBeTruthy());
});
