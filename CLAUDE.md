# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Classpresso is a build-time CSS class consolidation tool that optimizes utility-first CSS (Tailwind, Bootstrap, etc.) by finding repeated class patterns and consolidating them into single short-hash classes. It runs on build output (not source code) with zero runtime overhead.

## Commands

```bash
# Build (uses tsup)
npm run build

# Run tests
npm run test           # Watch mode
npm run test:run       # Single run

# Run single test file
npx vitest run tests/scanner.test.ts

# Type checking
npm run typecheck

# Lint
npm run lint

# Development (watch mode)
npm run dev

# CLI commands (after build)
npx classpresso analyze --dir .next
npx classpresso optimize --dir .next
npx classpresso report --dir .next
```

## Architecture

### Core Pipeline

The optimization pipeline flows through these modules in order:

1. **Scanner** (`src/core/scanner.ts`) - Extracts class strings from build output files (HTML, JS, RSC payloads). Uses regex patterns from `src/utils/regex.ts` to find class attributes.

2. **Pattern Detector** (`src/core/pattern-detector.ts`) - Analyzes scanned occurrences to find consolidation candidates based on frequency and byte savings thresholds.

3. **Consolidator** (`src/core/consolidator.ts`) - Creates class mappings (original → hash) and manages the manifest file that tracks all transformations.

4. **CSS Generator** (`src/core/css-generator.ts`) - Parses original utility classes and generates consolidated CSS declarations. Uses PostCSS for CSS parsing.

5. **Transformer** (`src/core/transformer.ts`) - Applies the mappings to build output files, replacing original class strings with consolidated hash classes.

### Key Types (`src/types/index.ts`)

- `ClasspressoConfig` - Full configuration object with thresholds, exclusions, output options
- `ClassOccurrence` - Tracks a class pattern's frequency and locations across files
- `ConsolidationCandidate` - Pattern that meets thresholds for consolidation
- `ClassMapping` - Final mapping from original classes to consolidated hash
- `MappingManifest` - JSON file written to build dir with all mappings and metrics

### Configuration

Configuration is loaded from `classpresso.config.js/mjs/json` in the project root. The `DEFAULT_CONFIG` in `src/config.ts` defines defaults including:
- Default build dir: `.next`
- Hash prefix: `cp-`
- Excluded prefixes: `js-`, `data-`, `hook-`, `track-`

### Utilities

- `src/utils/hash.ts` - Generates short hash names with collision resolution
- `src/utils/regex.ts` - Class extraction patterns for various formats (className, class, cn(), clsx(), template literals)
- `src/utils/files.ts` - File system operations and glob patterns for scanning

### CLI (`src/cli/`)

Three commands implemented via Commander.js:
- `analyze` - Dry-run analysis showing potential savings
- `optimize` - Applies transformations to build output
- `report` - Generates reports from existing manifest

### Build Output

The project builds to both ESM and CJS formats via tsup. Entry points are exported for:
- Main API (`classpresso`)
- CLI (`classpresso/cli`)
- Individual core modules (`classpresso/scanner`, `classpresso/consolidator`, `classpresso/transformer`)
