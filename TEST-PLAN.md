# BLISS COUTURE — Test Plan

## Test Scope

Full-page scroll-based bridal couture website testing across visual quality, interaction fidelity, accessibility, and performance.

---

## 1. Visual & Design Tests

### 1.1 Sharp Geometry Compliance
- [ ] Zero `border-radius` on ALL elements (buttons, images, cards, inputs, containers)
- [ ] No rounded corners visible anywhere on the page
- [ ] All images maintain `aspect-ratio: 4/5` (portrait) or `16/9` (wide)
- [ ] All `1px solid #DCD5C7` hairline borders render crisply

### 1.2 Color Palette Compliance
- [ ] Page background matches `#F8F5EE` (--canvas)
- [ ] Section surfaces match `#EFEAE0` (--surface)
- [ ] Primary text color is `#14110F` (--ink)
- [ ] Muted text color is `#6A6359` (--muted)
- [ ] Zardozi accent color is `#8E652E`
- [ ] Crimson accent color is `#6E141B`
- [ ] No AI-purple, no neon gradients, no generic blue anywhere

### 1.3 Typography Compliance
- [ ] Display headlines render in Cormorant Garamond
- [ ] Body text renders in Outfit
- [ ] Mono/spec text renders in JetBrains Mono
- [ ] All three Google Fonts load correctly
- [ ] Italic display text does not clip descenders (g, y, p, q, j)

### 1.4 Layout Compliance
- [ ] Max content width is 1400px
- [ ] No horizontal scrollbar on any viewport width
- [ ] No content overflow on mobile (375px)
- [ ] Header is single-line, 68px height
- [ ] Hero fits within initial viewport on desktop

---

## 2. Interaction Tests

### 2.1 Scroll Progress Bar
- [ ] Fixed at top of page, 2px height
- [ ] Width tracks scroll position 0%–100%
- [ ] Color is `--zardozi` (`#8E652E`)

### 2.2 Chapter Index (Desktop)
- [ ] Fixed on right side, vertically centered
- [ ] Active chapter highlights correctly as user scrolls
- [ ] Chapter counter updates (01–05)
- [ ] Scroll percent counter updates (00%–100%)
- [ ] Clicking a chapter link smooth-scrolls to that section

### 2.3 Lenis Smooth Scroll
- [ ] Smooth inertial scrolling works on wheel input
- [ ] Smooth scrolling works on trackpad
- [ ] Touch scrolling works on mobile
- [ ] No jarring jumps or stutter
- [ ] Anchor links scroll smoothly with header offset

### 2.4 Header Behavior
- [ ] Header hides on scroll down (after 100px threshold)
- [ ] Header shows on scroll up
- [ ] Header background has blur effect
- [ ] Header border-bottom is visible

### 2.5 Mobile Menu
- [ ] Hamburger button visible on tablet (< 1024px) and mobile
- [ ] Menu opens/closes on button click
- [ ] Menu links scroll to correct sections
- [ ] Menu closes after link click
- [ ] Body scroll locked when menu is open

### 2.6 Runway Scroll Color Transitions
- [ ] Body background color transitions when each look enters viewport
- [ ] Color transitions are smooth (0.8s ease)
- [ ] Background resets to default when scrolling out of runway section
- [ ] Look-specific stage backgrounds update correctly
- [ ] All 6 looks trigger their correct color palettes

### 2.7 Reveal Animations
- [ ] Headlines reveal with upward slide + fade
- [ ] Body text reveals with fade
- [ ] Cards reveal with staggered upward slide
- [ ] Hero image reveals with scale + fade
- [ ] Process step top border draws from left to right
- [ ] Animations trigger only once (on first viewport entry)

### 2.8 Form Submission
- [ ] Form validates required fields (Bride's Name, WhatsApp Number)
- [ ] Submit button opens WhatsApp with pre-filled message
- [ ] WhatsApp message includes all form field values
- [ ] Date picker works correctly

---

## 3. Accessibility Tests

### 3.1 Semantic HTML
- [ ] Single `<h1>` on the page (hero headline)
- [ ] Proper heading hierarchy (h1 → h2 → h3 → h4)
- [ ] All navigation uses `<nav>` with `aria-label`
- [ ] Main content wrapped in `<main>`
- [ ] Footer uses `<footer>`

### 3.2 Images
- [ ] All `<img>` tags have descriptive `alt` text
- [ ] Alt text includes craft-specific terminology
- [ ] Hero image has `loading="eager"`
- [ ] Lookbook images have `loading="lazy"`

### 3.3 Forms
- [ ] All inputs have explicit `<label>` elements
- [ ] Labels use `for` / `id` matching
- [ ] Placeholders are not used as labels
- [ ] Focus states are visible (border-bottom changes to `--ink`)

### 3.4 Contrast
- [ ] Primary text (`#14110F`) on canvas (`#F8F5EE`): passes AA ✓
- [ ] Muted text (`#6A6359`) on canvas (`#F8F5EE`): passes AA ✓
- [ ] Button text (white on `#14110F`): passes AA ✓
- [ ] Crimson CTA (white on `#6E141B`): passes AA ✓

### 3.5 Motion
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] Static layout is fully usable without animations

### 3.6 Keyboard Navigation
- [ ] Tab order follows visual layout
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible
- [ ] Mobile menu can be triggered via keyboard

---

## 4. Responsive Tests

### 4.1 Desktop (1440px+)
- [ ] Full 2-column layouts render correctly
- [ ] Chapter index visible on right side
- [ ] 4-column craft grid displays properly
- [ ] Runway split-screen layout works

### 4.2 Tablet (768px–1024px)
- [ ] Chapter index hidden
- [ ] Header nav hidden, mobile menu button shown
- [ ] Craft grid collapses to 2 columns
- [ ] Runway collapses to single column (stacked)
- [ ] Stats grid collapses to single column
- [ ] Process timeline collapses to 2 columns

### 4.3 Mobile (< 640px)
- [ ] All grids collapse to single column
- [ ] CTAs stack vertically
- [ ] Hero image moves above text
- [ ] Form row splits to single column
- [ ] Footer stacks vertically
- [ ] No horizontal overflow

---

## 5. Performance Tests

### 5.1 Loading
- [ ] Lenis CDN loads successfully
- [ ] Google Fonts load with `display=swap`
- [ ] Hero image loads eagerly, lookbook images load lazily
- [ ] No render-blocking resources

### 5.2 Runtime
- [ ] Scroll interactions run at 60fps
- [ ] No jank during runway color transitions
- [ ] IntersectionObserver is efficient (no per-frame computation)
- [ ] Memory usage stays stable during scroll
