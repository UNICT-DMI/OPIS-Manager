import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsService } from '@services/departments/departments.service';
import { describe, expect, it } from 'vitest';
import { HomePageComponent } from './home';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const canStartUserFlow = signal(false);
  const mockResource = {
    isLoading: () => false,
    hasValue: () => true,
    value: () => [],
    error: () => null,
  };
  const mockDepartmentService = {
    canStartUserFlow,
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

  it('[HOME]: should reflect canStartUserFlow', () => {
    canStartUserFlow.set(true);
    expect(component['canShowDepartments']()).toBe(true);

    canStartUserFlow.set(false);
    expect(component['canShowDepartments']()).toBe(false);
  });

  it('[HOME]: reset canStartUserFlow on Destroy', () => {
    canStartUserFlow.set(true);
    component.ngOnDestroy();
    expect(canStartUserFlow()).toBe(false);
  });
});
