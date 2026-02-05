export function typedKeys<
  const T extends Record<PropertyKey, unknown>
>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}