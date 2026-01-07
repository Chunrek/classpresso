/**
 * Scanner Tests
 */

import { describe, it, expect } from 'vitest';
import {
  shouldExcludeClass,
  normalizeClassString,
  extractClassStrings,
} from '../src/core/scanner.js';
import type { ExcludeConfig } from '../src/types/index.js';

describe('shouldExcludeClass', () => {
  const exclude: ExcludeConfig = {
    prefixes: ['js-', 'data-'],
    suffixes: ['-handler', '-trigger'],
    classes: ['no-consolidate'],
    patterns: [/^qa-/, /^test-/],
  };

  it('excludes classes with matching prefix', () => {
    expect(shouldExcludeClass('js-onclick', exclude)).toBe(true);
    expect(shouldExcludeClass('data-testid', exclude)).toBe(true);
  });

  it('excludes classes with matching suffix', () => {
    expect(shouldExcludeClass('click-handler', exclude)).toBe(true);
    expect(shouldExcludeClass('modal-trigger', exclude)).toBe(true);
  });

  it('excludes exact class matches', () => {
    expect(shouldExcludeClass('no-consolidate', exclude)).toBe(true);
  });

  it('excludes classes matching regex patterns', () => {
    expect(shouldExcludeClass('qa-button', exclude)).toBe(true);
    expect(shouldExcludeClass('test-component', exclude)).toBe(true);
  });

  it('includes classes that do not match any exclusion', () => {
    expect(shouldExcludeClass('flex', exclude)).toBe(false);
    expect(shouldExcludeClass('text-lg', exclude)).toBe(false);
    expect(shouldExcludeClass('bg-gold', exclude)).toBe(false);
  });
});

describe('normalizeClassString', () => {
  const exclude: ExcludeConfig = {
    prefixes: ['js-'],
    suffixes: [],
    classes: [],
    patterns: [],
  };

  it('splits and sorts classes', () => {
    const result = normalizeClassString('flex gap-2 items-center', exclude);
    expect(result.normalized).toBe('flex gap-2 items-center');
    expect(result.classes).toEqual(['flex', 'gap-2', 'items-center']);
  });

  it('separates excluded classes', () => {
    const result = normalizeClassString('flex js-click gap-2', exclude);
    expect(result.classes).toEqual(['flex', 'gap-2']);
    expect(result.excludedClasses).toEqual(['js-click']);
  });

  it('handles multiple spaces', () => {
    const result = normalizeClassString('flex  gap-2   items-center', exclude);
    expect(result.classes).toHaveLength(3);
  });
});

describe('extractClassStrings', () => {
  it('extracts className from JSX double quotes', () => {
    const content = '<div className="flex gap-2">test</div>';
    const result = extractClassStrings(content, 'test.tsx');
    expect(result).toHaveLength(1);
    expect(result[0].classString).toBe('flex gap-2');
  });

  it('extracts className from JSX single quotes', () => {
    const content = "<div className='flex gap-2'>test</div>";
    const result = extractClassStrings(content, 'test.tsx');
    expect(result).toHaveLength(1);
    expect(result[0].classString).toBe('flex gap-2');
  });

  it('extracts class from HTML', () => {
    const content = '<div class="flex gap-2">test</div>';
    const result = extractClassStrings(content, 'test.html');
    expect(result).toHaveLength(1);
    expect(result[0].classString).toBe('flex gap-2');
  });

  it('skips dynamic class expressions', () => {
    const content = 'className={`flex ${isActive ? "active" : ""}`}';
    const result = extractClassStrings(content, 'test.tsx');
    expect(result).toHaveLength(0);
  });

  it('extracts multiple classes', () => {
    const content = `
      <div className="flex gap-2">
      <span className="text-lg font-bold">
    `;
    const result = extractClassStrings(content, 'test.tsx');
    expect(result).toHaveLength(2);
  });
});
