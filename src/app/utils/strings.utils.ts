export function slug(value: string) {
  return value.toLowerCase().replace(/\s+/g, '_');
}