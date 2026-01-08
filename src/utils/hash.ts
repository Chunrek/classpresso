/**
 * Hash generation utilities for Classpresso
 */

import crypto from 'crypto';

// Base36 alphabet: a-z then 0-9 (letters first for valid CSS class names)
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const BASE = ALPHABET.length; // 36

/**
 * Calculate the minimum hash length needed for a given count of patterns
 * Uses base36 (a-z, 0-9) for 36 possible characters per position
 */
export function calculateMinHashLength(count: number): number {
  if (count <= 0) return 1;
  // How many characters needed to represent `count` unique values in base36
  return Math.max(1, Math.ceil(Math.log(count + 1) / Math.log(BASE)));
}

/**
 * Generate a sequential short name from an index
 * 0 -> 'a', 1 -> 'b', ..., 35 -> '9', 36 -> 'aa', 37 -> 'ab', ...
 */
export function generateSequentialName(index: number, prefix: string = 'cp-'): string {
  let result = '';
  let n = index;

  do {
    result = ALPHABET[n % BASE] + result;
    n = Math.floor(n / BASE) - 1;
  } while (n >= 0);

  return `${prefix}${result}`;
}

/**
 * Generate sequential names for a list of items
 * Returns the shortest possible names based on total count
 */
export function generateSequentialNames(
  count: number,
  prefix: string = 'cp-'
): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(generateSequentialName(i, prefix));
  }
  return names;
}

/**
 * Generate a hash-based class name from a normalized class string
 * @deprecated Use generateSequentialName for shorter names
 */
export function generateHashName(
  normalizedClassString: string,
  prefix: string = 'cp-',
  length: number = 5
): string {
  const hash = crypto
    .createHash('md5')
    .update(normalizedClassString)
    .digest('hex')
    .substring(0, length);

  return `${prefix}${hash}`;
}

/**
 * Resolve hash collisions by appending a suffix
 */
export function resolveCollisions<T extends { hashName: string; normalizedKey: string }>(
  candidates: T[]
): T[] {
  const hashMap = new Map<string, T>();

  for (const candidate of candidates) {
    let hash = candidate.hashName;
    let suffix = 0;

    // Check for collision with different content
    while (
      hashMap.has(hash) &&
      hashMap.get(hash)!.normalizedKey !== candidate.normalizedKey
    ) {
      suffix++;
      hash = `${candidate.hashName}${suffix}`;
    }

    candidate.hashName = hash;
    hashMap.set(hash, candidate);
  }

  return candidates;
}
