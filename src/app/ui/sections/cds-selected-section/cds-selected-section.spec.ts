import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceStatus } from '@angular/core';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CdsSelectedSection } from './cds-selected-section';
import { CdsService } from '@services/cds/cds.service';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { exampleCDS } from '@mocks/cds-mock';
import { Graph } from '@shared-ui/graph/graph';
import { SelectComponent } from '@shared-ui/select/select';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';

// ─── Mock componenti ──────────────────────────────────────────────────────────
@Component({ selector: 'opis-graph', standalone: true, template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class MockGraph { }

@Component({ selector: 'opis-select', standalone: true, template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class MockSelect { }

@Component({ selector: 'opis-icon', standalone: true, template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class MockIcon { }

@Component({ selector: 'opis-loader', standalone: true, template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class MockLoader { }

// ─── Mock resource factory ────────────────────────────────────────────────────
const mockResource = (overrides = {}) => ({
  status: signal<ResourceStatus>('idle'),
  isLoading: signal(false),
  hasValue: signal(false),
  value: signal(null),
  error: signal(null),
  refresh: vi.fn(),
  ...overrides,
});

// ─── Mock services ────────────────────────────────────────────────────────────
const buildMockCdsService = () => ({
  cdsSelected: signal(exampleCDS),
  getInfoCds: mockResource(),
  isLoading: signal(false),
});

const buildMockGraphService = () => ({
  graphKeySelected: signal('cds_general'),
  graphBtns: signal([]),
  manageGraphSelection: mockResource({
    hasValue: signal(true),
    value: signal({ value: 'cds_general', label: 'Generale', description: 'Desc', active: true }),
  }),
});

const buildMockTeachingService = () => ({
  selectedTeaching: signal(null),
  getTeachingGraph: vi.fn(() => mockResource()),
});

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
        remove: { imports: [Graph, SelectComponent, IconComponent, Loader] },
        add: { imports: [MockGraph, MockSelect, MockIcon, MockLoader] },
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
    expect(fixture.nativeElement.querySelector('.cds-selection_wrap').classList).toContain('loading');
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
    expect(fixture.nativeElement.querySelector('.graph-description_left h2')?.textContent?.trim()).toBe('Generale');
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

    mockTeachingService.selectedTeaching.set({ id: 1 } as any);
    mockGraphService.graphKeySelected.set('cds_general');
    await fixture.whenStable();

    expect(mockTeachingService.selectedTeaching()).toBeNull();
  });

  it('[CDS-SECTION]: should not reset selectedTeaching when graphKey is teaching_cds', () => {
    const teaching = { id: 1 } as any;
    mockTeachingService.selectedTeaching.set(teaching);
    mockGraphService.graphKeySelected.set('teaching_cds');
    expect(mockTeachingService.selectedTeaching()).toEqual(teaching);
  });

  // ── onSelectorChange ──────────────────────────────────────────────────────
  it('[CDS-SECTION]: should set selectedTeaching on selector change when graphKey is teaching_cds', () => {
    const teaching = { id: 42, nome: 'Matematica', canale: 'A' };
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockCdsService.getInfoCds.value.set({ teachings: [teaching], coarse: {} } as any);

    component['onSelectorChange']({ value: 42, label: 'Matematica (Canale A)' });

    expect(mockTeachingService.selectedTeaching()).toEqual(teaching);
  });

  it('[CDS-SECTION]: should set selectedTeaching to null if teaching not found', () => {
    mockGraphService.graphKeySelected.set('teaching_cds');
    mockCdsService.getInfoCds.value.set({ teachings: [], coarse: {} } as any);

    component['onSelectorChange']({ value: 99, label: 'Non esiste' });

    expect(mockTeachingService.selectedTeaching()).toBeNull();
  });
});