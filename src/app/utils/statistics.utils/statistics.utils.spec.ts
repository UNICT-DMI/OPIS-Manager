import { describe, it, expect } from 'vitest';
import { mean, round, std, variance } from './statistics.utils';

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