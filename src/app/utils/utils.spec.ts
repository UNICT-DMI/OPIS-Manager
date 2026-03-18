import { describe, it, expect } from 'vitest';
import { typedKeys } from './object-helpers.utils';
import { slug } from './strings.utils';

describe('typedKeys', () => {
  it('should return keys of an object', () => expect(typedKeys({ a: 1, b: 2 })).toEqual(['a', 'b']));
  it('should return empty array for empty object', () => expect(typedKeys({})).toEqual([]));
  it('should preserve key types', () => expect(typedKeys({ foo: 1, bar: 2 })).toContain('foo'));
});

describe('slug', () => {
  it('should lowercase the string', () => expect(slug('Hello')).toBe('hello'));
  it('should replace spaces with underscores', () => expect(slug('hello world')).toBe('hello_world'));
  it('should handle multiple spaces', () => expect(slug('hello   world')).toBe('hello_world'));
  it('should handle already slugified string', () => expect(slug('hello_world')).toBe('hello_world'));
});