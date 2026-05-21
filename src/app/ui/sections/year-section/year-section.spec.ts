import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { YearSection } from './year-section';
import { DepartmentsService } from '@services/departments/departments.service';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

describe('YearSection', () => {
  let component: YearSection;
  let fixture: ComponentFixture<YearSection>;
  let mockDepartmentsService: {
    selectedYear: ReturnType<typeof signal<AcademicYear | null>>;
  };

  beforeEach(async () => {
    mockDepartmentsService = {
      selectedYear: signal<AcademicYear | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [YearSection],
      providers: [{ provide: DepartmentsService, useValue: mockDepartmentsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(YearSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[YEAR_SECTION]: Created', () => expect(component).toBeTruthy());

  it('[YEAR_SECTION]: selectYear updates departmentService.selectedYear for valid year', () => {
    const validYear = ACADEMIC_YEARS[0];
    component['selectYear'](validYear);
    expect(mockDepartmentsService.selectedYear()).toBe(validYear);
  });

  it('[YEAR_SECTION]: selectYear ignores invalid years', () => {
    component['selectYear']('1999/2000' as AcademicYear);
    expect(mockDepartmentsService.selectedYear()).toBeNull();
  });
});
