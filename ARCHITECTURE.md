# BLISS COUTURE — Project Architecture Document
## "Luxury in its Purest Form — Crafting Timeless Bridal Dreams."

---

## Project Overview

Bliss Couture is a 100% scroll-based interactive bridal couture website for a heritage Zardozi atelier based in Vadodara, Gujarat. The website showcases six bespoke bridal lehengas through a sticky split-screen scroll runway with ambient color transitions, editorial craft storytelling, and a private consultation booking system.

---

## File Structure

```
bliss-couture/
├── index.html              # Single-page scroll website
├── style.css               # Design system & all styles
├── script.js               # Lenis + scroll engine + interactions
├── .cursorrules             # Project rules & design tokens
├── ARCHITECTURE.md          # This file
├── DESIGN-TOKENS.md         # Extracted design token reference
├── COPY-GUIDE.md            # Humanized copy guidelines
├── TEST-PLAN.md             # Testing checklist
└── assets/
    ├── hero.jpg             # Hero section bridal lehenga photograph
    └── lookbook/
        ├── look-01-champagne.jpg
        ├── look-02-haldi.jpg
        ├── look-03-rani.jpg
        ├── look-04-kesariya.jpg
        ├── look-05-nilambari.jpg
        └── look-06-sindoor.jpg
```

---

## Technology Stack

| Layer         | Technology                | Rationale                                       |
|---------------|---------------------------|-------------------------------------------------|
| Structure     | Semantic HTML5            | Accessibility, SEO, zero build step             |
| Styling       | Vanilla CSS (Custom Props)| Full control, no framework dependency           |
| Interaction   | Vanilla JavaScript        | Lightweight, IntersectionObserver-based          |
| Smooth Scroll | Lenis 1.1.x (CDN)        | Inertial smooth scroll, touch support           |
| Typography    | Google Fonts (3 families) | Cormorant Garamond, Outfit, JetBrains Mono      |
| Images        | AI-generated JPEG         | 6 lookbook + 1 hero, all editorial 4:5 ratio    |

---

## Scroll Architecture

### Five Chapters (Single Page Scroll)

| # | Chapter    | ID          | Content                                          |
|---|------------|-------------|--------------------------------------------------|
| 01| Overture   | `#overture` | Hero: split layout, headline, CTA, bridal image  |
| 02| Atelier    | `#atelier`  | Craft grid (4 techniques), editorial quote        |
| 03| Runway     | `#runway`   | 6 sticky split-screen lookbook entries            |
| 04| Artisans   | `#artisans` | Stats, process timeline (4 steps)                 |
| 05| Ledger     | `#ledger`   | Consultation form, contact info, NRI note         |

### Scroll Components

1. **Progress Bar** — 2px fixed top, `--zardozi` fill, width = scroll %
2. **Chapter Index** — Fixed right-side nav, highlights active chapter, shows `00%–100%` counter
3. **Header** — Auto-hide on scroll down, show on scroll up
4. **Runway Color Shift** — IntersectionObserver detects which look is in view, transitions `body.backgroundColor` and stage tint to match each dress palette
5. **Reveal Animations** — IntersectionObserver-driven opacity + translateY transitions with staggered delays

---

## Design Principles

1. **Sharp 90° Geometry** — Zero border-radius on every element. No exceptions.
2. **1px Hairline Borders** — Visual dividers use `#DCD5C7` hairline rules, never box-shadows.
3. **Editorial Typography** — Cormorant Garamond for display, Outfit for body, JetBrains Mono for data/specs.
4. **Daylight Palette** — Warm alabaster canvas, mulberry silk surface, obsidian ink. No neon, no gradients, no dark mode.
5. **Authentic Voice** — All copy written as a heritage Indian bridal couturier from Vadodara. Real craft terms, not Western luxury buzzwords.

---

## Performance Budget

| Metric           | Target    |
|------------------|-----------|
| First Paint      | < 1.5s    |
| LCP              | < 2.5s    |
| CLS              | < 0.1     |
| JavaScript Size  | < 15 KB   |
| CSS Size         | < 25 KB   |
| Total Page Load  | < 4 MB    |

---

## Accessibility

- Semantic HTML throughout
- All images have descriptive `alt` text with craft terminology
- Form inputs have explicit `<label>` elements
- Navigation landmarks with `aria-label`
- `prefers-reduced-motion` disables all animations
- WCAG AA contrast ratios on all text
- Keyboard-navigable chapter index and mobile menu
