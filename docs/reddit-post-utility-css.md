# Reddit Post for Classpresso - Utility CSS Frameworks

## Title options:

**Option 1:** I built a tool that makes utility-class CSS render 50% faster in the browser (open source)

**Option 2:** Open source CLI that cuts style recalculation time by 50% for Tailwind, UnoCSS, and any utility-class framework

**Option 3:** I built a post-build optimizer for utility CSS - 50% faster style recalculation (works with Tailwind, UnoCSS, Twind, any utility framework)

---

## Post body:

Hey everyone,

I've been using utility-class CSS frameworks for a few years now and love the DX. But I started noticing something on larger projects: pages with lots of components were feeling sluggish, especially on mobile. After digging into Chrome DevTools, I found the culprit wasn't bundle size or network — it was style recalculation.

**The Problem**

Every class on every element is work for the browser. When you have:

```html
<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2">
```

...that's 15 classes the browser needs to parse, match against stylesheets, and calculate styles for. Multiply that by every element on the page, and it adds up fast.

On a dashboard with 500+ components, I was seeing 28ms of style recalculation time. That happens on initial load, every React re-render, every hover/focus state change, window resize, etc.

**The Solution: Classpresso**

I built an open-source CLI tool that runs as a post-build step. It scans your build output, identifies repeated class patterns, and consolidates them into short hash-based classes.

**Works with any utility-class CSS framework:**
- Tailwind CSS
- UnoCSS
- Twind
- Windi CSS
- Custom utility classes

If your build outputs HTML with utility classes, Classpresso can optimize it.

**Before:**
```html
<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ...">
```

**After:**
```html
<button class="cp-btn bg-primary text-white">
```

It generates a small CSS file that maps `cp-btn` to all the original utilities. Your source code stays exactly the same — it only touches build output.

**Framework Support:**

Works with any framework that outputs HTML:
- Next.js (App Router & Pages)
- Vite (React, Vue, Svelte)
- Nuxt
- SvelteKit
- Astro
- Remix
- Qwik
- SolidJS
- Plain HTML/CSS

**Real Benchmarks (Chrome DevTools Protocol)**

I ran proper benchmarks with CPU throttling to simulate mobile devices:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Style Recalculation | 28.6ms | 14.3ms | **50% faster** |
| First Paint | 412ms | 239ms | **42% faster** |
| Memory Usage | 34.2 MB | 28.1 MB | **18% less** |

Run it yourself: `npx classpresso benchmark`

**Setup (2 minutes)**

```bash
npm install -D classpresso
```

Add to your build:
```json
{
  "scripts": {
    "build": "next build && classpresso"
  }
}
```

That's it. Zero config required.

**Links**

- npm: https://www.npmjs.com/package/classpresso
- GitHub: https://github.com/ArtificialWeb-au/classpresso?utm_source=reddit&utm_medium=social&utm_campaign=utility_css
- Website: https://classpresso.com?utm_source=reddit&utm_medium=social&utm_campaign=utility_css

Happy to answer questions about the implementation or benchmarks.

---

## Subreddits to post in:

### Tier 1 (Best fit - post first):
- **r/webdev** - Broad utility CSS audience, not framework-specific
- **r/frontend** - Frontend performance optimization
- **r/tailwindcss** - Still the biggest utility CSS community

### Tier 2 (Framework-specific):
- **r/nextjs** - Large community, perf-focused
- **r/reactjs** - Mention React re-renders
- **r/vuejs** - Works with Vite/Nuxt
- **r/sveltejs** - Works with SvelteKit

### Tier 3 (Niche but targeted):
- **r/webperf** - Web performance enthusiasts
- **r/css** - CSS optimization
- **r/astro** - Astro-specific

### Posting order:
1. **r/webdev** first - broadest utility CSS audience
2. **r/tailwindcss** 4-6 hours later - biggest utility CSS community
3. **r/nextjs** next day
4. Framework-specific subs based on traction

---

## r/reactjs (Requires Flair + Comment)

**Flair:** Use "Show /r/reactjs" or "Resource"

**First comment (MUST post for visibility):**

I built this to solve style recalculation lag on React dashboards with lots of components.

**The problem:** Every utility class is work for the browser. When React re-renders, the browser has to recalculate styles for every class on every element. On a 500+ component dashboard, I was seeing 28ms of style recalculation on every state change.

**The solution:** Post-build CLI that consolidates repeated class patterns into short hashes. Your JSX stays the same - it only touches build output.

**React-specific benefits:**
- Faster re-renders (50% less style recalculation)
- Works with Next.js (App Router & Pages), Vite, Remix
- Zero runtime overhead - it's a build step
- Compatible with any styling approach that outputs utility classes

```bash
npm install -D classpresso
# Add to build: "build": "next build && classpresso"
```

Works with Tailwind, UnoCSS, or any utility-class framework.

Happy to answer questions!

---

## r/javascript Link Post (if required):

**Link:** https://github.com/ArtificialWeb-au/classpresso?utm_source=reddit&utm_medium=social&utm_campaign=rjavascript

**Title:** Classpresso - Post-build optimizer that makes utility-class CSS render 50% faster

**First comment:**

Hey everyone - I built this to solve performance issues on component-heavy dashboards.

**The problem:** Every utility class is work for the browser. 15 classes × 500 elements = style recalculation lag on every re-render, hover, resize.

**The solution:** Post-build CLI that consolidates repeated class patterns into short hashes. Source code unchanged - only touches build output.

**Benchmarks (CPU throttled for mobile):**
- Style recalculation: 50% faster
- First paint: 42% faster

Works with Tailwind, UnoCSS, Twind, or any utility-class framework. Supports Next.js, Vite, Nuxt, SvelteKit, Astro, Remix, and more.

`npm install -D classpresso && classpresso` - zero config.

Happy to answer questions!

---

## Key arguments to have ready:

- **"Just use @apply"** → @apply still outputs the same number of classes in the HTML. Classpresso consolidates at build time.
- **"PurgeCSS already does this"** → PurgeCSS removes unused CSS. Classpresso consolidates repeated class patterns in HTML. They're complementary.
- **"This adds build complexity"** → One line in package.json. Zero config. 2 minute setup.
- **"What about debugging?"** → Source maps supported. Original classes visible in DevTools.
