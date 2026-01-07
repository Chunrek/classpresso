/**
 * Classpresso Demo Server
 *
 * Serves sample HTML pages with various Tailwind-like utility class patterns
 * to demonstrate CSS class consolidation benefits.
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Common Tailwind-like class patterns
const patterns = {
  button: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  buttonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  buttonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  cardHeader: 'flex flex-col space-y-1.5 p-6',
  cardTitle: 'text-2xl font-semibold leading-none tracking-tight',
  cardDescription: 'text-sm text-muted-foreground',
  cardContent: 'p-6 pt-0',
  cardFooter: 'flex items-center p-6 pt-0',
  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  avatar: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
  table: 'w-full caption-bottom text-sm',
  tableHeader: 'border-b transition-colors hover:bg-muted/50',
  tableCell: 'p-4 align-middle',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  gridCols2: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  gridCols3: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  gridCols4: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
};

// Generate a card component
function generateCard(index) {
  return `
    <div class="${patterns.card}">
      <div class="${patterns.cardHeader}">
        <h3 class="${patterns.cardTitle}">Card Title ${index}</h3>
        <p class="${patterns.cardDescription}">Card description text goes here</p>
      </div>
      <div class="${patterns.cardContent}">
        <p class="text-sm text-muted-foreground">Card content for item ${index}. This is sample text.</p>
      </div>
      <div class="${patterns.cardFooter}">
        <button class="${patterns.button} ${patterns.buttonPrimary}">Action</button>
        <button class="${patterns.button} ${patterns.buttonSecondary} ml-2">Cancel</button>
      </div>
    </div>`;
}

// Generate a table row
function generateTableRow(index) {
  return `
    <tr class="${patterns.tableHeader}">
      <td class="${patterns.tableCell}">${index}</td>
      <td class="${patterns.tableCell}">User ${index}</td>
      <td class="${patterns.tableCell}">user${index}@example.com</td>
      <td class="${patterns.tableCell}">
        <span class="${patterns.badge}">Active</span>
      </td>
      <td class="${patterns.tableCell}">
        <button class="${patterns.button} ${patterns.buttonPrimary}">Edit</button>
      </td>
    </tr>`;
}

// Generate a form group
function generateFormGroup(index) {
  return `
    <div class="${patterns.flexBetween} mb-4">
      <label class="${patterns.label}" for="field${index}">Field ${index}</label>
      <input class="${patterns.input}" id="field${index}" type="text" placeholder="Enter value" />
    </div>`;
}

// Generate dashboard stats card
function generateStatsCard(index) {
  return `
    <div class="${patterns.card}">
      <div class="${patterns.cardHeader}">
        <div class="${patterns.flexBetween}">
          <span class="${patterns.cardTitle}">$${(Math.random() * 10000).toFixed(2)}</span>
          <div class="${patterns.avatar}">
            <span class="${patterns.flexCenter} h-full w-full bg-muted">+</span>
          </div>
        </div>
        <p class="${patterns.cardDescription}">Metric ${index}</p>
      </div>
    </div>`;
}

// API Endpoints
app.get('/api/cards/:count', (req, res) => {
  const count = Math.min(parseInt(req.params.count) || 50, 500);
  const cards = Array.from({ length: count }, (_, i) => generateCard(i + 1)).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><title>Cards Demo</title></head>
<body>
  <div class="${patterns.container}">
    <h1 class="${patterns.cardTitle} mb-8">Cards Grid</h1>
    <div class="${patterns.gridCols3}">
      ${cards}
    </div>
  </div>
</body>
</html>`;

  res.type('html').send(html);
});

app.get('/api/table/:count', (req, res) => {
  const count = Math.min(parseInt(req.params.count) || 100, 1000);
  const rows = Array.from({ length: count }, (_, i) => generateTableRow(i + 1)).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><title>Table Demo</title></head>
<body>
  <div class="${patterns.container}">
    <h1 class="${patterns.cardTitle} mb-8">Users Table</h1>
    <table class="${patterns.table}">
      <thead>
        <tr class="${patterns.tableHeader}">
          <th class="${patterns.tableCell}">ID</th>
          <th class="${patterns.tableCell}">Name</th>
          <th class="${patterns.tableCell}">Email</th>
          <th class="${patterns.tableCell}">Status</th>
          <th class="${patterns.tableCell}">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  res.type('html').send(html);
});

app.get('/api/forms/:count', (req, res) => {
  const count = Math.min(parseInt(req.params.count) || 20, 200);
  const forms = Array.from({ length: count }, (_, i) => `
    <div class="${patterns.card} mb-4">
      <div class="${patterns.cardHeader}">
        <h3 class="${patterns.cardTitle}">Form ${i + 1}</h3>
      </div>
      <div class="${patterns.cardContent}">
        ${Array.from({ length: 5 }, (_, j) => generateFormGroup(j + 1)).join('\n')}
      </div>
      <div class="${patterns.cardFooter}">
        <button class="${patterns.button} ${patterns.buttonPrimary}">Submit</button>
        <button class="${patterns.button} ${patterns.buttonSecondary} ml-2">Reset</button>
      </div>
    </div>
  `).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><title>Forms Demo</title></head>
<body>
  <div class="${patterns.container}">
    <h1 class="${patterns.cardTitle} mb-8">Forms</h1>
    ${forms}
  </div>
</body>
</html>`;

  res.type('html').send(html);
});

app.get('/api/dashboard/:count', (req, res) => {
  const count = Math.min(parseInt(req.params.count) || 12, 100);
  const stats = Array.from({ length: count }, (_, i) => generateStatsCard(i + 1)).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><title>Dashboard Demo</title></head>
<body>
  <div class="${patterns.container}">
    <div class="${patterns.flexBetween} mb-8">
      <h1 class="${patterns.cardTitle}">Dashboard</h1>
      <button class="${patterns.button} ${patterns.buttonPrimary}">Export</button>
    </div>
    <div class="${patterns.gridCols4}">
      ${stats}
    </div>
  </div>
</body>
</html>`;

  res.type('html').send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'classpresso-demo' });
});

app.listen(PORT, () => {
  console.log(\`Classpresso Demo Server running on port \${PORT}\`);
  console.log(\`
Endpoints:
  GET /api/cards/:count      - Card grid (max 500)
  GET /api/table/:count      - Data table (max 1000)
  GET /api/forms/:count      - Form components (max 200)
  GET /api/dashboard/:count  - Dashboard stats (max 100)
  GET /health                - Health check

Test with:
  curl http://localhost:\${PORT}/api/cards/50
  \`);
});
