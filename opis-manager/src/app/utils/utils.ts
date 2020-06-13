export function round(v: number, padding = 2): number {
  const pad = parseInt(1 + '0'.repeat(padding), 2);
  return Math.round(v * pad) / pad;
}
