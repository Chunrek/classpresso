/**
 * Consolidator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createClassMappings,
  buildReplacementMap,
} from '../src/core/consolidator.js';
import type { ConsolidationCandidate } from '../src/types/index.js';

describe('createClassMappings', () => {
  it('creates mappings from candidates', () => {
    const candidates: ConsolidationCandidate[] = [
      {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        frequency: 5,
        bytesSaved: 100,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        hashName: 'cp-abc12',
      },
    ];

    const mappings = createClassMappings(candidates);
    expect(mappings).toHaveLength(1);
    expect(mappings[0].original).toBe('flex gap-2');
    expect(mappings[0].consolidated).toBe('cp-abc12');
    expect(mappings[0].classes).toEqual(['flex', 'gap-2']);
  });

  it('preserves excluded classes', () => {
    const candidates: ConsolidationCandidate[] = [
      {
        classString: 'flex gap-2 js-hook',
        normalizedKey: 'flex gap-2',
        frequency: 5,
        bytesSaved: 100,
        classes: ['flex', 'gap-2'],
        excludedClasses: ['js-hook'],
        hashName: 'cp-abc12',
      },
    ];

    const mappings = createClassMappings(candidates);
    expect(mappings[0].excludedClasses).toEqual(['js-hook']);
  });

  it('includes frequency and bytes saved', () => {
    const candidates: ConsolidationCandidate[] = [
      {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        frequency: 10,
        bytesSaved: 250,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        hashName: 'cp-abc12',
      },
    ];

    const mappings = createClassMappings(candidates);
    expect(mappings[0].frequency).toBe(10);
    expect(mappings[0].bytesSaved).toBe(250);
  });

  it('handles multiple candidates', () => {
    const candidates: ConsolidationCandidate[] = [
      {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        frequency: 5,
        bytesSaved: 100,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        hashName: 'cp-abc12',
      },
      {
        classString: 'flex gap-4',
        normalizedKey: 'flex gap-4',
        frequency: 10,
        bytesSaved: 200,
        classes: ['flex', 'gap-4'],
        excludedClasses: [],
        hashName: 'cp-def34',
      },
    ];

    const mappings = createClassMappings(candidates);
    expect(mappings).toHaveLength(2);
  });

  it('initializes cssDeclarations as empty', () => {
    const candidates: ConsolidationCandidate[] = [
      {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        frequency: 5,
        bytesSaved: 100,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        hashName: 'cp-abc12',
      },
    ];

    const mappings = createClassMappings(candidates);
    expect(mappings[0].cssDeclarations).toBe('');
  });
});

describe('buildReplacementMap', () => {
  it('builds map from mappings', () => {
    const mappings = [
      {
        original: 'flex gap-2',
        consolidated: 'cp-abc12',
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        cssDeclarations: '',
        frequency: 5,
        bytesSaved: 100,
      },
    ];

    const map = buildReplacementMap(mappings);
    expect(map.size).toBe(1);
    expect(map.has('flex gap-2')).toBe(true);
  });

  it('sorts class names in key', () => {
    const mappings = [
      {
        original: 'gap-2 flex',
        consolidated: 'cp-abc12',
        classes: ['gap-2', 'flex'],
        excludedClasses: [],
        cssDeclarations: '',
        frequency: 5,
        bytesSaved: 100,
      },
    ];

    const map = buildReplacementMap(mappings);
    // Key should be sorted: 'flex gap-2'
    expect(map.has('flex gap-2')).toBe(true);
  });

  it('includes excluded classes in value', () => {
    const mappings = [
      {
        original: 'flex gap-2 js-hook',
        consolidated: 'cp-abc12',
        classes: ['flex', 'gap-2'],
        excludedClasses: ['js-hook'],
        cssDeclarations: '',
        frequency: 5,
        bytesSaved: 100,
      },
    ];

    const map = buildReplacementMap(mappings);
    const value = map.get('flex gap-2');
    expect(value?.excludedClasses).toEqual(['js-hook']);
  });

  it('handles multiple mappings', () => {
    const mappings = [
      {
        original: 'flex gap-2',
        consolidated: 'cp-abc12',
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        cssDeclarations: '',
        frequency: 5,
        bytesSaved: 100,
      },
      {
        original: 'flex gap-4',
        consolidated: 'cp-def34',
        classes: ['flex', 'gap-4'],
        excludedClasses: [],
        cssDeclarations: '',
        frequency: 10,
        bytesSaved: 200,
      },
    ];

    const map = buildReplacementMap(mappings);
    expect(map.size).toBe(2);
  });

  it('returns consolidated class name in value', () => {
    const mappings = [
      {
        original: 'flex gap-2',
        consolidated: 'cp-xyz99',
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        cssDeclarations: '',
        frequency: 5,
        bytesSaved: 100,
      },
    ];

    const map = buildReplacementMap(mappings);
    const value = map.get('flex gap-2');
    expect(value?.consolidated).toBe('cp-xyz99');
  });
});
