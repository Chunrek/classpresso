/**
 * Pattern Detector Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBytesSaved,
  detectConsolidatablePatterns,
  getPatternSummary,
} from '../src/core/pattern-detector.js';
import type { ClassOccurrence, ClasspressoConfig } from '../src/types/index.js';

describe('calculateBytesSaved', () => {
  it('calculates savings for simple pattern', () => {
    const saved = calculateBytesSaved('flex gap-2', 'cp-abc', 5, []);
    // Original: 10 chars, New: 6 chars, Savings: 4 * 5 = 20
    expect(saved).toBe(20);
  });

  it('calculates savings with excluded classes', () => {
    const saved = calculateBytesSaved('flex gap-2 js-hook', 'cp-abc', 5, ['js-hook']);
    // Original without excluded: 10 chars, New: 6 chars, Savings: 4 * 5 = 20
    expect(saved).toBeGreaterThan(0);
  });

  it('returns higher savings for more occurrences', () => {
    const saved5 = calculateBytesSaved('flex gap-2 items-center', 'cp-abc', 5, []);
    const saved10 = calculateBytesSaved('flex gap-2 items-center', 'cp-abc', 10, []);
    expect(saved10).toBe(saved5 * 2);
  });

  it('returns higher savings for longer patterns', () => {
    const shortSaved = calculateBytesSaved('flex', 'cp-abc', 5, []);
    const longSaved = calculateBytesSaved('flex items-center justify-between gap-4', 'cp-abc', 5, []);
    expect(longSaved).toBeGreaterThan(shortSaved);
  });

  it('handles empty excluded classes', () => {
    const saved = calculateBytesSaved('flex gap-2', 'cp-abc', 3, []);
    expect(saved).toBeGreaterThan(0);
  });

  it('handles multiple excluded classes', () => {
    const saved = calculateBytesSaved('flex gap-2 js-hook data-test', 'cp-abc', 3, ['js-hook', 'data-test']);
    expect(saved).toBeGreaterThan(0);
  });
});

describe('detectConsolidatablePatterns', () => {
  const defaultConfig: ClasspressoConfig = {
    buildDir: '.next',
    minOccurrences: 2,
    minClasses: 2,
    minBytesSaved: 10,
    hashPrefix: 'cp-',
    hashLength: 5,
    exclude: { prefixes: [], suffixes: [], classes: [], patterns: [] },
    manifest: true,
    backup: false,
  };

  it('filters by minimum occurrences', () => {
    const occurrences = new Map<string, ClassOccurrence>([
      ['flex gap-2', {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        count: 1, // Below threshold
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        locations: [],
      }],
    ]);

    const result = detectConsolidatablePatterns(occurrences, defaultConfig);
    expect(result).toHaveLength(0);
  });

  it('filters by minimum classes', () => {
    const occurrences = new Map<string, ClassOccurrence>([
      ['flex', {
        classString: 'flex',
        normalizedKey: 'flex',
        count: 10,
        classes: ['flex'], // Only 1 class
        excludedClasses: [],
        locations: [],
      }],
    ]);

    const result = detectConsolidatablePatterns(occurrences, defaultConfig);
    expect(result).toHaveLength(0);
  });

  it('returns candidates meeting all criteria', () => {
    const occurrences = new Map<string, ClassOccurrence>([
      ['flex items-center gap-2', {
        classString: 'flex items-center gap-2',
        normalizedKey: 'flex items-center gap-2',
        count: 10,
        classes: ['flex', 'items-center', 'gap-2'],
        excludedClasses: [],
        locations: [],
      }],
    ]);

    const result = detectConsolidatablePatterns(occurrences, defaultConfig);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].frequency).toBe(10);
  });

  it('sorts results by bytes saved descending', () => {
    const occurrences = new Map<string, ClassOccurrence>([
      ['flex gap-2', {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        count: 5,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        locations: [],
      }],
      ['flex items-center justify-center gap-4 p-4', {
        classString: 'flex items-center justify-center gap-4 p-4',
        normalizedKey: 'flex items-center justify-center gap-4 p-4',
        count: 10,
        classes: ['flex', 'items-center', 'justify-center', 'gap-4', 'p-4'],
        excludedClasses: [],
        locations: [],
      }],
    ]);

    const result = detectConsolidatablePatterns(occurrences, defaultConfig);
    if (result.length >= 2) {
      expect(result[0].bytesSaved).toBeGreaterThanOrEqual(result[1].bytesSaved);
    }
  });

  it('generates hash names with correct prefix', () => {
    const occurrences = new Map<string, ClassOccurrence>([
      ['flex items-center gap-2', {
        classString: 'flex items-center gap-2',
        normalizedKey: 'flex items-center gap-2',
        count: 10,
        classes: ['flex', 'items-center', 'gap-2'],
        excludedClasses: [],
        locations: [],
      }],
    ]);

    const result = detectConsolidatablePatterns(occurrences, defaultConfig);
    if (result.length > 0) {
      expect(result[0].hashName.startsWith('cp-')).toBe(true);
    }
  });
});

describe('getPatternSummary', () => {
  it('calculates correct totals', () => {
    const candidates = [
      {
        classString: 'flex gap-2',
        normalizedKey: 'flex gap-2',
        frequency: 5,
        bytesSaved: 100,
        classes: ['flex', 'gap-2'],
        excludedClasses: [],
        hashName: 'cp-abc',
      },
      {
        classString: 'flex gap-4',
        normalizedKey: 'flex gap-4',
        frequency: 10,
        bytesSaved: 200,
        classes: ['flex', 'gap-4'],
        excludedClasses: [],
        hashName: 'cp-def',
      },
    ];

    const summary = getPatternSummary(candidates);
    expect(summary.totalPatterns).toBe(2);
    expect(summary.totalOccurrences).toBe(15);
    expect(summary.totalBytesSaved).toBe(300);
  });

  it('calculates averages correctly', () => {
    const candidates = [
      {
        classString: 'flex gap-2 items-center',
        normalizedKey: 'flex gap-2 items-center',
        frequency: 4,
        bytesSaved: 100,
        classes: ['flex', 'gap-2', 'items-center'],
        excludedClasses: [],
        hashName: 'cp-abc',
      },
      {
        classString: 'flex gap-4',
        normalizedKey: 'flex gap-4',
        frequency: 6,
        bytesSaved: 200,
        classes: ['flex', 'gap-4'],
        excludedClasses: [],
        hashName: 'cp-def',
      },
    ];

    const summary = getPatternSummary(candidates);
    expect(summary.avgFrequency).toBe(5); // (4 + 6) / 2
    expect(summary.avgClassesPerPattern).toBe(2.5); // (3 + 2) / 2
  });

  it('handles empty array', () => {
    const summary = getPatternSummary([]);
    expect(summary.totalPatterns).toBe(0);
    expect(summary.totalOccurrences).toBe(0);
    expect(summary.totalBytesSaved).toBe(0);
    expect(summary.avgFrequency).toBe(0);
    expect(summary.avgClassesPerPattern).toBe(0);
  });
});
