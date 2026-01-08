# Website Sync - v1.1.0

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

## Config Reference Update

Add `cssLayer` to the config documentation:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cssLayer` | `string \| false` | `false` | Wrap consolidated CSS in `@layer`. Set to layer name or `false` to disable. |
