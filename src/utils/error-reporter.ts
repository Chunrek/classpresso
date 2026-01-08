/**
 * Error reporter for Classpresso
 * Sends error reports to a configurable webhook for debugging
 */

import path from 'path';
import os from 'os';
import type { ClasspressoConfig } from '../types/index.js';
import { getVersion } from './logger.js';

const TIMEOUT_MS = 5000;

export interface ErrorReportPayload {
  timestamp: string;
  classpressoVersion: string;
  nodeVersion: string;
  os: string;
  platform: string;
  arch: string;
  errorMessage: string;
  errorStack?: string;
  config: SanitizedConfig;
  command?: string;
}

export interface SanitizedConfig {
  minOccurrences: number;
  minClasses: number;
  minBytesSaved: number;
  hashPrefix: string;
  hashLength: number;
  cssLayer: string | false | undefined;
  dataAttributes: boolean;
  manifest: boolean;
  backup: boolean;
  verbose: boolean;
  forceAll: boolean;
  excludeDynamicPatterns: boolean;
  skipPatternsWithExcludedClasses: boolean;
  ssr: boolean;
  debug: boolean;
}

export interface ErrorReporterOptions {
  enabled: boolean;
  url?: string;
}

/**
 * Sanitize a file path to only include the basename
 * Protects user privacy by not sending full directory structure
 */
export function sanitizePath(fullPath: string): string {
  return path.basename(fullPath);
}

/**
 * Create a sanitized version of the config that excludes sensitive data
 */
export function sanitizeConfig(config: ClasspressoConfig): SanitizedConfig {
  return {
    minOccurrences: config.minOccurrences,
    minClasses: config.minClasses,
    minBytesSaved: config.minBytesSaved,
    hashPrefix: config.hashPrefix,
    hashLength: config.hashLength,
    cssLayer: config.cssLayer,
    dataAttributes: config.dataAttributes,
    manifest: config.manifest,
    backup: config.backup,
    verbose: config.verbose,
    forceAll: config.forceAll,
    excludeDynamicPatterns: config.excludeDynamicPatterns,
    skipPatternsWithExcludedClasses: config.skipPatternsWithExcludedClasses,
    ssr: config.ssr,
    debug: config.debug,
    // Excluded for privacy:
    // - buildDir (full path reveals project structure)
    // - errorReportUrl (meta/recursive)
    // - sendErrorReports (meta)
    // - exclude.* (could reveal project patterns)
    // - include (could reveal project patterns)
    // - dynamicPrefixes (could reveal libraries used)
  };
}

/**
 * Send an error report to the configured webhook
 * This function never throws - failures are silent
 */
export async function sendErrorReport(
  error: Error,
  options: ErrorReporterOptions,
  config: ClasspressoConfig,
  command?: string
): Promise<void> {
  // Don't send if disabled or no URL configured
  if (!options.enabled || !options.url) {
    return;
  }

  const payload: ErrorReportPayload = {
    timestamp: new Date().toISOString(),
    classpressoVersion: getVersion(),
    nodeVersion: process.version,
    os: process.platform,
    platform: os.release(),
    arch: process.arch,
    errorMessage: error.message,
    errorStack: error.stack,
    config: sanitizeConfig(config),
    command,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    await fetch(options.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `classpresso/${getVersion()}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch {
    // Silently fail - error reporting should never affect the main process
    // The user shouldn't see errors about error reporting failing
  }
}
