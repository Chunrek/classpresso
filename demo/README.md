# Classpresso Demo

Benchmarking and analysis tools for Classpresso CSS class consolidation.

## Prerequisites

1. Install dependencies:
```bash
cd demo
npm install
```

2. Start the demo server:
```bash
npm start
```

## Available Scripts

### `npm start`
Starts the Express server with sample HTML endpoints containing Tailwind-like utility classes.

**Endpoints:**
- `GET /api/cards/:count` - Card grid (max 500)
- `GET /api/table/:count` - Data table (max 1000)
- `GET /api/forms/:count` - Form components (max 200)
- `GET /api/dashboard/:count` - Dashboard stats (max 100)

### `npm run benchmark`
Runs a live dashboard showing real-time class consolidation benchmarks.

```bash
npm run benchmark
```

Features:
- Real-time bundle size savings
- Pattern consolidation counts
- Historical comparison

### `npm run memory`
Analyzes memory usage and performance characteristics.

```bash
node --expose-gc memory-analysis.js
```

Shows:
- HTML size comparisons at different scales
- Memory usage analysis
- Processing time benchmarks

### `npm run report`
Generates a PDF report with comprehensive benchmarks.

```bash
PORT=3456 npm start  # In one terminal
npm run report       # In another terminal
```

The report includes:
- Executive summary
- Size comparison charts
- Detailed results table
- Savings analysis

## Sample Results

| Components | Original | Consolidated | Savings |
|------------|----------|--------------|---------|
| 50 cards   | 45 KB    | 32 KB        | 29%     |
| 100 cards  | 90 KB    | 64 KB        | 29%     |
| 500 rows   | 180 KB   | 125 KB       | 31%     |
| 20 forms   | 95 KB    | 68 KB        | 28%     |

## How It Works

The demo simulates class consolidation by:

1. Generating HTML with common utility class patterns
2. Replacing repetitive patterns with short hash names
3. Calculating CSS overhead for consolidated classes
4. Measuring net savings (HTML reduction - CSS overhead)

In production, Classpresso performs this optimization at build time on your actual codebase.
