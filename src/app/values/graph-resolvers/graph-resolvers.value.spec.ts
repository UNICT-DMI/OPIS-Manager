import { signal } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { GraphResolvers, SelectorResolvers } from './graph-resolvers.value';
import { GraphMapper } from '@mappers/graph.mapper';

// ─── Mock factory ─────────────────────────────────────────────────────────────
const mockResource = (value: unknown = null) => ({
  value: signal(value),
});

// ─── GraphResolvers ───────────────────────────────────────────────────────────
describe('GraphResolvers', () => {
  it('cds_general: should return null when infoCds has no value', () => {
    const resolvers = GraphResolvers(mockResource() as any, mockResource() as any);
    expect(resolvers.cds_general()).toBeNull();
  });

  it('cds_general: should call GraphMapper.toCdsGeneralGraph when data is available', () => {
    vi.spyOn(GraphMapper, 'toCdsGeneralGraph').mockReturnValue({} as any);

    const courses = { '2023/2024': [] };
    const infoCds = mockResource({ teachings: [], courses });
    const resolvers = GraphResolvers(infoCds as any, mockResource() as any);

    resolvers.cds_general();

    expect(GraphMapper.toCdsGeneralGraph).toHaveBeenCalledWith(courses);
  });

  it('teaching_cds: should return null when infoTeaching has no value', () => {
    const resolvers = GraphResolvers(mockResource() as any, mockResource() as any);
    expect(resolvers.teaching_cds()).toBeNull();
  });

  it('teaching_cds: should call GraphMapper.toTeachingGraph when data is available', () => {
    vi.spyOn(GraphMapper, 'toTeachingGraph').mockReturnValue({} as any);

    const teachingData = { id: 1 };
    const resolvers = GraphResolvers(mockResource() as any, mockResource(teachingData) as any);

    resolvers.teaching_cds();

    expect(GraphMapper.toTeachingGraph).toHaveBeenCalledWith(teachingData);
  });

  it('cds_year: should throw not implemented error', () => {
    const resolvers = GraphResolvers(mockResource() as any, mockResource() as any);
    expect(resolvers.cds_year()).toBe(null);
  });
});

// ─── SelectorResolvers ────────────────────────────────────────────────────────
describe('SelectorResolvers', () => {
  it('teaching_cds: should return empty array when infoCds has no value', () => {
    const resolvers = SelectorResolvers(mockResource() as any, signal([]));
    expect(resolvers.teaching_cds()).toEqual([]);
  });

  it('teaching_cds: should map teachings to SelectOption[]', () => {
    const teachings = [
      { id: 1, nome: 'Matematica', canale: 'A - L' },
      { id: 2, nome: 'Fisica', canale: 'no' },
    ];
    const infoCds = mockResource({ teachings, courses: {} });
    const resolvers = SelectorResolvers(infoCds as any, signal([]));

    expect(resolvers.teaching_cds()).toEqual([
      { value: 1, label: 'Matematica (Canale A - L)' },
      { value: 2, label: 'Fisica (Canale no)' },
    ]);
  });

  it('cds_year: should return empty array when no years available', () => {
    const resolvers = SelectorResolvers(mockResource() as any, signal([]));
    expect(resolvers.cds_year()).toEqual([]);
  });

  it('cds_year: should map years to SelectOption[]', () => {
    const years = ['2022/2023', '2023/2024'] as any;
    const resolvers = SelectorResolvers(mockResource() as any, signal(years));

    expect(resolvers.cds_year()).toEqual([
      { value: '2022/2023', label: '2022/2023' },
      { value: '2023/2024', label: '2023/2024' },
    ]);
  });
});
