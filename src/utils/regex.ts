/**
 * Regex utilities for Classpresso
 */

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Patterns to match className in various contexts
 */
export const CLASS_PATTERNS = {
  // JSX: className="..."
  jsxDouble: /className\s*=\s*"([^"]+)"/g,

  // JSX: className='...'
  jsxSingle: /className\s*=\s*'([^']+)'/g,

  // React createElement: className:"..."
  createElementDouble: /className\s*:\s*"([^"]+)"/g,

  // React createElement: className:'...'
  createElementSingle: /className\s*:\s*'([^']+)'/g,

  // Minified: "className","..."
  minifiedComma: /"className"\s*,\s*"([^"]+)"/g,

  // HTML: class="..."
  htmlDouble: /\bclass\s*=\s*"([^"]+)"/g,

  // HTML: class='...'
  htmlSingle: /\bclass\s*=\s*'([^']+)'/g,
};

/**
 * All patterns combined for extraction
 */
export const ALL_CLASS_PATTERNS = [
  CLASS_PATTERNS.jsxDouble,
  CLASS_PATTERNS.jsxSingle,
  CLASS_PATTERNS.createElementDouble,
  CLASS_PATTERNS.createElementSingle,
  CLASS_PATTERNS.minifiedComma,
  CLASS_PATTERNS.htmlDouble,
  CLASS_PATTERNS.htmlSingle,
];

/**
 * Check if a class string contains dynamic expressions
 */
export function isDynamicClassString(classString: string): boolean {
  // Template literal expression
  if (classString.includes('${')) return true;

  // Ternary operator (likely dynamic)
  if (/\s*\?\s*/.test(classString) && classString.includes(':')) return true;

  // Function call
  if (/\w+\s*\(/.test(classString)) return true;

  // Variable reference (camelCase or UPPER_CASE that's not a valid class)
  if (/^[a-z][a-zA-Z0-9]*$/.test(classString) && !classString.includes('-')) return true;

  return false;
}

/**
 * Create a replacement pattern for a class string
 */
export function createReplacementPatterns(original: string): RegExp[] {
  const escaped = escapeRegex(original);

  return [
    new RegExp(`(className\\s*=\\s*)"${escaped}"`, 'g'),
    new RegExp(`(className\\s*=\\s*)'${escaped}'`, 'g'),
    new RegExp(`(className\\s*:\\s*)"${escaped}"`, 'g'),
    new RegExp(`(className\\s*:\\s*)'${escaped}'`, 'g'),
    new RegExp(`("className"\\s*,\\s*)"${escaped}"`, 'g'),
    new RegExp(`(class\\s*=\\s*)"${escaped}"`, 'g'),
    new RegExp(`(class\\s*=\\s*)'${escaped}'`, 'g'),
  ];
}
