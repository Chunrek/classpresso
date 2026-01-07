/**
 * Classpresso Benchmark with Real-Time Dashboard
 *
 * Runs continuous benchmarks and displays results in a live dashboard
 * comparing original HTML with class-consolidated HTML.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Simulated class consolidation (in real use, this would use the classpresso library)
function consolidateClasses(html) {
  // Common patterns that would be consolidated
  const patterns = [
    {
      original: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      hash: 'cp-btn'
    },
    {
      original: 'bg-primary text-primary-foreground hover:bg-primary/90',
      hash: 'cp-btn-p'
    },
    {
      original: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      hash: 'cp-btn-s'
    },
    {
      original: 'rounded-lg border bg-card text-card-foreground shadow-sm',
      hash: 'cp-card'
    },
    {
      original: 'flex flex-col space-y-1.5 p-6',
      hash: 'cp-hdr'
    },
    {
      original: 'text-2xl font-semibold leading-none tracking-tight',
      hash: 'cp-title'
    },
    {
      original: 'text-sm text-muted-foreground',
      hash: 'cp-muted'
    },
    {
      original: 'flex items-center justify-center',
      hash: 'cp-fc'
    },
    {
      original: 'flex items-center justify-between',
      hash: 'cp-fb'
    },
    {
      original: 'p-6 pt-0',
      hash: 'cp-cnt'
    },
    {
      original: 'flex items-center p-6 pt-0',
      hash: 'cp-ftr'
    },
    {
      original: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      hash: 'cp-input'
    },
    {
      original: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      hash: 'cp-label'
    },
    {
      original: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      hash: 'cp-badge'
    },
    {
      original: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
      hash: 'cp-ctnr'
    },
    {
      original: 'border-b transition-colors hover:bg-muted/50',
      hash: 'cp-tr'
    },
    {
      original: 'p-4 align-middle',
      hash: 'cp-td'
    },
    {
      original: 'w-full caption-bottom text-sm',
      hash: 'cp-tbl'
    },
    {
      original: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
      hash: 'cp-g3'
    },
    {
      original: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
      hash: 'cp-g4'
    },
    {
      original: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      hash: 'cp-avtr'
    },
  ];

  let consolidated = html;
  let patternsFound = 0;

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = consolidated.match(regex);
    if (matches) {
      patternsFound += matches.length;
      consolidated = consolidated.replace(regex, pattern.hash);
    }
  }

  // Generate CSS for consolidated classes (would be added as overhead)
  const cssOverhead = patterns.length * 50; // Approximate CSS bytes per class

  return {
    html: consolidated,
    patternsConsolidated: patternsFound,
    cssOverhead
  };
}

// Stats tracking
const stats = {
  totalRequests: 0,
  totalBytesSaved: 0,
  totalOriginalBytes: 0,
  totalConsolidatedBytes: 0,
  totalPatternsFound: 0,
  savingsHistory: [],
  startTime: Date.now()
};

function formatBytes(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

function formatDuration(ms) {
  if (ms >= 60000) return (ms / 60000).toFixed(1) + ' min';
  if (ms >= 1000) return (ms / 1000).toFixed(1) + ' sec';
  return ms + ' ms';
}

function createProgressBar(value, max, width = 30) {
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}

function renderDashboard() {
  clearScreen();

  const runtime = Date.now() - stats.startTime;
  const savingsPercent = stats.totalOriginalBytes > 0
    ? ((stats.totalBytesSaved / stats.totalOriginalBytes) * 100).toFixed(1)
    : 0;
  const rps = stats.totalRequests / (runtime / 1000);

  console.log(\`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                    \u2615 Classpresso Live Benchmark Dashboard                  \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                                                                          \u2551
\u2551  \u23F1\uFE0F  Runtime: \${formatDuration(runtime).padEnd(15)}       \uD83D\uDCCA Requests: \${String(stats.totalRequests).padEnd(10)} \u2551
\u2551  \uD83D\uDD04 Req/sec: \${rps.toFixed(1).padEnd(15)}                                          \u2551
\u2551                                                                          \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                          \uD83D\uDCBE BUNDLE SIZE SAVINGS                          \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                                                                          \u2551
\u2551  Original HTML:    \${formatBytes(stats.totalOriginalBytes).padEnd(15)}                              \u2551
\u2551  Consolidated:     \${formatBytes(stats.totalConsolidatedBytes).padEnd(15)}                              \u2551
\u2551  Total Saved:      \${formatBytes(stats.totalBytesSaved).padEnd(15)}  (\${savingsPercent}%)                   \u2551
\u2551  Patterns Found:   \${String(stats.totalPatternsFound).padEnd(15)}                              \u2551
\u2551                                                                          \u2551
\u2551  Savings: \${createProgressBar(parseFloat(savingsPercent), 100, 50)} \${savingsPercent}%    \u2551
\u2551                                                                          \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                         \uD83D\uDCC8 RECENT HISTORY (last 10)                      \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551                                                                          \u2551\`);

  // Show last 10 savings
  const recentSavings = stats.savingsHistory.slice(-10);
  recentSavings.forEach((s, i) => {
    const bar = createProgressBar(s.savingsPercent, 100, 30);
    console.log(\`\u2551  \${String(i + 1).padStart(2)}. \${s.endpoint.padEnd(20)} \${bar} \${s.savingsPercent.toFixed(1)}%  \u2551\`);
  });

  // Pad if less than 10
  for (let i = recentSavings.length; i < 10; i++) {
    console.log(\`\u2551                                                                          \u2551\`);
  }

  console.log(\`\u2551                                                                          \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551  Press Ctrl+C to stop                                                    \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
\`);
}

async function runBenchmark(endpoint, count) {
  try {
    const response = await fetch(\`\${BASE_URL}\${endpoint}/\${count}\`);
    const html = await response.text();
    const originalSize = html.length;

    // Consolidate classes
    const result = consolidateClasses(html);
    const consolidatedSize = result.html.length + result.cssOverhead;

    // Update stats
    stats.totalRequests++;
    stats.totalOriginalBytes += originalSize;
    stats.totalConsolidatedBytes += consolidatedSize;
    stats.totalBytesSaved += (originalSize - consolidatedSize);
    stats.totalPatternsFound += result.patternsConsolidated;

    // Add to savings history
    const savingsPercent = ((originalSize - consolidatedSize) / originalSize) * 100;
    stats.savingsHistory.push({
      endpoint: \`\${endpoint}/\${count}\`,
      savingsPercent,
      originalSize,
      consolidatedSize,
      patternsFound: result.patternsConsolidated
    });
    if (stats.savingsHistory.length > 100) stats.savingsHistory.shift();

  } catch (error) {
    // Silent fail, will retry
  }
}

async function runContinuousBenchmark() {
  const endpoints = [
    { path: '/api/cards', counts: [10, 50, 100, 200] },
    { path: '/api/table', counts: [50, 100, 500] },
    { path: '/api/forms', counts: [5, 10, 20, 50] },
    { path: '/api/dashboard', counts: [8, 12, 24, 50] }
  ];

  console.log('Starting Classpresso benchmark...');
  console.log('Waiting for server...\n');

  // Wait for server
  let serverReady = false;
  while (!serverReady) {
    try {
      await fetch(\`\${BASE_URL}/health\`);
      serverReady = true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Start dashboard render loop
  setInterval(renderDashboard, 500);

  // Run continuous benchmarks
  while (true) {
    for (const endpoint of endpoints) {
      for (const count of endpoint.counts) {
        await runBenchmark(endpoint.path, count);
        await new Promise(r => setTimeout(r, 100)); // Small delay between requests
      }
    }
  }
}

runContinuousBenchmark().catch(console.error);
