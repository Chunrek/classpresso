/**
 * Pattern Detector - Identifies patterns worth consolidating
 */

import type {
  ClasspressoConfig,
  ClassOccurrence,
  ConsolidationCandidate,
} from '../types/index.js';
import { generateSequentialName } from '../utils/hash.js';
import { calculatePatternCSSOverhead } from './metrics.js';
import { isHydrationSafe } from './scanner.js';

/**
 * Calculate bytes saved by consolidating a pattern
 */
export function calculateBytesSaved(
  original: string,
  hashName: string,
  frequency: number,
  excludedClasses: string[]
): number {
  // Original: "flex flex-col gap-2 js-hook" (with excluded)
  // New: "cp-a7b2c js-hook"

  // We're replacing the included classes portion only
  const originalLength = original.length;
  const excludedLength = excludedClasses.join(' ').length;
  const includedLength = originalLength - excludedLength - (excludedClasses.length > 0 ? 1 : 0);

  // New length is just the hash name
  const newLength = hashName.length;

  // Savings per occurrence
  const savingsPerOccurrence = includedLength - newLength;

  // Total savings across all occurrences
  return savingsPerOccurrence * frequency;
}

/**
 * Detect patterns that are worth consolidating
 * Uses sequential naming (cp-a, cp-b, etc.) for shortest possible class names
 * @param occurrences - Map of pattern occurrences from scanner
 * @param config - Classpresso configuration
 * @param mergeablePatterns - Patterns that would be skipped in JS but not HTML (for SSR mode)
 */
export function detectConsolidatablePatterns(
  occurrences: Map<string, ClassOccurrence>,
  config: ClasspressoConfig,
  mergeablePatterns?: Set<string>
): ConsolidationCandidate[] {
  // First pass: collect all valid candidates (without names yet)
  const preliminaryCandidates: Array<{
    occurrence: ClassOccurrence;
    cssOverhead: number;
  }> = [];

  for (const [, occurrence] of occurrences) {
    // Filter by minimum occurrences
    if (occurrence.count < config.minOccurrences) continue;

    // Filter by minimum classes
    if (occurrence.classes.length < config.minClasses) continue;

    // SSR mode: only transform patterns found in BOTH server and client contexts
    // This prevents React hydration mismatches
    if (config.ssr && !isHydrationSafe(occurrence)) {
      continue;
    }

    // SSR mode: skip mergeable patterns to prevent hydration mismatches
    // These are patterns that appear as className props in JS but get merged
    // with component classes in HTML. If we consolidate in HTML but skip in JS,
    // we get a mismatch. So we skip the pattern entirely in SSR mode.
    if (config.ssr && mergeablePatterns && mergeablePatterns.has(occurrence.normalizedKey)) {
      continue;
    }

    // Skip patterns that have excluded classes if skipPatternsWithExcludedClasses is enabled
    // This prevents issues like "hidden md:flex" becoming "_cp-xxx md:flex" where
    // the consolidated class has display:none that overrides the responsive md:flex
    if (config.skipPatternsWithExcludedClasses && occurrence.excludedClasses.length > 0) {
      continue;
    }

    const cssOverhead = calculatePatternCSSOverhead(occurrence.classes);
    preliminaryCandidates.push({ occurrence, cssOverhead });
  }

  // Sort by frequency (highest first) for best sequential name assignment
  // Most frequent patterns get shortest names (cp-a, cp-b, etc.)
  preliminaryCandidates.sort((a, b) => b.occurrence.count - a.occurrence.count);

  // Second pass: filter candidates that will have positive savings
  // Use a placeholder name length estimate for initial filtering
  const filteredCandidates: Array<{
    occurrence: ClassOccurrence;
    cssOverhead: number;
  }> = [];

  for (const { occurrence, cssOverhead } of preliminaryCandidates) {
    // Estimate name length: cp-a (4 bytes) for first 36, cp-aa (5 bytes) for next, etc.
    const estimatedNameLength = config.hashPrefix.length + 1; // Conservative estimate

    // Calculate estimated bytes saved
    const estimatedBytesSaved = calculateBytesSaved(
      occurrence.classString,
      'x'.repeat(estimatedNameLength), // placeholder
      occurrence.count,
      occurrence.excludedClasses
    );

    // Filter by minimum bytes saved
    if (estimatedBytesSaved < config.minBytesSaved) continue;

    // Filter by net positive savings (bytes saved > CSS overhead)
    // Skip this check if forceAll is enabled (for React hydration consistency)
    if (!config.forceAll) {
      if (estimatedBytesSaved <= cssOverhead) continue;
    }

    filteredCandidates.push({ occurrence, cssOverhead });
  }

  // Third pass: assign sequential names to only the filtered candidates
  const candidates: ConsolidationCandidate[] = [];

  for (let i = 0; i < filteredCandidates.length; i++) {
    const { occurrence } = filteredCandidates[i];

    // Generate sequential name (cp-a, cp-b, cp-c, ...)
    const hashName = generateSequentialName(i, config.hashPrefix);

    // Calculate actual bytes saved with real name
    const bytesSaved = calculateBytesSaved(
      occurrence.classString,
      hashName,
      occurrence.count,
      occurrence.excludedClasses
    );

    candidates.push({
      classString: occurrence.classString,
      normalizedKey: occurrence.normalizedKey,
      frequency: occurrence.count,
      bytesSaved,
      classes: occurrence.classes,
      excludedClasses: occurrence.excludedClasses,
      hashName,
    });
  }

  // Sort by bytes saved (highest first)
  return candidates.sort((a, b) => b.bytesSaved - a.bytesSaved);
}

/**
 * Get summary statistics for detected patterns
 */
export function getPatternSummary(candidates: ConsolidationCandidate[]): {
  totalPatterns: number;
  totalOccurrences: number;
  totalBytesSaved: number;
  avgFrequency: number;
  avgClassesPerPattern: number;
} {
  const totalPatterns = candidates.length;
  const totalOccurrences = candidates.reduce((sum, c) => sum + c.frequency, 0);
  const totalBytesSaved = candidates.reduce((sum, c) => sum + c.bytesSaved, 0);
  const totalClasses = candidates.reduce((sum, c) => sum + c.classes.length, 0);

  return {
    totalPatterns,
    totalOccurrences,
    totalBytesSaved,
    avgFrequency: totalPatterns > 0 ? totalOccurrences / totalPatterns : 0,
    avgClassesPerPattern: totalPatterns > 0 ? totalClasses / totalPatterns : 0,
  };
}
