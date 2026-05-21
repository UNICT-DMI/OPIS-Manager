export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function variance(values: number[]): number {
  if (values.length === 0) return 0;

  const m = mean(values);
  return values.reduce((s, v) => s + Math.pow(v - m, 2), 0) / values.length;
}

export function std(values: number[]): number {
  return Math.sqrt(variance(values));
}

export function round(v: number, padding = 2): number {
  const pad = parseInt(1 + '0'.repeat(padding), 10);
  return Math.round(v * pad) / pad;
}

function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const pos = p * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return round(sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo));
}

export function boxplotStats(values: number[]): {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
} {
  if (values.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const fenceLo = q1 - 1.5 * iqr;
  const fenceHi = q3 + 1.5 * iqr;
  const inliers = sorted.filter((v) => v >= fenceLo && v <= fenceHi);

  return {
    min: round(inliers[0] ?? sorted[0]),
    q1,
    median,
    q3,
    max: round(inliers[inliers.length - 1] ?? sorted[sorted.length - 1]),
    outliers: sorted.filter((v) => v < fenceLo || v > fenceHi).map((v) => round(v)),
  };
}
