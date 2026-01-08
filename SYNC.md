# Website Sync - v1.2.0

## New Features

### CSS Layer Support
Added `cssLayer` config option for Tailwind v4 and modern CSS layer compatibility.

```javascript
// classpresso.config.js
export default {
  cssLayer: 'utilities',  // wraps output in @layer utilities { }
}
```

**Output:**
```css
/* Classpresso Consolidated Classes */
@layer utilities {
  .cp-a1b2c {
    display: flex;
    align-items: center;
  }
}
```

- Set to a layer name string (e.g., `'utilities'`, `'components'`) to wrap consolidated CSS
- Set to `false` (default) for no layer wrapping (higher specificity)
- Useful for CMS integrations and strict CSS layer control

### Debug Data Attributes
Added `dataAttributes` config option to help debug consolidated classes in DevTools.

```javascript
// classpresso.config.js
export default {
  dataAttributes: true,  // adds data-cp-original to elements
}
```

**Output:**
```html
<!-- Before -->
<button class="flex items-center justify-center rounded-md">Submit</button>

<!-- After with dataAttributes: true -->
<button class="cp-a1b2c" data-cp-original="flex items-center justify-center rounded-md">Submit</button>
```

- When enabled, adds `data-cp-original` attribute showing the original classes
- Visible in browser DevTools Elements panel
- Useful for debugging and development
- Disable for production builds to save bytes

## Config Reference Update

Add these options to the config documentation:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cssLayer` | `string \| false` | `false` | Wrap consolidated CSS in `@layer`. Set to layer name or `false` to disable. |
| `dataAttributes` | `boolean` | `false` | Add `data-cp-original` attribute with original classes for debugging. |

---

## Real-World Benchmark: classpresso.com

We ran Classpresso on our own website to demonstrate real-world performance gains.

### Overall Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **HTML Size** | 254.19 KB | 244.12 KB | **-10.07 KB (-4.0%)** |
| **Total Classes** | 3,570 | 2,736 | **-834 (-23.4%)** |
| **Class Characters** | 37,018 | 27,019 | **-9,999 (-27.0%)** |
| **Memory Used** | 31.01 MB | 30.84 MB | **-0.17 MB (-0.5%)** |
| **Style Recalc Time** | 3.67 ms | 3.59 ms | **-0.08 ms (-2.2%)** |
| **Layout Duration** | 11.55 ms | 10.59 ms | **-0.96 ms (-8.3%)** |

### Homepage (Heaviest Page)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| HTML Size | 96.7 KB | 93.2 KB | -3.5 KB |
| Classes | 1,734 | 1,444 | **-290 (-16.7%)** |
| Class Chars | 18,291 | 14,853 | **-3,438 (-18.8%)** |
| First Paint | 51.2 ms | 43.2 ms | **-8.0 ms (-15.6%)** |
| Style Recalc | 1.56 ms | 1.42 ms | **-9.3%** |
| Layout | 6.49 ms | 5.51 ms | **-15.1%** |

### Login Page (Best Optimization)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Classes | 123 | 28 | **-95 (-77.2%)** |
| Class Chars | 1,402 | 208 | **-1,194 (-85.2%)** |

### Key Highlights

- **27% fewer class characters** across all pages
- **23% fewer total classes** to parse
- **15.6% faster First Paint** on homepage
- **8.3% faster layout calculations**
- **Login page: 85% reduction** in class attribute size

### Methodology

- Tested using Playwright with Chrome DevTools Protocol
- 5 runs per page, averaged results
- Pages tested: Homepage, Docs, Performance, Login
- Metrics: HTML size, class count, memory, First Paint, Style Recalc, Layout Duration
