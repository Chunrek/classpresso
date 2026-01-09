/**
 * CSS Purger - Removes unused CSS classes after consolidation
 */

import postcss from 'postcss';
import type { ClassMapping, ClasspressoConfig, PurgeResult } from '../types/index.js';
import { readFileContent, writeFileContent, findFiles, isCSSFile } from '../utils/files.js';
import { ALL_CLASS_PATTERNS } from '../utils/regex.js';

/**
 * CSS file patterns for all supported frameworks
 */
const CSS_PATTERNS = [
  // Next.js
  'static/**/*.css',
  'static/css/**/*.css',
  'standalone/.next/static/**/*.css',
  // Angular
  'browser/**/*.css',
  // Astro
  '_astro/**/*.css',
  'client/_astro/**/*.css',
  // Nuxt
  'public/_nuxt/**/*.css',
  // SvelteKit
  '_app/**/*.css',
  'client/**/*.css',
  // Vite/Vue/React/Qwik generic
  'assets/**/*.css',
  // Generic fallback
  '**/*.css',
];

/**
 * File patterns for scanning class usage
 */
const SCAN_PATTERNS = [
  '**/*.html',
  '**/*.js',
  '**/*.mjs',
  '**/*.jsx',
];

/**
 * Extract all individual class names used in HTML/JS files
 */
export async function extractUsedClasses(
  buildDir: string
): Promise<Set<string>> {
  const usedClasses = new Set<string>();
  const files = await findFiles(buildDir, SCAN_PATTERNS);

  for (const file of files) {
    try {
      const content = await readFileContent(file);

      // Use all class patterns to find class strings
      for (const pattern of ALL_CLASS_PATTERNS) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;

        while ((match = regex.exec(content)) !== null) {
          // Extract the class string from the match groups
          const classString = match[1] || match[2] || match[3];
          if (classString) {
            // Split into individual classes
            const classes = classString.split(/\s+/).filter(c => c.length > 0);
            classes.forEach(cls => usedClasses.add(cls));
          }
        }
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return usedClasses;
}

/**
 * Extract class name from a CSS selector
 * Returns null if not a simple class selector
 */
function extractClassFromSelector(selector: string): string | null {
  // Match simple class selectors like .flex, .items-center
  // Also handles escaped characters like .hover\:bg-blue-700
  const match = selector.match(/^\.([^\s:,\[]+)/);
  if (match) {
    // Unescape the class name
    return match[1].replace(/\\/g, '');
  }
  return null;
}

/**
 * Check if a class matches the safelist
 */
function matchesSafelist(className: string, safelist: (string | RegExp)[]): boolean {
  for (const pattern of safelist) {
    if (typeof pattern === 'string') {
      if (className === pattern) return true;
    } else if (pattern instanceof RegExp) {
      if (pattern.test(className)) return true;
    }
  }
  return false;
}

/**
 * Check if a class is a responsive or state variant that might be dynamically applied
 */
function isResponsiveOrStateVariant(className: string): boolean {
  const variantPrefixes = [
    'sm:', 'md:', 'lg:', 'xl:', '2xl:',  // Responsive
    'hover:', 'focus:', 'active:', 'disabled:', 'group-hover:',  // State
    'dark:', 'light:',  // Theme
    'first:', 'last:', 'odd:', 'even:',  // Child
    'before:', 'after:',  // Pseudo-elements
  ];
  return variantPrefixes.some(prefix => className.startsWith(prefix));
}

/**
 * Main function to purge unused CSS classes
 */
export async function purgeUnusedCSS(
  buildDir: string,
  mappings: ClassMapping[],
  config: ClasspressoConfig
): Promise<PurgeResult> {
  const result: PurgeResult = {
    filesProcessed: 0,
    rulesRemoved: 0,
    purgedClasses: [],
    bytesSaved: 0,
    keptClasses: [],
    errors: [],
  };

  try {
    // Step 1: Build set of classes that were consolidated
    const consolidatedClasses = new Set<string>();
    for (const mapping of mappings) {
      mapping.classes.forEach(cls => consolidatedClasses.add(cls));
      // Also add the consolidated class name (cp-a, cp-b, etc.)
      consolidatedClasses.add(mapping.consolidated);
    }

    // Step 2: Scan HTML/JS to find all classes still in use
    const usedClasses = await extractUsedClasses(buildDir);

    // Step 3: Find CSS files
    const cssFiles = await findFiles(buildDir, CSS_PATTERNS);

    // Step 4: Process each CSS file
    for (const cssFile of cssFiles) {
      if (!isCSSFile(cssFile)) continue;

      try {
        const originalContent = await readFileContent(cssFile);
        const originalSize = Buffer.byteLength(originalContent, 'utf-8');

        const root = postcss.parse(originalContent);
        const rulesToRemove: postcss.Rule[] = [];

        root.walkRules((rule) => {
          const className = extractClassFromSelector(rule.selector);
          if (!className) return;

          // Decision logic: should we purge this class?

          // KEEP: Class is still used in HTML/JS
          if (usedClasses.has(className)) {
            result.keptClasses.push(className);
            return;
          }

          // KEEP: Class is a consolidated class (cp-*)
          if (className.startsWith(config.hashPrefix)) {
            return;
          }

          // KEEP: Class was part of consolidation but might still be used elsewhere
          // Actually, if it's not in usedClasses, it's safe to remove

          // KEEP: Class matches safelist
          if (config.purgeSafelist && matchesSafelist(className, config.purgeSafelist)) {
            result.keptClasses.push(className);
            return;
          }

          // KEEP: Responsive/state variants (might be dynamically applied)
          if (isResponsiveOrStateVariant(className)) {
            result.keptClasses.push(className);
            return;
          }

          // PURGE: Class is not used
          rulesToRemove.push(rule);
          result.purgedClasses.push(className);
        });

        // Remove the rules
        for (const rule of rulesToRemove) {
          rule.remove();
          result.rulesRemoved++;
        }

        // Write back if changes were made
        if (rulesToRemove.length > 0) {
          const newContent = root.toString();
          const newSize = Buffer.byteLength(newContent, 'utf-8');
          result.bytesSaved += (originalSize - newSize);
          await writeFileContent(cssFile, newContent);
        }

        result.filesProcessed++;
      } catch (error) {
        result.errors.push(`Error processing ${cssFile}: ${error}`);
      }
    }

    // Deduplicate arrays
    result.purgedClasses = [...new Set(result.purgedClasses)];
    result.keptClasses = [...new Set(result.keptClasses)];

  } catch (error) {
    result.errors.push(`Purge error: ${error}`);
  }

  return result;
}
