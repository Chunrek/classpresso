/**
 * Consolidator - Creates consolidated class mappings
 */

import type {
  ClasspressoConfig,
  ConsolidationCandidate,
  ClassMapping,
  MappingManifest,
  OptimizationMetrics,
} from '../types/index.js';
import { writeFileContent } from '../utils/files.js';
import path from 'path';

/**
 * Create class mappings from consolidation candidates
 */
export function createClassMappings(
  candidates: ConsolidationCandidate[]
): ClassMapping[] {
  return candidates.map((candidate) => ({
    original: candidate.classString,
    consolidated: candidate.hashName,
    classes: candidate.classes,
    excludedClasses: candidate.excludedClasses,
    cssDeclarations: '', // Will be filled by CSS generator
    frequency: candidate.frequency,
    bytesSaved: candidate.bytesSaved,
  }));
}

/**
 * Build a lookup map from original class patterns to their consolidated names
 */
export function buildReplacementMap(
  mappings: ClassMapping[]
): Map<string, { consolidated: string; excludedClasses: string[] }> {
  const map = new Map<string, { consolidated: string; excludedClasses: string[] }>();

  for (const mapping of mappings) {
    // Key is the sorted class string (without excluded classes)
    const key = [...mapping.classes].sort().join(' ');
    map.set(key, {
      consolidated: mapping.consolidated,
      excludedClasses: mapping.excludedClasses,
    });
  }

  return map;
}

/**
 * Create and save the mapping manifest
 */
export async function saveMappingManifest(
  mappings: ClassMapping[],
  metrics: OptimizationMetrics,
  config: ClasspressoConfig
): Promise<string> {
  const manifest: MappingManifest = {
    version: '1.0.0',
    tool: 'classpresso',
    buildDir: config.buildDir,
    created: new Date().toISOString(),
    config: {
      minOccurrences: config.minOccurrences,
      minClasses: config.minClasses,
      hashPrefix: config.hashPrefix,
      hashLength: config.hashLength,
    },
    mappings,
    metrics,
  };

  const manifestPath = path.join(config.buildDir, 'classpresso-manifest.json');
  await writeFileContent(manifestPath, JSON.stringify(manifest, null, 2));

  return manifestPath;
}

/**
 * Load an existing manifest
 */
export async function loadMappingManifest(
  buildDir: string
): Promise<MappingManifest | null> {
  const manifestPath = path.join(buildDir, 'classpresso-manifest.json');

  try {
    const { readFileContent } = await import('../utils/files.js');
    const content = await readFileContent(manifestPath);
    return JSON.parse(content) as MappingManifest;
  } catch {
    return null;
  }
}
