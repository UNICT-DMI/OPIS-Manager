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