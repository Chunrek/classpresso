/**
 * Hash generation utilities for Classpresso
 */

import crypto from 'crypto';

/**
 * Generate a hash-based class name from a normalized class string
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
