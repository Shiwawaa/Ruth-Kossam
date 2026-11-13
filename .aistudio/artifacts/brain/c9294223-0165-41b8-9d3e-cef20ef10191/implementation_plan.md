# Kossam — Scroll-Controlled Parallax Beverage Showcase

A single-page, scroll-driven product website for **Kossam** cultured yogurt drinks (**Vanille** and **Fraise**), anchored by a full-screen WebP image sequence hero extracted directly from the uploaded studio product videos, paired with a live variant customizer drawer, cart drawer, and dual dark/light theming.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices have been aligned from your clarifications and the visual requirements:
> - **Confirmed Brand & Lineup**: **Kossam** cultured yogurt drinks featuring **01 Vanille** (*Yaourt Onctueux*) and **02 Fraise** (*Yaourt Fraise*), powered by WebP frame sequences extracted from your two uploaded studio videos.
> - **Confirmed Theme Setup**: **Dark Mode default** (`#09090B` / `#000000` obsidian studio backdrop) with a working **Light/Dark mode toggle** in the navigation bar and **per-flavor accent colors** (Warm Vanilla Cream `#E6C280` for Vanille; Berry Crimson `#E11D48` for Fraise).
> - **Confirmed Interactive Scope**: Includes a **Live Customizer Drawer** (allowing visitors to edit drink name, subtitle, description, accent color, dark/light mode, and custom WebP sequence paths/frame counts on the fly) plus a **generated square (`1:1`) CTA product image**.

---

## 1. Overview & Core Concept

- **What It Does**: Delivers a high-impact beverage launch experience where scrolling the page scrubs backward and forward through a 120-frame WebP studio splash animation in the hero, followed by product storytelling, ingredient transparency, a dynamic nutrition label, customer reviews, an FAQ accordion, a final CTA spotlight with a square studio product image, and a contact/wholesale form.
- **Target Audience**: Direct-to-consumer beverage shoppers and retail buyers evaluating artisanal, probiotic dairy drinks, as well as brand teams testing flavor copy, color themes, and custom WebP sequences live.
- **Key Value**: Combines cinema-grade scroll-scrubbed product motion with instant flavor switching, zero-flicker frame preloading, and a live studio customizer without compromising editorial legibility or layout precision.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Zero-Flicker Preload**: Upon arrival, a full-screen loading overlay displays the **KOSSAM** wordmark, a horizontal progress bar, and a live percentage counter (`Loading 0%` → `100%`) while the active variant's WebP sequence is fetched and decoded. The hero only reveals once preloading completes.
2. **Scroll-Scrubbed Parallax Hero**: A sticky `100vh` stage nested inside a `320vh` scroll track maps vertical scroll progress (`0.0 → 1.0`) directly to WebP frame indices (`0 → N-1`) rendered on a full-bleed `<canvas>`. Scrolling down drives the bottle splash forward; scrolling up reverses it smoothly.
3. **Right-Side Variant Navigation**: Clicking `PREV` or `NEXT` beside the oversized `01` / `02` index number fades out the current copy, switches theme accent and optional mode override, loads the target variant's WebP sequence (showing a subtle inline loading indicator beside `PREV/NEXT` while fetching), and fades in the new flavor details.
4. **Live Customizer & Cart Flows**:
   - Clicking **Customize** opens a slide-over studio panel to modify brand name, variant copy, accent color, dark/light mode, or custom WebP sequence URL pattern + frame count, or add a new variant.
   - Clicking **Add to Cart** adds the active flavor pack to a slide-over shopping bag drawer with quantity steppers, subtotal calculation, and order confirmation state.

### Visual Identity & Theme

- **Aesthetic Direction**: High-contrast editorial studio showcase—pure obsidian black stages in dark mode (`#09090B` canvas, `#121216` elevated surfaces) and warm chalk off-white in light mode (`#FAFAF9` canvas, `#FFFFFF` cards), letting the dairy splash photography command the center of the viewport.
- **Color Tokens & 60-30-10 Discipline**:
  - *60% Dominant Neutral*: `--background` (`#09090B` dark / `#FAFAF9` light).
  - *30% Structural Surfaces*: `--surface` (`#121216` dark / `#FFFFFF` light) with subtle hairline borders (`rgba(255,255,255,0.08)` dark / `rgba(15,23,42,0.08)` light).
  - *10% Dynamic Brand Accent*: `--accent` dynamically bound to the active variant's theme color (editable live in the customizer).
- **Typography & Hierarchy**:
  - *Display Headline*: `Oswald` (bold uppercase condensed display for `VANILLE` / `FRAISE` hero titles and oversized `01` / `02` flavor indices, paired with `text-wrap: balance`).
  - *Body & Editorial Prose*: `Plus Jakarta Sans` (clean geometric readability at `15px–16px`, optical weight compensation in dark mode).
  - *Numeric Data & Nutrition*: `JetBrains Mono` / `tabular-nums` for loading percentages, flavor indices, nutrition fact values, and pricing.
- **Layout & Overlay Governance**:
  - **Hero Contrast**: A measured left-side gradient scrim ensures `>= 4.5:1` contrast for the overlay text block without obscuring the central rotating bottle and splash.
  - **Sticky Top Bar**: Three clean zones—Brand wordmark on the left, smooth-scroll section links (`Product`, `Ingredients`, `Nutrition`, `Reviews`, `FAQ`, `Contact`) with active scroll-spy indicator, and compact right-side Theme Toggle + Bag trigger.

### Interactive Feedback & Motion

- All button hovers, accordion transitions, and variant text cross-fades use compositor-only `transform` and `opacity` transitions settling within `150–200ms` (`cubic-bezier(0.16, 1, 0.3, 1)`), respecting `prefers-reduced-motion`.
- Contact and checkout forms validate required inputs and show explicit confirmation states.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pre-Extracted Static WebP Sequences vs. Real-Time Video Seeking**
  - *Chosen Approach*: Extract each uploaded MP4 (`1280×720`) into a 120-frame `.webp` image sequence (`frame_0001.webp` … `frame_0120.webp`) and render them onto a `<canvas>` element on scroll.
  - *Why*: HTML5 `<video>` scrubbing suffers from keyframe decode stalls and reverse-scrubbing stutter across browsers. Preloaded WebP frames rendered via `canvas.drawImage()` deliver instantaneous bidirectional frame-accurate scrubbing, genuine percentage-based preloading, and direct compatibility with custom external WebP URL sequences.
  - *Alternatives Considered*: Seeking `<video currentTime>` on scroll (rejected due to choppy reverse playback in Safari/Chrome).

- **Decision 2: CSS Custom Properties + Tailwind v4 `@custom-variant dark` Dual-Theme System**
  - *Chosen Approach*: Declare `@custom-variant dark (&:where(.dark, .dark *));` and bind dynamic flavor accents to `--brand-accent` CSS variables alongside paired dark/light utility classes.
  - *Why*: Prevents split-brain contrast bugs when switching modes globally or via per-variant overrides while allowing live color picking in the Customizer Drawer without page reloads.

- **Decision 3: Square CTA Product Visual via Image Generation**
  - *Chosen Approach*: Generate a bespoke `1:1` studio pop-art product visual featuring a vibrant monochrome gradient backdrop, centered Kossam bottle, and glossy fruit piled across the base—placed in the Final CTA spotlight section.
  - *Why*: Gives the conversion block a tactile, color-blocked retail presence distinct from the dark-stage parallax hero.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Hierarchy

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ App State & Persistence (Variants Config, Active Index, Theme, Cart)    │
└───────┬──────────────────────────┬───────────────────────────┬──────────┘
        │                          │                           │
        ▼                          ▼                           ▼
┌───────────────┐        ┌───────────────────┐       ┌────────────────────┐
│ Fullscreen    │        │ Sticky Top Navbar │       │ Slide-Over Drawers │
│ Preloader     │        │ · Wordmark        │       │ · Live Customizer  │
│ · Progress %  │        │ · Scroll-Spy Nav  │       │ · Shopping Cart    │
└───────┬───────┘        │ · Theme & Cart    │       └────────────────────┘
        │                └─────────┬─────────┘
        ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Parallax Hero Stage (320vh Track -> Sticky 100vh Viewport)              │
│ · <canvas> WebP Frame Renderer (mapped to scrollYProgress 0.0 -> 1.0)   │
│ · Left Overlay Block (Name, Subtitle, Copy, 2 Rounded CTAs)             │
│ · Right Variant Nav (Index 01/02 + PREV/NEXT + Inline Loader)           │
│ · Bottom Center Minimal Social Icons                                    │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Below-Fold Editorial & Conversion Sections                              │
│ · Product Story (#product)   · Ingredients & Benefits (#ingredients)    │
│ · Dynamic Nutrition Label (#nutrition) · Verified Reviews (#reviews)    │
│ · FAQ Accordion (#faq)       · Square CTA Spotlight & Contact (#contact)│
│ · Solid Black Footer (#000000)                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **BrandConfig**: `brandName`, `brandDescription`, `defaultMode` (`dark` | `light`), `activeMode`.
- **DrinkVariant**: `id`, `name`, `subtitle`, `description`, `themeColor` (hex), `modeOverride` (`inherit` | `dark` | `light`), `sequencePattern` (URL template with frame number placeholder), `frameCount`, `price`, `nutrition` (serving size, calories, protein, carbs, sugars, calcium, probiotics), `ingredients`, and `benefits`.
- **Sequence Cache**: In-memory `Map<string, HTMLImageElement[]>` storing decoded frames per variant so revisiting a flavor switches instantaneously without re-downloading.
- **Cart State**: Array of `{ variantId, packSize, quantity, unitPrice }` persisted cleanly in component/local state with live item count badge and subtotal.

### Interactive Component & State Mapping

- **WebP Sequence Loader Hook**: Preloads frames concurrently in controlled batches, updates `loadProgress` (`0–100%`), handles per-frame fallback cleanly if a custom URL fails, and triggers `onReady` for the hero reveal.
- **Scroll-to-Frame Synchronizer**: Listens to passive `scroll` events + `requestAnimationFrame` on the hero container ref, computing normalized progress and drawing the closest decoded frame (`cover` aspect fit) onto the HiDPI `<canvas>`.
- **Customizer Handlers**: Real-time controlled inputs update `BrandConfig` and the active `DrinkVariant`, immediately re-theming `--brand-accent`, HTML `.dark` class, hero copy, and triggering sequence reload if the sequence URL or frame count is edited.
