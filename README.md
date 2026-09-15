# Multi-Cloud Cost Intelligence

An original, animated, scroll-driven visualization of multi-cloud resource cost aggregation — four cloud providers feeding into a shared cost analysis, a focus transition onto one specific workload, and a savings conclusion. Built as a self-built, from-scratch frontend engineering exercise: every visual element (nodes, connectors, chart, cards, badges) is hand-built, with no pre-made UI component library.

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Framer Motion** for animation — chosen specifically for its scroll-linked `useScroll`/`useTransform` primitives, which drive every stage off a single progress value so the whole sequence reverses correctly on scroll-up with no separate "undo" logic
- **Tailwind CSS v4** (CSS-first config) for layout utilities, combined with a small set of CSS custom properties for design tokens (color, spacing, radius, typography, motion durations/easing)
- **TanStack Query** for data fetching and caching

No UI/component libraries, no icon packages, and no dependencies beyond what's listed above.

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. For a production build:

```bash
npm run build
npm run start
```

Other scripts: `npm run lint` (ESLint), `npm run typecheck` (`tsc --noEmit`).

## The Interaction Concept

The page is a single scroll-driven narrative, pinned to the viewport while you scroll through five stages:

1. **Identity** — four provider nodes fade and scale in.
2. **Connection** — each node's resource glyphs light up while dotted connectors draw in from the nodes toward a shared analysis panel.
3. **Analysis** — a cost/resource chart grows out of that shared panel, with each bar's value counting up as it fills.
4. **Focus** — one provider (and one specific workload within it) is highlighted while the others recede, with a restrained positional/scale cue (no full-page zoom).
5. **Conclusion** — a savings detail card appears, visually bridged to the panel above it, showing the estimated monthly savings for that specific workload.

Every stage is driven by a single scroll-progress value, so scrolling back up reverses the whole sequence exactly, rather than relying on one-shot "play on enter" animations.

On mobile widths and whenever the OS/browser's reduced-motion preference is on, the page switches to a simpler, non-pinned layout: the same content reveals as you scroll past it with a plain fade-and-slide-in, with no scroll-scrubbing, scaling, or zoom.

## API / Data

Data comes from the public [DummyJSON](https://dummyjson.com) products endpoint:

```
GET https://dummyjson.com/products?limit=10&select=id,title,price,rating,discountPercentage,stock
```

The fetched `price`, `rating`, `discountPercentage`, and `stock` fields are **deterministically transformed** (see `src/lib/mapResourceData.ts`) into this visualization's own domain model — cost figures per resource category, provider glyph "lit" states, and a computed savings figure. This is a genuine, dynamic fetch with real async state handling; the numbers are not presented as real cloud telemetry, just realistic-looking figures derived from a real API response, remapped honestly into the visualization's own language.

**Loading / error / success states:** a skeleton placeholder renders on first load; a network failure shows an explicit error message with a working **Retry** button; on success, the real values feed the animation and count-up numbers. TanStack Query caches responses for 5 minutes, so revisiting or remounting the section within that window shows data instantly with no redundant network request.

## Responsive Behavior

- **Desktop (≥1280px):** full radial composition — four corner nodes, connectors, and the chart on one shared canvas panel.
- **Tablet (768–1279px):** the same scroll-linked sequence, recomposed into a 2×2 provider grid with the chart spanning below.
- **Mobile (<768px):** the simplified, non-pinned stacked layout described above — the radial/connector metaphor doesn't translate well to a narrow screen, so it's replaced with a straightforward vertical flow rather than shrunk to fit.

## Accessibility

- Semantic structure throughout (`<section>`, `<h2>`, `<figure>`/`<figcaption>`, `<dl>` for label/value pairs) rather than generic `<div>`s.
- `prefers-reduced-motion` is handled as a first-class alternate render path (see above), not a single disabled transition.
- The one interactive control (the error state's Retry button) is a real, keyboard-accessible `<button>` with a visible focus ring.
- Decorative-only elements (connector lines, glyph icons) are marked `aria-hidden`; all meaningful content is real text in the DOM.

## Key Implementation Decisions

- **Design tokens:** CSS custom properties in `src/app/globals.css` (colors, spacing, radius, typography, motion durations/easing) are the single source of truth, referenced from components via Tailwind's arbitrary-value syntax (`bg-[var(--color-bg-surface)]`) rather than scattered hex values.
- **Original iconography:** provider nodes use hand-built abstract shapes and plain text labels rather than reproducing any provider's actual trademarked logo — a deliberate originality choice, not a technical limitation.
- **Component architecture:** small, single-purpose components (`CloudProviderNode`, `ResourceGlyph`, `ConnectionLayer`, `ResourceVisualization`, `ResourceMetric`, `SavingsDetail`, plus generic `Badge`/`Button`/`StatValue` primitives) rather than one large monolithic section component; the orchestrating `MultiCloudSection` owns the scroll wiring and passes a single progress value down.
- **Modern CSS:** container queries (`@container`) drive component-level responsiveness (e.g. the chart's bar layout), `color-mix()` produces accessible-contrast text variants of the accent color, and `clamp()` handles fluid type sizing.

## Tradeoffs / What Would Be Improved With More Time

- The "focus" stage (4) communicates selection through highlighting, dimming, and a small positional cue rather than a true camera-style crop-zoom into the selected workload — a deliberate scope choice to avoid a disorienting full-page zoom.
- The connectors and the panel-to-card "bridge" are positioned from the grid's authored proportions rather than runtime `getBoundingClientRect` measurement; this is robust for the current layout but would need to become measurement-based if the composition grew more dynamic.
- No dark/light mode toggle is implemented yet, though the token architecture (CSS custom properties with a dark-mode override block already defined) is set up to support one without restructuring.
