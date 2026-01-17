import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { exampleCDS } from '@mocks/cds-mock';
import { exampleDepartment } from '@mocks/department-mock';
import { CdsService } from '@services/cds/cds.service';
import { DepartmentsService } from '@services/departments/departments.service';
import { NO_CHOICE_CDS } from '@values/no-choice-cds';
import { describe, expect, it } from 'vitest';
import { DepartmentPageComponent } from './department';

describe('Dipartimento', () => {
  let component: DepartmentPageComponent;
  let fixture: ComponentFixture<DepartmentPageComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDepartmentsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCdsService: any;

  const mockDepartment = exampleDepartment;
  const mockCDS = exampleCDS;

  beforeEach(async () => {
    const mockResource = {
      isLoading: () => false,
      hasValue: () => true,
      value: () => [],
      error: () => null,
      status: () => 'success',
    };

    mockDepartmentsService = {
      getCdsDepartment: vi.fn(() => mockResource),
    };
    mockCdsService = {
      cdsSelected: signal(NO_CHOICE_CDS),
      getInfoCds: vi.fn(() => mockResource),
    };

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockDepartment));
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(vi.fn());

    await TestBed.configureTestingModule({
      imports: [DepartmentPageComponent],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
        { provide: CdsService, useValue: mockCdsService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[DEPARTMENT]: created', () => expect(component).toBeTruthy());

  it('should initialize departmentData from localStorage', () => {
    component.ngOnInit();
    expect(component['department']()).toEqual(mockDepartment);
  });

  it('should throw if no department in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
    expect(() => component.ngOnInit()).toThrow(
      'Impossibile recuperare le info del dipartimento selezionato',
    );
  });

  it('should update isCdsSelected when cds changes', async () => {
    component['selectCds'](mockCDS);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['isCdsSelected']).toBe(true);
    expect(mockCdsService.cdsSelected()).toEqual(mockCDS);
  });

  it('should reset cdsSelected and remove localStorage on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('department');
    expect(mockCdsService.cdsSelected()).toEqual(NO_CHOICE_CDS);
  });
});
