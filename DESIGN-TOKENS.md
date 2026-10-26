# BLISS COUTURE — Design Tokens Reference

## Color Palette

### Core Palette
| Token       | Hex       | Name                              | Usage                                |
|-------------|-----------|-----------------------------------|--------------------------------------|
| `--canvas`  | `#F8F5EE` | Warm Alabaster / Mihrab Arch Ivory| Page background, hero canvas         |
| `--surface` | `#EFEAE0` | Raw Mulberry Silk / Sandstone     | Cards, alternate sections, NRI note  |
| `--ink`     | `#14110F` | Stag Crest Obsidian Charcoal      | Primary text, headlines, buttons     |
| `--muted`   | `#6A6359` | Warm Stone Grey                   | Body text, labels, secondary info    |
| `--timber`  | `#2A1A12` | Vadodara Studio Walnut            | Button hover, deep accent            |
| `--zardozi` | `#8E652E` | Antique Zardozi Bronze            | Progress bar, accent labels, CTAs    |
| `--crimson` | `#6E141B` | Sindoor Pheras Crimson            | Flagship accent, reserve CTA         |
| `--hairline`| `#DCD5C7` | 1px divider color                 | All borders, dividers, separators    |

### Runway Dress Pigments (Scroll-Driven)
| Look | Name                     | Canvas    | Stage     | Swatch    |
|------|--------------------------|-----------|-----------|-----------|
| 01   | Champagne Tissue Gold    | `#F8F5EE` | `#EFEAE0` | `#B89758` |
| 02   | Haldi Marigold Mirror    | `#F7F3E6` | `#EDE7D5` | `#C99E32` |
| 03   | Rani Pink Silver Zardozi | `#F9F1F2` | `#F0E4E6` | `#9E244B` |
| 04   | Kesariya Peach Kundan    | `#F9F3EC` | `#EFE6DC` | `#C88A55` |
| 05   | Nilambari Royal Cobalt   | `#F0F3F8` | `#E3E8F0` | `#1A3A6B` |
| 06   | Sindoor Mahal Crimson    | `#F8F0EF` | `#F0E2E0` | `#6E141B` |

---

## Typography

| Role       | Font Family         | Weight    | Size Range              | Tracking      |
|------------|---------------------|-----------|-------------------------|---------------|
| Display    | Cormorant Garamond  | 300–700   | `clamp(2.5rem, 6vw, 5.5rem)` | `-0.02em` |
| Body       | Outfit              | 200–600   | `0.85rem–1rem`          | Normal        |
| Mono/Specs | JetBrains Mono      | 300–500   | `0.55rem–0.7rem`        | `0.15–0.25em` |

### Font Pairing Rationale
- **Cormorant Garamond** — Heritage serif justified by the brand's editorial luxury bridal identity. Used only for display headlines and quotes. Not Inter. Not generic sans-serif.
- **Outfit** — Modern geometric sans-serif for body copy, navigation, and buttons. Clean counterpart to the ornate display serif.
- **JetBrains Mono** — Monospace for spec tables, chapter indices, counters, and measurement data. Precision feel for craft specifications.

---

## Spacing Scale

| Token           | Value                        | Usage                          |
|-----------------|------------------------------|--------------------------------|
| `--gutter`      | `clamp(1.25rem, 4vw, 3rem)` | Page side padding              |
| `--section-py`  | `clamp(4rem, 10vh, 8rem)`   | Section vertical padding       |
| `--max-width`   | `1400px`                     | Content max width              |

---

## Shape System

| Element      | Border Radius | Notes                          |
|--------------|---------------|--------------------------------|
| ALL elements | `0px`         | Sharp 90° geometry throughout  |
| Buttons      | `0px`         | 1px solid borders              |
| Images       | `0px`         | 1px solid hairline border      |
| Cards        | `0px`         | Hairline border separators     |
| Inputs       | `0px`         | Underline-only style           |

---

## Border System

| Type      | CSS                          | Usage                |
|-----------|------------------------------|----------------------|
| Hairline  | `1px solid #DCD5C7`         | Section dividers     |
| Image     | `1px solid #DCD5C7`         | Photo frames         |
| Active    | `1px solid #14110F`         | Focus states         |
| Accent    | `1px solid #8E652E`         | Process step reveals |

---

## Transition Tokens

| Token              | Value                              | Usage                    |
|--------------------|------------------------------------|--------------------------|
| `--ease-out`       | `cubic-bezier(0.16, 1, 0.3, 1)`   | Reveal animations        |
| `--ease-in-out`    | `cubic-bezier(0.65, 0, 0.35, 1)`  | Color transitions        |
| `--duration`       | `0.7s`                             | Standard reveal          |
| `--duration-fast`  | `0.35s`                            | Hover, focus states      |
