/**
 * Hash Tests
 */

import { describe, it, expect } from 'vitest';
import {
  generateHashName,
  resolveCollisions,
  generateSequentialName,
  generateSequentialNames,
  calculateMinHashLength,
} from '../src/utils/hash.js';

describe('generateSequentialName', () => {
  it('generates single character names for first 36 indices', () => {
    expect(generateSequentialName(0, 'cp-')).toBe('cp-a');
    expect(generateSequentialName(1, 'cp-')).toBe('cp-b');
    expect(generateSequentialName(25, 'cp-')).toBe('cp-z');
    expect(generateSequentialName(26, 'cp-')).toBe('cp-0');
    expect(generateSequentialName(35, 'cp-')).toBe('cp-9');
  });

  it('generates two character names after first 36', () => {
    expect(generateSequentialName(36, 'cp-')).toBe('cp-aa');
    expect(generateSequentialName(37, 'cp-')).toBe('cp-ab');
    expect(generateSequentialName(71, 'cp-')).toBe('cp-a9');
    expect(generateSequentialName(72, 'cp-')).toBe('cp-ba');
  });

  it('uses custom prefix', () => {
    expect(generateSequentialName(0, 'x-')).toBe('x-a');
    expect(generateSequentialName(0, '')).toBe('a');
  });
});

describe('generateSequentialNames', () => {
  it('generates correct number of names', () => {
    const names = generateSequentialNames(5, 'cp-');
    expect(names).toHaveLength(5);
    expect(names).toEqual(['cp-a', 'cp-b', 'cp-c', 'cp-d', 'cp-e']);
  });

  it('handles zero count', () => {
    const names = generateSequentialNames(0, 'cp-');
    expect(names).toHaveLength(0);
  });
});

describe('calculateMinHashLength', () => {
  it('returns 1 for small counts', () => {
    expect(calculateMinHashLength(1)).toBe(1);
    expect(calculateMinHashLength(10)).toBe(1);
    expect(calculateMinHashLength(36)).toBe(2); // 36 needs 2 chars
  });

  it('returns 2 for medium counts', () => {
    expect(calculateMinHashLength(100)).toBe(2);
    expect(calculateMinHashLength(1000)).toBe(2);
  });

  it('returns 3 for large counts', () => {
    expect(calculateMinHashLength(2000)).toBe(3);
    expect(calculateMinHashLength(10000)).toBe(3);
  });

  it('handles edge cases', () => {
    expect(calculateMinHashLength(0)).toBe(1);
    expect(calculateMinHashLength(-1)).toBe(1);
  });
});

describe('generateHashName (legacy)', () => {
  it('generates consistent hash for same input', () => {
    const hash1 = generateHashName('flex items-center gap-2');
    const hash2 = generateHashName('flex items-center gap-2');
    expect(hash1).toBe(hash2);
  });

  it('generates different hash for different input', () => {
    const hash1 = generateHashName('flex items-center gap-2');
    const hash2 = generateHashName('flex items-center gap-4');
    expect(hash1).not.toBe(hash2);
  });

  it('uses custom prefix', () => {
    const hash = generateHashName('flex', 'custom-');
    expect(hash.startsWith('custom-')).toBe(true);
  });

  it('respects hash length', () => {
    const hash = generateHashName('flex', 'cp-', 8);
    expect(hash).toBe('cp-' + hash.substring(3)); // prefix + 8 chars
    expect(hash.length).toBe(11); // 3 prefix + 8 hash
  });
});

describe('resolveCollisions', () => {
  it('keeps unique hashes unchanged', () => {
    const candidates = [
      { hashName: 'cp-abc12', normalizedKey: 'flex gap-2' },
      { hashName: 'cp-def34', normalizedKey: 'flex gap-4' },
    ];
    const resolved = resolveCollisions(candidates);
    expect(resolved[0].hashName).toBe('cp-abc12');
    expect(resolved[1].hashName).toBe('cp-def34');
  });

  it('resolves collisions by appending suffix', () => {
    const candidates = [
      { hashName: 'cp-abc12', normalizedKey: 'flex gap-2' },
      { hashName: 'cp-abc12', normalizedKey: 'flex gap-4' }, // collision
    ];
    const resolved = resolveCollisions(candidates);
    expect(resolved[0].hashName).toBe('cp-abc12');
    expect(resolved[1].hashName).toBe('cp-abc121');
  });

  it('allows same hash for same content', () => {
    const candidates = [
      { hashName: 'cp-abc12', normalizedKey: 'flex gap-2' },
      { hashName: 'cp-abc12', normalizedKey: 'flex gap-2' }, // same content, not collision
    ];
    const resolved = resolveCollisions(candidates);
    expect(resolved[0].hashName).toBe('cp-abc12');
    expect(resolved[1].hashName).toBe('cp-abc12');
  });
});
