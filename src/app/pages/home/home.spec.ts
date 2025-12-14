import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Home } from './home';
import { DepartmentsService } from '@services/departments.service';
import { signal } from '@angular/core';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const canStartUserFlow = signal(false);
  const mockResource = {
    isLoading: () => false,
    hasValue: () => true,
    value: () => [],
    error: () => null
  };
  const mockDepartmentService = {
    canStartUserFlow,
    getDepartmentByYear: () => mockResource
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('[HOME]: Created', () => expect(component).toBeTruthy());

  it('[HOME]: should reflect canStartUserFlow', () => {
    canStartUserFlow.set(true);
    expect(component.canShowDepartments()).toBe(true);

    canStartUserFlow.set(false);
    expect(component.canShowDepartments()).toBe(false);
  });

  it('[HOME]: reset canStartUserFlow on Destroy', () => {
    canStartUserFlow.set(true);
    component.ngOnDestroy();
    expect(canStartUserFlow()).toBe(false);
  })
});
