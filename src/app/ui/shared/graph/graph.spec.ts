import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';

import { Graph } from './graph';
import { OpisGroup } from '@enums/opis-group.enum';
import { GraphView } from '@interfaces/graph-config.interface';
import { ChartDataset, ChartType } from 'chart.js';

const makeDataset = (label: string): ChartDataset => ({ label, data: [1, 2, 3] });

const makeGraphView = (...labels: string[]): GraphView => ({
  type: 'line' as ChartType,
  data: { labels: [], datasets: labels.map(makeDataset) },
});

describe('Graph', () => {
  let fixture: ComponentFixture<Graph>;
  let component: Graph;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graph],
      providers: [provideZonelessChangeDetection()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Graph);
    component = fixture.componentInstance;
  });

  const init = (view: GraphView): void => {
    fixture.componentRef.setInput('dataChart', view);
    component.ngOnInit();
  };

  it('[GRAPH]: should create', () => {
    fixture.componentRef.setInput('dataChart', makeGraphView());
    expect(component).toBeTruthy();
  });

  it('[GRAPH]: chartOptions has beginAtZero on y axis', () => {
    fixture.componentRef.setInput('dataChart', makeGraphView());
    expect(component['chartOptions']?.scales?.['y']).toMatchObject({ beginAtZero: true });
  });

  it('[GRAPH]: chartOptions has legend display true', () => {
    fixture.componentRef.setInput('dataChart', makeGraphView());
    expect(component['chartOptions']?.plugins?.legend?.display).toBe(true);
  });

  it('[ADD_BRAND_COLOR]: unknown label, dataset is returned unchanged', () => {
    const view = makeGraphView('unknown-label');
    init(view);
    const ds = component.dataChart().data.datasets[0];
    expect(ds.borderColor).toBeUndefined();
    expect(ds.backgroundColor).toBeUndefined();
  });

  it('[ADD_BRAND_COLOR]: mix of known and unknown labels, only known gets colors', () => {
    const view = makeGraphView(OpisGroup.Group1, 'other');
    init(view);
    const [known, unknown] = component.dataChart().data.datasets;
    expect(known.borderColor).toBeDefined();
    expect(unknown.borderColor).toBeUndefined();
  });

  it('[ADD_BRAND_COLOR]: original dataset properties are preserved', () => {
    const view = makeGraphView(OpisGroup.Group1);
    init(view);
    expect(component.dataChart().data.datasets[0].data).toEqual([1, 2, 3]);
  });

  it('[HEX_TO_RGBA]: correctly converts hex to rgba', () => {
    const result = component['hexToRgba']('#1e3a5f', 0.6);
    expect(result).toBe('rgba(30, 58, 95, 0.6)');
  });

  it('[IS_OPIS_GROUP]: V1, V2, V3 are valid OpisGroupType', () => {
    [OpisGroup.Group1, OpisGroup.Group2, OpisGroup.Group3].forEach((v) =>
      expect(component['isOpisGroup'](v)).toBe(true),
    );
  });

  it('[IS_OPIS_GROUP]: arbitrary string is not a valid OpisGroupType', () => {
    expect(component['isOpisGroup']('not-a-group')).toBe(false);
  });
});
