export function slug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '_');
}
