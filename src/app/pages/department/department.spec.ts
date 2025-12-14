import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentPage } from './department';

describe('Dipartimento', () => {
  let component: DepartmentPage;
  let fixture: ComponentFixture<DepartmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[DEPARTMENT]: created', () => expect(component).toBeTruthy());
});
