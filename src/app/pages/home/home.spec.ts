import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsService } from '@services/departments/departments.service';
import { describe, expect, it } from 'vitest';
import { HomePageComponent } from './home';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const mockResource = {
    isLoading: (): boolean => false,
    hasValue: (): boolean => true,
    value: (): unknown[] => [],
    error: (): null => null,
  };
  const mockDepartmentService = {
    getDepartmentByYear: (): typeof mockResource => mockResource,
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
