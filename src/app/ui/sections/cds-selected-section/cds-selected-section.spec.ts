import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ResourceStatus,
  WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CdsSelectedSection } from './cds-selected-section';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { exampleCDS } from '@mocks/cds-mock';
import { CDS } from '@interfaces/cds.interface';
import { Teaching } from '@interfaces/teaching.interface';
import { GraphSelectionBtn } from '@interfaces/graph-config.interface';
import { Graph } from '@shared-ui/graph/graph';
import { SelectComponent } from '@shared-ui/select/select';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';
import { YearRange } from '@shared-ui/year-range/year-range';

// ─── Mock componenti ──────────────────────────────────────────────────────────
@Component({
  selector: 'opis-graph',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockGraph {
  readonly dataChart = input<unknown>();
}

@Component({
  selector: 'opis-year-range',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockYearRange {
  readonly years = input<readonly string[]>();
  readonly rangeChange = output<unknown>();
}

@Component({
  selector: 'opis-select',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockSelect {}

@Component({
  selector: 'opis-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockIcon {}

@Component({
  selector: 'opis-loader',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockLoader {}

// ─── Mock resource factory ────────────────────────────────────────────────────
type MockResourceShape = {
  status: WritableSignal<ResourceStatus>;
  isLoading: WritableSignal<boolean>;
  hasValue: WritableSignal<boolean>;
  value: WritableSignal<unknown>;
  error: WritableSignal<unknown>;
  refresh: ReturnType<typeof vi.fn>;
};
const mockResource = (overrides: Partial<MockResourceShape> = {}): MockResourceShape => ({
  status: signal<ResourceStatus>('idle'),
  isLoading: signal(false),
  hasValue: signal(false),
  value: signal<unknown>(null),
  error: signal<unknown>(null),
  refresh: vi.fn(),
  ...overrides,
});

// ─── Mock services ────────────────────────────────────────────────────────────
const buildMockCdsService = (): {
  cdsSelected: WritableSignal<CDS>;
  getInfoCds: MockResourceShape;
  isLoading: WritableSignal<boolean>;
} => ({
  cdsSelected: signal(exampleCDS),
  getInfoCds: mockResource(),
  isLoading: signal(false),
});

const buildMockGraphService = (): {
  graphKeySelected: WritableSignal<string>;
  graphBtns: WritableSignal<never[]>;
  selectedYear: WritableSignal<string | null>;
  selectedVIndex: WritableSignal<number>;
  teachingSearch: WritableSignal<string>;
  yearRange: WritableSignal<unknown>;
  filterMeansByRange: ReturnType<typeof vi.fn>;
  manageGraphSelection: MockResourceShape;
} => ({
  graphKeySelected: signal('cds_general'),
  graphBtns: signal([]),
  selectedYear: signal<string | null>(null),
  selectedVIndex: signal(0),
  teachingSearch: signal(''),
  yearRange: signal<unknown>(null),
  filterMeansByRange: vi.fn((m) => m),
  manageGraphSelection: mockResource({
    hasValue: signal(true),
    value: signal<unknown>({
      value: 'cds_general',
      label: 'Generale',
      description: 'Desc',
      active: true,
      icon: '',
    } satisfies GraphSelectionBtn),
  }),
});

const buildMockTeachingService = (): {
  selectedTeaching: WritableSignal<Teaching | null>;
  teachingGraph: MockResourceShape;
  getTeachingGraph: ReturnType<typeof vi.fn>;
} => {
  const teachingGraph = mockResource();
  return {
    selectedTeaching: signal<Teaching | null>(null),
    teachingGraph,
    getTeachingGraph: vi.fn(() => teachingGraph),
  };
};

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('CdsSelectedSection', () => {
  let component: CdsSelectedSection;
  let fixture: ComponentFixture<CdsSelectedSection>;
  let mockCdsService: ReturnType<typeof buildMockCdsService>;
  let mockGraphService: ReturnType<typeof buildMockGraphService>;
  let mockTeachingService: ReturnType<typeof buildMockTeachingService>;

  beforeEach(async () => {
    window.ResizeObserver = vi.fn().mockImplementation(function () {
      return { observe: vi.fn(), disconnect: vi.fn() };
    });

    mockCdsService = buildMockCdsService();
    mockGraphService = buildMockGraphService();
    mockTeachingService = buildMockTeachingService();

    await TestBed.configureTestingModule({
      imports: [CdsSelectedSection],
      providers: [
        { provide: CdsService, useValue: mockCdsService },
        { provide: GraphService, useValue: mockGraphService },
        { provide: TeachingService, useValue: mockTeachingService },
      ],
    })
      .overrideComponent(CdsSelectedSection, {
        remove: { imports: [Graph, SelectComponent, IconComponent, Loader, YearRange] },
        add: { imports: [MockGraph, MockSelect, MockIcon, MockLoader, MockYearRange] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CdsSelectedSection);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  it('[CDS-SECTION]: should create', () => expect(component).toBeTruthy());

  it('[CDS-SECTION]: should read cds without throwing', () => {
    expect(component['cds']()).toEqual(exampleCDS);
  });

  // ── Loading ───────────────────────────────────────────────────────────────
  it('[CDS-SECTION]: should show loader when isAllInfoLoading is true', async () => {
    mockCdsService.isLoading.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('opis-loader')).toBeTruthy();
  });

  it('[CDS-SECTION]: should hide content when loading', async () => {
    mockCdsService.isLoading.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.graph-description')).toBeNull();
  });

  it('[CDS-SECTION]: should show content when not loading', async () => {
    mockCdsService.getInfoCds.hasValue.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.graph-description')).toBeTruthy();
  });

  it('[CDS-SECTION]: should add "loading" class to section when loading', async () => {
    mockCdsService.isLoading.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.cds-selection_wrap').classList).toContain(
      'loading',
    );
  });

  // ── Error state ───────────────────────────────────────────────────────────
  it('[CDS-SECTION]: should show error block when infoCds has error status', async () => {
    mockCdsService.getInfoCds.status.set('error' as ResourceStatus);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
  });

  it('[CDS-SECTION]: should show error block when graphSelected has error status', async () => {
    mockGraphService.manageGraphSelection.status.set('error' as ResourceStatus);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
  });

  // ── Graph description ─────────────────────────────────────────────────────
  it('[CDS-SECTION]: should render graph label and description when data is available', async () => {
    mockCdsService.getInfoCds.hasValue.set(true);
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('.graph-description_top h2')?.textContent?.trim(),
    ).toBe('Generale');
  });

  it('[CDS-SECTION]: should not render opis-select when selectorOptions is null', async () => {
    mockCdsService.getInfoCds.hasValue.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('opis-select')).toBeNull();
  });

  // ── Teaching reset ────────────────────────────────────────────────────────
  it('[CDS-SECTION]: should reset selectedTeaching when graphKey changes to non teaching_cds', async () => {
    mockGraphService.graphKeySelected.set('teaching_cds');
    await fixture.whenStable();

    mockTeachingService.selectedTeaching.set({ id: 1 } as unknown as Teaching);
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();

    expect(mockTeachingService.selectedTeaching()).toBeNull();
  });

  it('[CDS-SECTION]: should not reset selectedTeaching when graphKey is teaching_cds', () => {
    const teaching = { id: 1 } as unknown as Teaching;
    mockTeachingService.selectedTeaching.set(teaching);
    mockGraphService.graphKeySelected.set('teaching_cds');
    expect(mockTeachingService.selectedTeaching()).toEqual(teaching);
  });

  // ── onSelectorChange ──────────────────────────────────────────────────────
  it('[CDS-SECTION]: should set selectedTeaching on selector change when graphKey is teaching_cds', () => {
    const teaching = { id: 42, nome: 'Matematica', canale: 'A' };
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockCdsService.getInfoCds.value.set({ teachings: [teaching], courses: {} });

    component['onSelectorChange']({ value: 42, label: 'Matematica (Canale A)' });

    expect(mockTeachingService.selectedTeaching()).toEqual(teaching);
  });

  it('[CDS-SECTION]: should set selectedTeaching to null if teaching not found', () => {
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockCdsService.getInfoCds.value.set({ teachings: [], courses: {} });

    component['onSelectorChange']({ value: 99, label: 'Non esiste' });

    expect(mockTeachingService.selectedTeaching()).toBeNull();
  });

  it('[CDS-SECTION]: should set selectedYear when graphKey is cds_year', () => {
    mockGraphService.graphKeySelected.set('cds_year');
    component['onSelectorChange']({ value: '2023/2024', label: '2023/2024' });
    expect(mockGraphService.selectedYear()).toBe('2023/2024');
  });

  it('[CDS-SECTION]: selectVIndex should set selectedVIndex', () => {
    component['selectVIndex'](2);
    expect(mockGraphService.selectedVIndex()).toBe(2);
  });

  it('[CDS-SECTION]: onSearchInput should set teachingSearch', () => {
    component['onSearchInput']({ target: { value: 'math' } } as unknown as InputEvent);
    expect(mockGraphService.teachingSearch()).toBe('math');
  });

  it('[CDS-SECTION]: availableYears returns empty array when no courses', () => {
    mockCdsService.getInfoCds.value.set(null);
    expect(component['availableYears']()).toEqual([]);
  });

  it('[CDS-SECTION]: availableYears returns keys when courses exist', () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2022/2023': [], '2023/2024': [] },
    });
    expect(component['availableYears']()).toEqual(['2022/2023', '2023/2024']);
  });

  it('[CDS-SECTION]: selectorOptions returns null when graph is cds_general', async () => {
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();
    expect(component['selectorOptions']()).toBeNull();
  });

  it('[CDS-SECTION]: msgError returns BASE_ERROR_MSG when activeGraph is truthy', () => {
    const msg = component['msgError']();
    expect(typeof msg).toBe('string');
  });

  // ── currentSelectorValue ──────────────────────────────────────────────────
  it('[CDS-SECTION]: currentSelectorValue returns null when there are no options', () => {
    expect(component['currentSelectorValue']()).toBeNull();
  });

  it('[CDS-SECTION]: currentSelectorValue returns matching year option in cds_year view', async () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2022/2023': [], '2023/2024': [] },
    });
    mockGraphService.graphKeySelected.set('cds_year');
    mockGraphService.manageGraphSelection.value.set({
      value: 'cds_year',
      label: 'Per anno',
      description: '',
      active: true,
    });
    mockGraphService.selectedYear.set('2023/2024');
    await fixture.whenStable();

    expect(component['currentSelectorValue']()).toEqual({
      value: '2023/2024',
      label: '2023/2024',
    });
  });

  it('[CDS-SECTION]: currentSelectorValue returns null when selected year not in options', async () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2022/2023': [] },
    });
    mockGraphService.graphKeySelected.set('cds_year');
    mockGraphService.manageGraphSelection.value.set({
      value: 'cds_year',
      label: 'Per anno',
      description: '',
      active: true,
    });
    mockGraphService.selectedYear.set('1999/2000');
    await fixture.whenStable();

    expect(component['currentSelectorValue']()).toBeNull();
  });

  it('[CDS-SECTION]: currentSelectorValue returns matching teaching option in teaching_cds view', async () => {
    const teaching = { id: 7, nome: 'Algebra', canale: 'no' };
    mockCdsService.getInfoCds.value.set({
      teachings: [teaching],
      courses: {},
    });
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockGraphService.manageGraphSelection.value.set({
      value: 'teaching_cds',
      label: 'Per insegnamento',
      description: '',
      active: true,
    });
    mockTeachingService.selectedTeaching.set(teaching as unknown as Teaching);
    await fixture.whenStable();

    expect(component['currentSelectorValue']()).toEqual({ value: 7, label: 'Algebra' });
  });

  it('[CDS-SECTION]: currentSelectorValue returns null when no teaching is selected in teaching_cds view', async () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [{ id: 1, nome: 'X', canale: 'no' }],
      courses: {},
    });
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockGraphService.manageGraphSelection.value.set({
      value: 'teaching_cds',
      label: 'Per insegnamento',
      description: '',
      active: true,
    });
    mockTeachingService.selectedTeaching.set(null);
    await fixture.whenStable();

    expect(component['currentSelectorValue']()).toBeNull();
  });

  // ── year-range slider ─────────────────────────────────────────────────────
  it('[CDS-SECTION]: rangeYears is empty for graphs other than Generale/Corsi', async () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2022/2023': [], '2023/2024': [] },
    });
    mockGraphService.graphKeySelected.set('cds_year');
    await fixture.whenStable();
    expect(component['rangeYears']()).toEqual([]);
  });

  it('[CDS-SECTION]: rangeYears returns sorted course years for Generale', async () => {
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2023/2024': [], '2020/2021': [] },
    });
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();
    expect(component['rangeYears']()).toEqual(['2020/2021', '2023/2024']);
  });

  it('[CDS-SECTION]: rangeYears returns teaching means years for Corsi', async () => {
    mockTeachingService.teachingGraph.value.set({ '2024/2025': [], '2021/2022': [] });
    mockGraphService.graphKeySelected.set('teaching_cds');
    await fixture.whenStable();
    expect(component['rangeYears']()).toEqual(['2021/2022', '2024/2025']);
  });

  it('[CDS-SECTION]: onRangeChange sets the graph service yearRange', () => {
    component['onRangeChange']({
      startIndex: 1,
      endIndex: 2,
      startYear: '2015/2016',
      endYear: '2016/2017',
    });
    expect(mockGraphService.yearRange()).toEqual({
      startYear: '2015/2016',
      endYear: '2016/2017',
    });
  });

  it('[CDS-SECTION]: resets yearRange when the graph type changes', async () => {
    mockGraphService.yearRange.set({ startYear: '2015/2016', endYear: '2016/2017' });
    mockGraphService.graphKeySelected.set('teaching_cds');
    await fixture.whenStable();
    expect(mockGraphService.yearRange()).toBeNull();
  });

  it('[CDS-SECTION]: resets yearRange when a different teaching is selected', () => {
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockCdsService.getInfoCds.value.set({ teachings: [{ id: 1, nome: 'X', canale: 'no' }], courses: {} });
    mockGraphService.yearRange.set({ startYear: '2015/2016', endYear: '2016/2017' });

    component['onSelectorChange']({ value: 1, label: 'X' });

    expect(mockGraphService.yearRange()).toBeNull();
  });

  it('[CDS-SECTION]: renders opis-year-range for Generale when more than one year', async () => {
    const means = [[1, 2, 3], [[], [], []]];
    mockCdsService.getInfoCds.hasValue.set(true);
    mockCdsService.getInfoCds.value.set({
      teachings: [],
      courses: { '2022/2023': means, '2023/2024': means },
    });
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('opis-year-range')).toBeTruthy();
  });

  it('[CDS-SECTION]: does not render opis-year-range with a single year', async () => {
    const means = [[1, 2, 3], [[], [], []]];
    mockCdsService.getInfoCds.hasValue.set(true);
    mockCdsService.getInfoCds.value.set({ teachings: [], courses: { '2023/2024': means } });
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('opis-year-range')).toBeNull();
  });
});
