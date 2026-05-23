import { describe, it, expect } from 'vitest';
import { boxplotStats, mean, round, std, variance } from './statistics.utils';

describe('mean', () => {
  it('should return 0 for empty array', () => expect(mean([])).toBe(0));
  it('should return the value itself for single element', () => expect(mean([5])).toBe(5));
  it('should compute the mean correctly', () => expect(mean([1, 2, 3, 4, 5])).toBe(3));
  it('should handle negative values', () => expect(mean([-1, -2, -3])).toBe(-2));
});

describe('variance', () => {
  it('should return 0 for empty array', () => expect(variance([])).toBe(0));
  it('should return 0 for single element', () => expect(variance([5])).toBe(0));
  it('should compute variance correctly', () => expect(variance([2, 4, 4, 4, 5, 5, 7, 9])).toBe(4));
  it('should return 0 when all values are equal', () => expect(variance([3, 3, 3])).toBe(0));
});

describe('std', () => {
  it('should return 0 for empty array', () => expect(std([])).toBe(0));
  it('should return 0 when all values are equal', () => expect(std([3, 3, 3])).toBe(0));
  it('should compute std correctly', () => expect(std([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2));
});

describe('round', () => {
  it('should round to 2 decimal places by default', () => expect(round(1.2345)).toBe(1.23));
  it('should round to specified decimal places', () => expect(round(1.2345, 3)).toBe(1.235));
  it('should round to 0 decimal places', () => expect(round(1.6, 0)).toBe(2));
  it('should handle negative values', () => expect(round(-1.2345)).toBe(-1.23));
  it('should handle already rounded values', () => expect(round(1.23)).toBe(1.23));
});

describe('boxplotStats', () => {
  it('should return zeros for empty array', () => {
    expect(boxplotStats([])).toEqual({ min: 0, q1: 0, median: 0, mean: 0, q3: 0, max: 0 });
  });

  it('should return the value itself for a single element', () => {
    expect(boxplotStats([5])).toEqual({ min: 5, q1: 5, median: 5, mean: 5, q3: 5, max: 5 });
  });

  it('should return the same value for all-equal array', () => {
    expect(boxplotStats([3, 3, 3, 3])).toEqual({ min: 3, q1: 3, median: 3, mean: 3, q3: 3, max: 3 });
  });

  it('should compute stats correctly for a simple sorted array', () => {
    // [1,2,3,4,5]: Q1=arr[1]=2, median=arr[2]=3, Q3=arr[3]=4 (integer positions)
    expect(boxplotStats([1, 2, 3, 4, 5])).toEqual({ min: 1, q1: 2, median: 3, mean: 3, q3: 4, max: 5 });
  });

  it('should sort unsorted input before computing', () => {
    expect(boxplotStats([5, 3, 1, 4, 2])).toEqual(boxplotStats([1, 2, 3, 4, 5]));
  });

  it('should interpolate quantiles when positions are fractional (Type 7)', () => {
    // [1,2,4,8]: Q1 = 1+0.75*(2-1)=1.75, median = 2+0.5*(4-2)=3, Q3 = 4+0.25*(8-4)=5
    expect(boxplotStats([1, 2, 4, 8])).toEqual({ min: 1, q1: 1.75, median: 3, mean: 3.75, q3: 5, max: 8 });
  });

  it('should set min/max to whisker bounds, excluding extreme outliers', () => {
    // [1,6,7,8,9,10,100]: Q1=6.5, Q3=9.5, IQR=3, fenceLo=2, fenceHi=14
    // → 1 e 100 sono outlier; min=6, max=10
    expect(boxplotStats([1, 6, 7, 8, 9, 10, 100])).toEqual({
      min: 6,
      q1: 6.5,
      median: 8,
      mean: 20.14,
      q3: 9.5,
      max: 10,
    });
  });

  it('should not round intermediate quantiles (rounding corrupts IQR and fences)', () => {
    // [6, 6.26, 8.36]: Q1 = 6+0.5*(6.26-6) = 6.13 — no intermediate rounding needed here,
    // but this case validates the match with the external library's Type7 output.
    expect(boxplotStats([6, 6.26, 8.36])).toEqual({
      min: 6,
      q1: 6.13,
      median: 6.26,
      mean: 6.87,
      q3: 7.31,
      max: 8.36,
    });
  });
});
