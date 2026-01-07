/**
 * Classpresso Performance Report Generator
 *
 * Runs comprehensive benchmarks and generates a PDF report
 * demonstrating class consolidation benefits.
 */

import PDFDocument from 'pdfkit';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3456';

// Chart configuration
const chartWidth = 600;
const chartHeight = 300;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: chartWidth, height: chartHeight });

function formatBytes(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

// Simulated class consolidation
function consolidateClasses(html) {
  const patterns = [
    { original: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', hash: 'cp-btn' },
    { original: 'bg-primary text-primary-foreground hover:bg-primary/90', hash: 'cp-btn-p' },
    { original: 'bg-secondary text-secondary-foreground hover:bg-secondary/80', hash: 'cp-btn-s' },
    { original: 'rounded-lg border bg-card text-card-foreground shadow-sm', hash: 'cp-card' },
    { original: 'flex flex-col space-y-1.5 p-6', hash: 'cp-hdr' },
    { original: 'text-2xl font-semibold leading-none tracking-tight', hash: 'cp-title' },
    { original: 'text-sm text-muted-foreground', hash: 'cp-muted' },
    { original: 'flex items-center justify-center', hash: 'cp-fc' },
    { original: 'flex items-center justify-between', hash: 'cp-fb' },
    { original: 'p-6 pt-0', hash: 'cp-cnt' },
    { original: 'flex items-center p-6 pt-0', hash: 'cp-ftr' },
    { original: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', hash: 'cp-input' },
    { original: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', hash: 'cp-label' },
    { original: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', hash: 'cp-badge' },
    { original: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', hash: 'cp-ctnr' },
    { original: 'border-b transition-colors hover:bg-muted/50', hash: 'cp-tr' },
    { original: 'p-4 align-middle', hash: 'cp-td' },
    { original: 'w-full caption-bottom text-sm', hash: 'cp-tbl' },
    { original: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', hash: 'cp-g3' },
    { original: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', hash: 'cp-g4' },
    { original: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', hash: 'cp-avtr' },
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

  const cssOverhead = patterns.length * 50;

  return { html: consolidated, patternsConsolidated: patternsFound, cssOverhead };
}

async function runBenchmark(endpoint, count, iterations = 3) {
  const results = {
    endpoint: `${endpoint}/${count}`,
    count,
    originalSizes: [],
    consolidatedSizes: [],
    patternsFound: [],
    processingTimes: [],
  };

  for (let i = 0; i < iterations; i++) {
    const response = await fetch(`${BASE_URL}${endpoint}/${count}`);
    const html = await response.text();
    const originalSize = html.length;

    const start = performance.now();
    const result = consolidateClasses(html);
    const processingTime = performance.now() - start;

    const consolidatedSize = result.html.length + result.cssOverhead;

    results.originalSizes.push(originalSize);
    results.consolidatedSizes.push(consolidatedSize);
    results.patternsFound.push(result.patternsConsolidated);
    results.processingTimes.push(processingTime);
  }

  const avgOriginalSize = results.originalSizes.reduce((a, b) => a + b, 0) / iterations;
  const avgConsolidatedSize = results.consolidatedSizes.reduce((a, b) => a + b, 0) / iterations;
  const avgPatternsFound = results.patternsFound.reduce((a, b) => a + b, 0) / iterations;
  const avgProcessingTime = results.processingTimes.reduce((a, b) => a + b, 0) / iterations;
  const savingsPercent = ((avgOriginalSize - avgConsolidatedSize) / avgOriginalSize * 100);
  const savingsBytes = avgOriginalSize - avgConsolidatedSize;

  return {
    ...results,
    avgOriginalSize,
    avgConsolidatedSize,
    avgPatternsFound,
    avgProcessingTime,
    savingsPercent,
    savingsBytes,
  };
}

async function generateSizeChart(results) {
  const labels = results.map(r => r.endpoint);
  const originalData = results.map(r => r.avgOriginalSize / 1024);
  const consolidatedData = results.map(r => r.avgConsolidatedSize / 1024);

  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Original HTML (KB)',
          data: originalData,
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Consolidated (KB)',
          data: consolidatedData,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'HTML Size Comparison: Original vs Consolidated',
          font: { size: 16, weight: 'bold' },
        },
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Size (KB)' },
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateSavingsChart(results) {
  const labels = results.map(r => r.endpoint);
  const savingsData = results.map(r => r.savingsPercent);

  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Savings (%)',
          data: savingsData,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Bundle Size Savings by Endpoint',
          font: { size: 16, weight: 'bold' },
        },
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          title: { display: true, text: 'Savings (%)' },
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generatePDF(results, charts) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const outputPath = `classpresso-report-${Date.now()}.pdf`;
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Title Page
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Classpresso', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica').fillColor('#4a4a6a')
       .text('CSS Class Consolidation Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).fillColor('#666666')
       .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.moveDown(3);

    // Executive Summary
    doc.roundedRect(50, doc.y, 495, 140, 10).stroke('#7c3aed');
    const boxY = doc.y + 12;

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Executive Summary', 70, boxY);

    const totalOriginal = results.reduce((sum, r) => sum + r.avgOriginalSize, 0);
    const totalConsolidated = results.reduce((sum, r) => sum + r.avgConsolidatedSize, 0);
    const totalPatterns = results.reduce((sum, r) => sum + r.avgPatternsFound, 0);
    const avgSavings = ((totalOriginal - totalConsolidated) / totalOriginal * 100).toFixed(1);

    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Total HTML Analyzed: ${formatBytes(totalOriginal)}`, 70, boxY + 24);
    doc.text(`Total After Consolidation: ${formatBytes(totalConsolidated)}`, 70, boxY + 40);
    doc.text(`Total Bytes Saved: ${formatBytes(totalOriginal - totalConsolidated)}`, 70, boxY + 56);
    doc.text(`Average Savings: ${avgSavings}%`, 70, boxY + 72);
    doc.text(`Patterns Consolidated: ${Math.round(totalPatterns)}`, 70, boxY + 88);

    doc.y = boxY + 140 + 20;

    // Size Comparison Chart
    doc.addPage();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Bundle Size Analysis', { align: 'center' });
    doc.moveDown(1);

    doc.image(charts.size, { fit: [500, 250], align: 'center' });

    doc.moveDown(1);
    doc.fontSize(10).font('Helvetica').fillColor('#666666')
       .text('Comparison of HTML bundle sizes before and after class consolidation.', { align: 'center' });

    // Detailed Results Table
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Detailed Results');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    doc.rect(50, tableTop, 495, 18).fill('#7c3aed');
    doc.fontSize(7).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('Endpoint', 55, tableTop + 5);
    doc.text('Original', 160, tableTop + 5);
    doc.text('Consolidated', 230, tableTop + 5);
    doc.text('Saved', 310, tableTop + 5);
    doc.text('Patterns', 380, tableTop + 5);
    doc.text('Time (ms)', 440, tableTop + 5);

    let rowY = tableTop + 18;
    doc.font('Helvetica').fillColor('#333333').fontSize(7);

    results.forEach((r, i) => {
      const bgColor = i % 2 === 0 ? '#f5f3ff' : '#ffffff';
      doc.rect(50, rowY, 495, 14).fill(bgColor);
      doc.fillColor('#333333');
      doc.text(r.endpoint, 55, rowY + 3, { width: 100 });
      doc.text(formatBytes(r.avgOriginalSize), 160, rowY + 3);
      doc.text(formatBytes(r.avgConsolidatedSize), 230, rowY + 3);
      doc.fillColor('#7c3aed').font('Helvetica-Bold');
      doc.text(`${r.savingsPercent.toFixed(1)}%`, 315, rowY + 3);
      doc.fillColor('#333333').font('Helvetica');
      doc.text(Math.round(r.avgPatternsFound).toString(), 388, rowY + 3);
      doc.text(r.avgProcessingTime.toFixed(2), 445, rowY + 3);
      rowY += 14;
    });

    // Savings Chart
    doc.addPage();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Savings by Endpoint', { align: 'center' });
    doc.moveDown(1);

    doc.image(charts.savings, { fit: [500, 250], align: 'center' });

    // Key Benefits
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#7c3aed')
       .text('Key Benefits');
    doc.moveDown(0.5);

    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text('1. Reduced Bundle Size: Repetitive class strings are replaced with short hashes', 50);
    doc.moveDown(0.3);
    doc.text('2. Faster Parse Time: Browser spends less time parsing className attributes', 50);
    doc.moveDown(0.3);
    doc.text('3. Better Caching: Smaller HTML means more efficient CDN and browser caching', 50);
    doc.moveDown(0.3);
    doc.text('4. Improved LCP: Smaller initial HTML payload improves Largest Contentful Paint', 50);
    doc.moveDown(0.3);
    doc.text('5. Zero Runtime Cost: All processing happens at build time', 50);

    // Footer
    doc.moveDown(3);
    doc.fontSize(10).font('Helvetica').fillColor('#999999')
       .text('Report generated by Classpresso Demo Suite', { align: 'center' });
    doc.text('https://classpresso.com', { align: 'center', link: 'https://classpresso.com' });

    doc.end();

    stream.on('finish', () => {
      console.log(`\nReport saved: ${outputPath}`);
      resolve(outputPath);
    });

    stream.on('error', reject);
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('       Classpresso Performance Report Generator');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Check if server is running
  try {
    await fetch(`${BASE_URL}/health`);
  } catch {
    console.error(`Server not running at ${BASE_URL}`);
    console.error('Start the server first: PORT=3456 npm start\n');
    process.exit(1);
  }

  console.log('Running benchmarks...\n');

  const benchmarks = [
    { endpoint: '/api/cards', count: 10 },
    { endpoint: '/api/cards', count: 50 },
    { endpoint: '/api/cards', count: 100 },
    { endpoint: '/api/cards', count: 200 },
    { endpoint: '/api/table', count: 50 },
    { endpoint: '/api/table', count: 100 },
    { endpoint: '/api/table', count: 500 },
    { endpoint: '/api/forms', count: 10 },
    { endpoint: '/api/forms', count: 20 },
    { endpoint: '/api/forms', count: 50 },
    { endpoint: '/api/dashboard', count: 12 },
    { endpoint: '/api/dashboard', count: 24 },
  ];

  const results = [];

  for (const benchmark of benchmarks) {
    process.stdout.write(`   Testing ${benchmark.endpoint}/${benchmark.count}... `);
    const result = await runBenchmark(benchmark.endpoint, benchmark.count);
    results.push(result);
    console.log(`${result.savingsPercent.toFixed(1)}% savings`);
  }

  console.log('\nGenerating charts...');

  const charts = {
    size: await generateSizeChart(results),
    savings: await generateSavingsChart(results),
  };

  console.log('Creating PDF report...');

  const outputPath = await generatePDF(results, charts);

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('                    BENCHMARK SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════');

  const totalOriginal = results.reduce((sum, r) => sum + r.avgOriginalSize, 0);
  const totalConsolidated = results.reduce((sum, r) => sum + r.avgConsolidatedSize, 0);
  const avgSavings = results.reduce((sum, r) => sum + r.savingsPercent, 0) / results.length;

  console.log(`   Total data tested:   ${formatBytes(totalOriginal)}`);
  console.log(`   Consolidated size:   ${formatBytes(totalConsolidated)}`);
  console.log(`   Average savings:     ${avgSavings.toFixed(1)}%`);
  console.log(`   Total saved:         ${formatBytes(totalOriginal - totalConsolidated)}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.log(`Report generated: ${outputPath}\n`);
}

main().catch(console.error);
