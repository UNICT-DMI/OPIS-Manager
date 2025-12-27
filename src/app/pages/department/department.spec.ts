import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { DepartmentPage } from './department';
import { DepartmentsService } from '@services/departments.service';
import { CdsService } from '@services/cds.service';
import { signal } from '@angular/core';
import { NO_CHOICE_CDS } from '@values/no-choice-cds';
import { exampleCDS } from '@mocks/cds-mock';
import { provideRouter } from '@angular/router';
import { exampleDepartment } from '@mocks/department-mock';

describe('Dipartimento', () => {
  let component: DepartmentPage;
  let fixture: ComponentFixture<DepartmentPage>;
  let mockDepartmentsService: any;
  let mockCdsService: any;

  const mockDepartment = exampleDepartment;
  const mockCDS = exampleCDS;

  beforeEach(async () => {
    const mockResource = {
      isLoading: () => false,
      hasValue: () => true,
      value: () => [],
      error: () => null,
    };

    mockDepartmentsService = {
      getCdsDepartment: vi.fn(() => mockResource),
    };
    mockCdsService = {
      cdsSelected: signal(NO_CHOICE_CDS),
    };

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockDepartment));
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(vi.fn());
    
    await TestBed.configureTestingModule({
      imports: [DepartmentPage],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
        { provide: CdsService, useValue: mockCdsService },
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[DEPARTMENT]: created', () => expect(component).toBeTruthy());

  it('should initialize departmentData from localStorage', () => {
    component.ngOnInit();
    expect(component.department()).toEqual(mockDepartment);
  });

  it('should throw if no department in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
    expect(() => component.ngOnInit()).toThrow(
      'Impossibile recuperare le info del dipartimento selezionato'
    );
  });

  it('should update isCdsSelected when cds changes', async () => {
    component.selectCds(mockCDS);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isCdsSelected).toBe(true);
    expect(mockCdsService.cdsSelected()).toEqual(mockCDS);
  });

  it('should reset cdsSelected and remove localStorage on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('department');
    expect(mockCdsService.cdsSelected()).toEqual(NO_CHOICE_CDS);
  });
});
