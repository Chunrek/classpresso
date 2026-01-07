/**
 * Hash Tests
 */

import { describe, it, expect } from 'vitest';
import { generateHashName, resolveCollisions } from '../src/utils/hash.js';

describe('generateHashName', () => {
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
