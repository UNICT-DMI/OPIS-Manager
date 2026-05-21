import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsService } from '@services/departments/departments.service';
import { describe, expect, it } from 'vitest';
import { HomePageComponent } from './home';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const mockResource = {
    isLoading: () => false,
    hasValue: () => true,
    value: () => [],
    error: () => null,
  };
  const mockDepartmentService = {
    getDepartmentByYear: () => mockResource,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [{ provide: DepartmentsService, useValue: mockDepartmentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('[HOME]: Created', () => expect(component).toBeTruthy());
});
