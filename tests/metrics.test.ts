/**
 * Metrics Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  formatPercentage,
  formatTime,
  calculatePatternCSSOverhead,
  hasNetPositiveSavings,
} from '../src/core/metrics.js';
import type { ConsolidationCandidate } from '../src/types/index.js';

describe('formatBytes', () => {
  it('formats zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(2560)).toBe('2.50 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1.00 MB');
  });

  it('handles negative values', () => {
    expect(formatBytes(-500)).toBe('-500 B');
    expect(formatBytes(-1024)).toBe('-1.00 KB');
  });
});

describe('formatPercentage', () => {
  it('formats percentage with 2 decimals', () => {
    expect(formatPercentage(5.5)).toBe('5.50%');
    expect(formatPercentage(0.123)).toBe('0.12%');
    expect(formatPercentage(100)).toBe('100.00%');
  });
});

describe('formatTime', () => {
  it('formats microseconds', () => {
    expect(formatTime(0.5)).toBe('500.00μs');
  });

  it('formats milliseconds', () => {
    expect(formatTime(50)).toBe('50.00ms');
  });

  it('formats seconds', () => {
    expect(formatTime(1500)).toBe('1.50s');
  });
});

describe('calculatePatternCSSOverhead', () => {
  it('calculates overhead for 1 class', () => {
    const overhead = calculatePatternCSSOverhead(['flex']);
    expect(overhead).toBe(35); // 15 base + 20 * 1 class
  });

  it('calculates overhead for multiple classes', () => {
    const overhead = calculatePatternCSSOverhead(['flex', 'gap-2', 'items-center']);
    expect(overhead).toBe(75); // 15 base + 20 * 3 classes
  });
});

describe('hasNetPositiveSavings', () => {
  it('returns true when bytes saved > CSS overhead', () => {
    const candidate: ConsolidationCandidate = {
      classString: 'flex gap-2 items-center',
      normalizedKey: 'flex gap-2 items-center',
      frequency: 10,
      bytesSaved: 200,
      classes: ['flex', 'gap-2', 'items-center'],
      excludedClasses: [],
      hashName: 'cp-abc12',
    };
    expect(hasNetPositiveSavings(candidate)).toBe(true);
  });

  it('returns false when bytes saved <= CSS overhead', () => {
    const candidate: ConsolidationCandidate = {
      classString: 'flex gap-2',
      normalizedKey: 'flex gap-2',
      frequency: 2,
      bytesSaved: 20, // Less than 55 (15 + 20*2)
      classes: ['flex', 'gap-2'],
      excludedClasses: [],
      hashName: 'cp-abc12',
    };
    expect(hasNetPositiveSavings(candidate)).toBe(false);
  });
});
