import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { exampleCDS } from '@mocks/cds-mock';
import { exampleDepartment } from '@mocks/department-mock';
import { CdsService } from '@services/cds/cds.service';
import { DepartmentsService } from '@services/departments/departments.service';
import { GraphService } from '@services/graph/graph.service';
import { QuestionService } from '@services/questions/questions.service';
import { CdsSelectedSection } from '@sections/cds-selected-section/cds-selected-section';
import { Disclaimers } from '@cards/disclaimer/disclaimers';
import { NO_CHOICE_CDS } from '@values/no-choice-cds';
import { describe, expect, it, vi } from 'vitest';
import { DepartmentPageComponent } from './department';
import { of } from 'rxjs';
import { Component, input, signal } from '@angular/core';

@Component({ selector: 'opis-cds-selected-section', template: '', standalone: true })
class MockCdsSelectedSection { }

@Component({ selector: 'opis-disclaimers', template: '', standalone: true })
class MockDisclaimers {
  readonly disclaimers = input<unknown[]>([]);
}

describe('DepartmentPageComponent', () => {
  let component: DepartmentPageComponent;
  let fixture: ComponentFixture<DepartmentPageComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCdsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGraphService: any;

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

    const mockDepartmentsService = {
      getCdsDepartment: vi.fn(() => mockResource),
    };

    mockCdsService = {
      cdsSelected: signal(NO_CHOICE_CDS),
      getInfoCds: vi.fn(() => mockResource),
    };

    mockGraphService = {
      graphKeySelected: signal('cds_general'),
      graphBtns: vi.fn(() => []),
      manageGraphSelection: vi.fn(() => mockResource),
    };

    const mockQuestionService = {
      loadQuestionsWeights: vi.fn(() => of(null)),
    };

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockDepartment));
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(vi.fn());

    await TestBed.configureTestingModule({
      imports: [DepartmentPageComponent],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
        { provide: CdsService, useValue: mockCdsService },
        { provide: GraphService, useValue: mockGraphService },
        { provide: QuestionService, useValue: mockQuestionService },
        provideRouter([]),
      ],
    })
      .overrideComponent(DepartmentPageComponent, {
        remove: { imports: [CdsSelectedSection, Disclaimers] },
        add: { imports: [MockCdsSelectedSection, MockDisclaimers] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ── Init ────────────────────────────────────────────────────────────────────
  it('[DEPARTMENT]: created', () => expect(component).toBeTruthy());

  it('[DEPARTMENT]: should initialize department from localStorage on ngOnInit', () => {
    component.ngOnInit();
    expect(component['department']()).toEqual(mockDepartment);
  });

  it('[DEPARTMENT]: should throw if no department found in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
    expect(() => component.ngOnInit()).toThrow(
      'Impossibile recuperare le info del dipartimento selezionato',
    );
  });

  // ── CDS selection ───────────────────────────────────────────────────────────
  it('[DEPARTMENT]: should set isCdsSelected to true when a CDS is selected', async () => {
    component['selectCds'](mockCDS);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['isCdsSelected']()).toBe(true);
    expect(mockCdsService.cdsSelected()).toEqual(mockCDS);
  });

  it('[DEPARTMENT]: should set isCdsSelected to false when NO_CHOICE_VALUE is selected', async () => {
    mockCdsService.cdsSelected.set(mockCDS);
    component['selectCds'](NO_CHOICE_CDS);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['isCdsSelected']()).toBe(false);
  });

  it('[DEPARTMENT]: should reset graphKey to "cds_general" when deselecting a CDS', () => {
    component['selectCds'](NO_CHOICE_CDS);
    expect(mockGraphService.graphKeySelected()).toBe('cds_general');
  });

  // ── Graph selection ─────────────────────────────────────────────────────────
  it('[DEPARTMENT]: should update graphKeySelected on selectGraphType', () => {
    component['selectGraphType']('teaching_cds');
    expect(mockGraphService.graphKeySelected()).toBe('teaching_cds');
  });

  it('[DEPARTMENT]: should update graphKeySelected to "cds_year"', () => {
    component['selectGraphType']('cds_year');
    expect(mockGraphService.graphKeySelected()).toBe('cds_year');
  });

  // ── Destroy ─────────────────────────────────────────────────────────────────
  it('[DEPARTMENT]: should remove "department" from localStorage on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('department');
  });

  it('[DEPARTMENT]: should reset cdsSelected to NO_CHOICE_VALUE on ngOnDestroy', () => {
    mockCdsService.cdsSelected.set(mockCDS);
    component.ngOnDestroy();
    expect(mockCdsService.cdsSelected()).toEqual(NO_CHOICE_CDS);
  });
});