import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { exampleCDS } from '@mocks/cds-mock';
import { exampleDepartment } from '@mocks/department-mock';
import { CdsService } from '@services/cds/cds.service';
import { DepartmentsService } from '@services/departments/departments.service';
import { GraphService } from '@services/graph/graph.service';
import { QuestionService } from '@services/questions/questions.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { CdsSelectedSection } from '@sections/cds-selected-section/cds-selected-section';
import { Disclaimers } from '@cards/disclaimer/disclaimers';
import { NO_CHOICE_CDS } from '@values/no-choice-cds';
import { describe, expect, it, vi } from 'vitest';
import { DepartmentPageComponent } from './department';
import { of } from 'rxjs';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'opis-cds-selected-section',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockCdsSelectedSection {}

@Component({
  selector: 'opis-disclaimers',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
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
      currentDepartment: signal(null),
    };

    mockCdsService = {
      cdsSelected: signal(NO_CHOICE_CDS),
      getInfoCds: mockResource,
      isLoading: signal(false),
    };

    mockGraphService = {
      graphKeySelected: signal('cds_general'),
      graphBtns: signal([]),
      manageGraphSelection: vi.fn(() => mockResource),
      selectedYear: signal(null),
      selectedVIndex: signal(0),
      teachingSearch: signal(''),
    };

    const mockQuestionService = {
      loadQuestionsWeights: vi.fn(() => of(null)),
    };

    const mockTeachingService = {
      selectedTeaching: signal(null),
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
        { provide: TeachingService, useValue: mockTeachingService },
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

  it('[DEPARTMENT]: should reset graphKey to "cds_year" when deselecting a CDS', () => {
    component['selectCds'](NO_CHOICE_CDS);
    expect(mockGraphService.graphKeySelected()).toBe('cds_year');
  });

  it('[DEPARTMENT]: should update graphKeySelected on selectGraphType', () => {
    component['selectGraphType']('teaching_cds');
    expect(mockGraphService.graphKeySelected()).toBe('teaching_cds');
  });

  it('[DEPARTMENT]: should update graphKeySelected to "cds_year"', () => {
    component['selectGraphType']('cds_year');
    expect(mockGraphService.graphKeySelected()).toBe('cds_year');
  });

  it('[DEPARTMENT]: should remove "department" from localStorage on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('department');
  });

  it('[DEPARTMENT]: should reset cdsSelected to NO_CHOICE_VALUE on ngOnDestroy', () => {
    mockCdsService.cdsSelected.set(mockCDS);
    component.ngOnDestroy();
    expect(mockCdsService.cdsSelected()).toEqual(NO_CHOICE_CDS);
  });

  it('[DEPARTMENT]: should reflect cdsService.isLoading', () => {
    expect(component['isLoading']()).toBe(false);
  });

  it('[DEPARTMENT]: should reflect graphService.graphBtns', () => {
    const btns = [{ value: 'cds_general', label: 'Generale', active: true, icon: 'bar_chart' }];
    mockGraphService.graphBtns.set(btns);
    fixture.detectChanges();
    expect(component['graphBtns']()).toEqual(btns);
  });

  it('[DEPARTMENT]: should NOT reset graphKey when selecting a valid CDS', () => {
    mockGraphService.graphKeySelected.set('teaching_cds');
    component['selectCds'](mockCDS);
    expect(mockGraphService.graphKeySelected()).toBe('teaching_cds');
  });

  it('[DEPARTMENT]: should return NO_CHOICE_VALUE when no CDS is selected', () => {
    expect(component['cds']()).toEqual(NO_CHOICE_CDS);
  });

  it('[DEPARTMENT]: should return false for isCdsSelected when no CDS is selected', () => {
    expect(component['isCdsSelected']()).toBe(false);
  });

  it('[DEPARTMENT]: should return null for department before ngOnInit', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
    const freshFixture = TestBed.createComponent(DepartmentPageComponent);
    expect(freshFixture.componentInstance['department']()).toBeNull();
  });
});

// ─── Route restoration & sync ────────────────────────────────────────────────
describe('DepartmentPageComponent route handling', () => {
  const buildSetup = (queryParams: Record<string, string>, cdsListValue: any[] = []) => {
    const cdsListResource = {
      isLoading: () => false,
      hasValue: () => true,
      value: signal(cdsListValue),
      error: () => null,
      status: () => 'success',
    };
    const infoCdsResource = {
      isLoading: () => false,
      hasValue: () => true,
      value: signal<any>(null),
      error: () => null,
      status: () => 'success',
    };

    const mockDepartmentsService = {
      getCdsDepartment: vi.fn(() => cdsListResource),
      currentDepartment: signal(null),
    };
    const mockCdsService = {
      cdsSelected: signal<any>(NO_CHOICE_CDS),
      getInfoCds: infoCdsResource,
      isLoading: signal(false),
    };
    const mockGraphService = {
      graphKeySelected: signal<string>('cds_general'),
      graphBtns: signal([]),
      manageGraphSelection: vi.fn(() => infoCdsResource),
      selectedYear: signal<string | null>(null),
      selectedVIndex: signal(0),
      teachingSearch: signal(''),
    };
    const mockQuestionService = { loadQuestionsWeights: vi.fn(() => of(null)) };
    const mockTeachingService = { selectedTeaching: signal<any>(null) };

    const mockRouter = { navigate: vi.fn(() => Promise.resolve(true)) };
    const mockRoute = {
      snapshot: {
        queryParamMap: { get: (key: string) => queryParams[key] ?? null },
      },
    };

    vi.restoreAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(exampleDepartment));
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => undefined);

    return {
      cdsListResource,
      infoCdsResource,
      mockDepartmentsService,
      mockCdsService,
      mockGraphService,
      mockQuestionService,
      mockTeachingService,
      mockRouter,
      mockRoute,
    };
  };

  const createFixture = (deps: ReturnType<typeof buildSetup>) =>
    TestBed.configureTestingModule({
      imports: [DepartmentPageComponent],
      providers: [
        { provide: DepartmentsService, useValue: deps.mockDepartmentsService },
        { provide: CdsService, useValue: deps.mockCdsService },
        { provide: GraphService, useValue: deps.mockGraphService },
        { provide: QuestionService, useValue: deps.mockQuestionService },
        { provide: TeachingService, useValue: deps.mockTeachingService },
        { provide: Router, useValue: deps.mockRouter },
        { provide: ActivatedRoute, useValue: deps.mockRoute },
      ],
    })
      .overrideComponent(DepartmentPageComponent, {
        remove: { imports: [CdsSelectedSection, Disclaimers] },
        add: { imports: [MockCdsSelectedSection, MockDisclaimers] },
      })
      .compileComponents()
      .then(() => TestBed.createComponent(DepartmentPageComponent));

  it('[DEPARTMENT-ROUTE]: should restore view from query params', async () => {
    const deps = buildSetup({ view: 'teaching_cds' });
    await createFixture(deps);
    expect(deps.mockGraphService.graphKeySelected()).toBe('teaching_cds');
  });

  it('[DEPARTMENT-ROUTE]: should ignore invalid view query param', async () => {
    const deps = buildSetup({ view: 'invalid_view' });
    await createFixture(deps);
    expect(deps.mockGraphService.graphKeySelected()).toBe('cds_general');
  });

  it('[DEPARTMENT-ROUTE]: should restore year from query params', async () => {
    const deps = buildSetup({ year: '2023/2024' });
    await createFixture(deps);
    expect(deps.mockGraphService.selectedYear()).toBe('2023/2024');
  });

  it('[DEPARTMENT-ROUTE]: should ignore unknown year query param', async () => {
    const deps = buildSetup({ year: '1999/2000' });
    await createFixture(deps);
    expect(deps.mockGraphService.selectedYear()).toBeNull();
  });

  it('[DEPARTMENT-ROUTE]: should restore search from query params', async () => {
    const deps = buildSetup({ search: 'algebra' });
    await createFixture(deps);
    expect(deps.mockGraphService.teachingSearch()).toBe('algebra');
  });

  it('[DEPARTMENT-ROUTE]: should set pending teaching id from query params', async () => {
    const deps = buildSetup({ teaching: '42' });
    const fixture = await createFixture(deps);
    expect(fixture.componentInstance['_pendingTeachingId']()).toBe(42);
  });

  it('[DEPARTMENT-ROUTE]: should ignore non-numeric teaching query param', async () => {
    const deps = buildSetup({ teaching: 'not-a-number' });
    const fixture = await createFixture(deps);
    expect(fixture.componentInstance['_pendingTeachingId']()).toBeNull();
  });

  it('[DEPARTMENT-ROUTE]: should restore CDS from cds query param when list loads', async () => {
    const list = [exampleCDS];
    const deps = buildSetup({ cds: String(exampleCDS.id) }, list);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(deps.mockCdsService.cdsSelected().id).toBe(exampleCDS.id);
  });

  it('[DEPARTMENT-ROUTE]: should leave CDS unchanged when query param id is not in list', async () => {
    const deps = buildSetup({ cds: '999' }, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(deps.mockCdsService.cdsSelected()).toEqual(NO_CHOICE_CDS);
  });

  it('[DEPARTMENT-ROUTE]: syncRouteWithState should call router.navigate with null params when no CDS', async () => {
    const deps = buildSetup({}, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(deps.mockRouter.navigate).toHaveBeenCalled();
    const lastCall: any = deps.mockRouter.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]?.queryParams).toMatchObject({ cds: null, view: null });
  });

  it('[DEPARTMENT-ROUTE]: syncRouteWithState should include cds and view when CDS is selected', async () => {
    const deps = buildSetup({}, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    deps.mockCdsService.cdsSelected.set(exampleCDS);
    fixture.detectChanges();
    await fixture.whenStable();

    const lastCall: any = deps.mockRouter.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]?.queryParams).toMatchObject({
      cds: String(exampleCDS.id),
      view: 'cds_general',
    });
  });

  it('[DEPARTMENT-ROUTE]: syncRouteWithState should include year and search for cds_year view', async () => {
    const deps = buildSetup({}, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    deps.mockCdsService.cdsSelected.set(exampleCDS);
    deps.mockGraphService.graphKeySelected.set('cds_year');
    deps.mockGraphService.selectedYear.set('2023/2024');
    deps.mockGraphService.teachingSearch.set('algebra');
    fixture.detectChanges();
    await fixture.whenStable();

    const lastCall: any = deps.mockRouter.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]?.queryParams).toMatchObject({
      year: '2023/2024',
      search: 'algebra',
    });
  });

  it('[DEPARTMENT-ROUTE]: syncRouteWithState should include teaching for teaching_cds view', async () => {
    const deps = buildSetup({}, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    deps.mockCdsService.cdsSelected.set(exampleCDS);
    deps.mockGraphService.graphKeySelected.set('teaching_cds');
    deps.mockTeachingService.selectedTeaching.set({ id: 7 });
    fixture.detectChanges();
    await fixture.whenStable();

    const lastCall: any = deps.mockRouter.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]?.queryParams).toMatchObject({ teaching: '7' });
  });

  it('[DEPARTMENT-ROUTE]: syncRouteWithState should use pendingTeaching when teaching not yet loaded', async () => {
    const deps = buildSetup({ teaching: '99' }, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    deps.mockCdsService.cdsSelected.set(exampleCDS);
    deps.mockGraphService.graphKeySelected.set('teaching_cds');
    fixture.detectChanges();
    await fixture.whenStable();

    const lastCall: any = deps.mockRouter.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]?.queryParams).toMatchObject({ teaching: '99' });
  });

  it('[DEPARTMENT-ROUTE]: applyPendingTeaching should set selectedTeaching when info loads', async () => {
    const deps = buildSetup({ teaching: '5' }, [exampleCDS]);
    const fixture = await createFixture(deps);
    fixture.detectChanges();
    await fixture.whenStable();

    const teaching = { id: 5, nome: 'X' };
    (deps.infoCdsResource.value as any).set({ teachings: [teaching], courses: {} });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(deps.mockTeachingService.selectedTeaching()).toEqual(teaching);
  });
});
