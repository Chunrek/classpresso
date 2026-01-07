/**
 * Config Tests
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, validateConfig } from '../src/config.js';
import type { ClasspressoConfig } from '../src/types/index.js';

describe('DEFAULT_CONFIG', () => {
  it('has valid default build directory', () => {
    expect(DEFAULT_CONFIG.buildDir).toBe('.next');
  });

  it('has valid minOccurrences', () => {
    expect(DEFAULT_CONFIG.minOccurrences).toBeGreaterThanOrEqual(1);
  });

  it('has valid minClasses', () => {
    expect(DEFAULT_CONFIG.minClasses).toBeGreaterThanOrEqual(1);
  });

  it('has valid hashPrefix', () => {
    expect(DEFAULT_CONFIG.hashPrefix).toBe('cp-');
    expect(DEFAULT_CONFIG.hashPrefix.length).toBeGreaterThan(0);
  });

  it('has valid hashLength', () => {
    expect(DEFAULT_CONFIG.hashLength).toBeGreaterThanOrEqual(3);
    expect(DEFAULT_CONFIG.hashLength).toBeLessThanOrEqual(32);
  });

  it('has default exclude prefixes', () => {
    expect(DEFAULT_CONFIG.exclude.prefixes).toContain('js-');
    expect(DEFAULT_CONFIG.exclude.prefixes).toContain('data-');
  });

  it('has default exclude suffixes', () => {
    expect(DEFAULT_CONFIG.exclude.suffixes).toContain('-handler');
    expect(DEFAULT_CONFIG.exclude.suffixes).toContain('-trigger');
  });

  it('has default exclude patterns', () => {
    expect(DEFAULT_CONFIG.exclude.patterns.length).toBeGreaterThan(0);
  });

  it('has manifest enabled by default', () => {
    expect(DEFAULT_CONFIG.manifest).toBe(true);
  });

  it('has backup disabled by default', () => {
    expect(DEFAULT_CONFIG.backup).toBe(false);
  });
});

describe('validateConfig', () => {
  it('returns no errors for valid config', () => {
    const errors = validateConfig(DEFAULT_CONFIG);
    expect(errors).toHaveLength(0);
  });

  it('returns error for minOccurrences < 1', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      minOccurrences: 0,
    };
    const errors = validateConfig(config);
    expect(errors).toContain('minOccurrences must be at least 1');
  });

  it('returns error for minClasses < 1', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      minClasses: 0,
    };
    const errors = validateConfig(config);
    expect(errors).toContain('minClasses must be at least 1');
  });

  it('returns error for hashLength < 3', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      hashLength: 2,
    };
    const errors = validateConfig(config);
    expect(errors).toContain('hashLength must be at least 3');
  });

  it('returns error for hashLength > 32', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      hashLength: 33,
    };
    const errors = validateConfig(config);
    expect(errors).toContain('hashLength must be at most 32');
  });

  it('returns error for empty hashPrefix', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      hashPrefix: '',
    };
    const errors = validateConfig(config);
    expect(errors).toContain('hashPrefix must not be empty');
  });

  it('returns multiple errors for multiple issues', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      minOccurrences: 0,
      minClasses: 0,
      hashLength: 1,
      hashPrefix: '',
    };
    const errors = validateConfig(config);
    expect(errors.length).toBeGreaterThan(1);
  });

  it('accepts valid custom config', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      minOccurrences: 5,
      minClasses: 3,
      hashLength: 8,
      hashPrefix: 'custom-',
    };
    const errors = validateConfig(config);
    expect(errors).toHaveLength(0);
  });

  it('accepts edge case hashLength of 3', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      hashLength: 3,
    };
    const errors = validateConfig(config);
    expect(errors).toHaveLength(0);
  });

  it('accepts edge case hashLength of 32', () => {
    const config: ClasspressoConfig = {
      ...DEFAULT_CONFIG,
      hashLength: 32,
    };
    const errors = validateConfig(config);
    expect(errors).toHaveLength(0);
  });
});
