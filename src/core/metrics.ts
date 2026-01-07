/**
 * Metrics - Calculate and format optimization metrics
 */

import type {
  ConsolidationCandidate,
  FileStats,
  OptimizationMetrics,
  TransformResult,
} from '../types/index.js';

/**
 * Calculate optimization metrics
 */
export function calculateMetrics(
  candidates: ConsolidationCandidate[],
  originalFiles: FileStats[],
  transformResult: TransformResult,
  cssOverhead: number
): OptimizationMetrics {
  const totalBytesSaved = candidates.reduce((sum, c) => sum + c.bytesSaved, 0);
  const netSavings = totalBytesSaved - cssOverhead;

  const originalTotalBytes = originalFiles.reduce((sum, f) => sum + f.originalSize, 0);
  const optimizedTotalBytes = originalTotalBytes - netSavings;

  // Estimate browser impact
  // Based on research: ~0.1ms per KB of class parsing saved
  const estimatedParseTimeSavedMs = Math.max(0, (netSavings / 1024) * 0.1);
  const estimatedRenderTimeSavedMs = estimatedParseTimeSavedMs * 0.5;

  return {
    totalFilesScanned: originalFiles.length,
    totalFilesModified: transformResult.filesModified,

    totalClassStringsFound: candidates.reduce((sum, c) => sum + c.frequency, 0),
    uniqueClassPatterns: candidates.length,
    consolidatedPatterns: candidates.filter((c) => c.frequency >= 2).length,
    totalOccurrencesReplaced: candidates.reduce((sum, c) => sum + c.frequency, 0),

    originalTotalBytes,
    optimizedTotalBytes,
    bytesSaved: totalBytesSaved,
    percentageReduction: originalTotalBytes > 0
      ? (netSavings / originalTotalBytes) * 100
      : 0,

    originalCSSBytes: 0, // Would need to track CSS separately
    consolidatedCSSBytes: cssOverhead,
    netCSSChange: cssOverhead,

    estimatedParseTimeSavedMs,
    estimatedRenderTimeSavedMs,

    topConsolidations: candidates.slice(0, 10).map((c) => ({
      original: c.classString,
      consolidated: c.hashName,
      frequency: c.frequency,
      bytesSaved: c.bytesSaved,
    })),
  };
}

/**
 * Calculate CSS overhead for a single pattern
 * More accurate estimation based on actual CSS output
 */
export function calculatePatternCSSOverhead(classes: string[]): number {
  // Base overhead: selector + braces + newlines = ~15 bytes
  // e.g., ".cp-a7b2c {\n}\n" = ~15 bytes
  const baseOverhead = 15;

  // Per-class overhead: property: value; + newline = ~20 bytes average
  // e.g., "  display: flex;\n" = ~18 bytes
  const perClassOverhead = 20;

  return baseOverhead + (classes.length * perClassOverhead);
}

/**
 * Estimate CSS overhead from consolidated classes
 */
export function estimateCSSOverhead(candidates: ConsolidationCandidate[]): number {
  return candidates.reduce((sum, c) => {
    return sum + calculatePatternCSSOverhead(c.classes);
  }, 0);
}

/**
 * Check if a pattern has net positive savings
 */
export function hasNetPositiveSavings(candidate: ConsolidationCandidate): boolean {
  const cssOverhead = calculatePatternCSSOverhead(candidate.classes);
  return candidate.bytesSaved > cssOverhead;
}

/**
 * Calculate net savings for a pattern
 */
export function calculateNetSavings(candidate: ConsolidationCandidate): number {
  const cssOverhead = calculatePatternCSSOverhead(candidate.classes);
  return candidate.bytesSaved - cssOverhead;
}

/**
 * Format bytes for display
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const sign = bytes < 0 ? '-' : '';
  const absBytes = Math.abs(bytes);

  if (absBytes < 1024) {
    return `${sign}${absBytes} B`;
  } else if (absBytes < 1024 * 1024) {
    return `${sign}${(absBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${sign}${(absBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format time in milliseconds
 */
export function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}
