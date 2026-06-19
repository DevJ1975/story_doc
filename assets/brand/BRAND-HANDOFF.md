# Handoff: Soteria Forge — Logo & Brand Mark

## Overview
This package contains the **Forged Shield** logo for **Soteria Forge**, a safety & compliance LMS for construction and high-risk industries. The mark is a shield folded from hot steel with a forge flame at its core — combining the three brand motifs: **shield** (Soteria / protection), **forge spark** (Forge / making), and the flame's implied **S-curve**.

The goal of this handoff is to integrate the logo into the **Soteria Forge LMS codebase**: app header (light + dark), favicon / app icons, marketing site, and certificate templates.

## About the Design Files
The files in `reference/` are **design references created in HTML** — they show the intended look, not production code to copy verbatim. Recreate the logo in the LMS's existing environment (React/Vue/etc.) using its established component and asset conventions. If no front-end environment exists yet, choose the most appropriate framework for the project.

**The production assets you should ship are the SVGs in `assets/`** — they are clean, self-contained, and framework-agnostic. Drop them in directly or convert to a React/Vue icon component.

**To apply the brand styling to the site, use `assets/soteria-forge-brand.css`** — it declares every design token as a CSS custom property, imports the two brand fonts, and ships ready-made classes for the logo lockup, header, app tiles, buttons, progress bars, cards, and focus rings. Import it once at the app root, then either use the `--sf-*` variables inside your existing component styles or apply the `.sf-*` classes directly. If the site uses a token system (Tailwind config, theme object, SCSS vars), copy the values from the `:root` block into it instead of importing the file wholesale.

## Fidelity
**High-fidelity.** Colors, geometry, and typography are final. Match them exactly.

## Assets (production-ready, in `assets/`)
| File | Use |
|---|---|
| `soteria-forge-mark.svg` | Full-color shield mark. Primary icon — app header, favicon source, app tiles. Self-contained (gradients inline). |
| `soteria-forge-mark-mono.svg` | One-color shield (flame knocked out via `fill-rule:evenodd`). Uses `fill: currentColor` — set `color` to recolor. For certificates, embossing, foil, single-color print, reversed-on-color. |
| `soteria-forge-lockup-horizontal.svg` | Mark + "SOTERIA FORGE" wordmark, horizontal. Text is live Oswald 700 — **load the Oswald font or convert text to outlines** before using as a static asset. |
| `soteria-forge-brand.css` | Brand stylesheet — `--sf-*` design tokens, font imports, and `.sf-*` helper classes (logo, header, tile, button, progress, card). Import once at the app root. |

### PNG exports (in `png/`)
Ready-to-use raster files, transparent background unless noted:
- `png/mark-color/` — full-color mark at **1024, 512, 256, 128, 64, 48, 32, 16 px**
- `png/mark-mono-charcoal/` — one-color charcoal (`#1B1E23`) mark at 1024–128 px (certificates, single-color print)
- `png/mark-mono-white/` — reversed white mark at 1024–128 px (dark backgrounds)
- `png/app-icons/` — `app-icon-charcoal-512/192`, `apple-touch-icon-180` (charcoal tiles), `app-icon-ember-512` (ember tile, white mark)
- `png/lockup/` — horizontal logo + wordmark on `soteria-forge-lockup-light.png` (white) and `-dark.png` (charcoal)

The `-mono` SVG is the most flexible for app code: `<SoteriaMark style={{ color: '#1B1E23' }} />` renders charcoal; `color:'#fff'` renders reversed.

## The Mark — construction notes
- Drawn on a **120×120 viewBox**. Shield path: `M60,12 L100,25 V58 C100,85 83,104 60,112 C37,104 20,85 20,58 V25 Z`
- Full-color version uses two left/right "fold" planes (`#AE3A14` shadow, `#DC481B` mid) over an ember gradient, a top light-catch bevel (`#FFC774`), a cream flame (`#FFE6B0→#F8D38A`), an inner ember tongue (`#E8551F`), and a 3px charcoal outline (`#1B1E23` @ 90%).
- **Minimum size: 16px** on screen, **10mm** in print. The mark is tuned to stay legible at favicon scale — verified at 16/32/64px.
- **Clear space:** keep at least `x` on all sides, where `x` = ⅓ of the mark's height.

## Logo Lockups
- **Horizontal** (primary): mark + wordmark side by side, vertically centered. Gap ≈ 0.25× mark width.
- **Stacked**: mark centered above wordmark; optional `SAFETY · COMPLIANCE` micro-label beneath.
- **Icon only**: header on tight widths, favicon, app tile, avatar.
- **Wordmark**: "SOTERIA" in charcoal `#1A1D22`, " FORGE" in ember `#E8551F` (one leading space). On dark backgrounds use `#F4F2EE` / `#FF7A3D` respectively.

## Typography
- **Wordmark & headings:** **Oswald** 700 (Google Fonts). Condensed, upright, safety-signage feel. Letter-spacing ≈ `0.01em`.
- **Taglines / labels / UI support:** **Barlow Semi Condensed** 600 (Google Fonts). Used for the `SAFETY · COMPLIANCE · TRAINING` tagline at wide tracking (`0.32em`, uppercase, `#8A929C`).

## Design Tokens
```
Color
  --ember:     #E8551F   /* primary brand / FORGE word / accents */
  --ember-hot: #FF7A3D   /* ember on dark backgrounds */
  --spark:     #FFB552   /* secondary accent, highlights */
  --charcoal:  #1B1E23   /* ink, dark backgrounds, app tile */
  --ink:       #1A1D22   /* SOTERIA word, headings on light */
  --steel:     #3A4048   /* secondary UI */
  --cast:      #F6F1E9   /* warm paper / certificate ground */
  --surface:   #F6F5F6   /* light neutral surface */
  --hairline:  #DDDCDE   /* borders */

Mark gradients
  ember fill:  linear #F69A3C → #D8451A
  flame fill:  linear #FFE6B0 → #F8D38A

Type
  Oswald 700 — wordmark, headings
  Barlow Semi Condensed 600 — taglines, labels, UI

Radius (in mocks)
  app tile: 24px   cards: 18–22px   chips/swatches: 10–12px
```

## In-context targets
1. **LMS header (dark):** charcoal `#15171B` bar, 34px mark + 19px Oswald wordmark (`SOTERIA` `#F4F2EE` / `FORGE` `#FF7A3D`) at left; nav + avatar at right.
2. **Favicon / app icon:** charcoal `#1B1E23` tile, 24px radius, full-color mark centered at ~63% of tile. Also an "ember tile" variant (ember gradient bg + white mono mark). Generate 16/32/180(apple-touch)/512 from `soteria-forge-mark.svg`.
3. **Certificate:** mono mark in charcoal on warm `#F6F1E9` ground, intended for emboss/foil; pairs with `CERTIFICATE OF COMPLETION` in Oswald 700.

## Files in this package
- `assets/soteria-forge-mark.svg` — full-color mark
- `assets/soteria-forge-mark-mono.svg` — one-color mark (currentColor)
- `assets/soteria-forge-lockup-horizontal.svg` — horizontal lockup
- `reference/Soteria Forge Logo — Forged Shield.dc.html` — the full kit (lockups, app icons, clear space, in-context). Open in a browser to view (`support.js` included).
- `reference/Soteria Forge Logo — All Concepts.dc.html` — the original 5-concept exploration, for context on the direction chosen (Concept 04).

## Implementation suggestions
- **Apply the styling:** import `assets/soteria-forge-brand.css` at the app root (or fold its `:root` tokens into your Tailwind/theme/SCSS config). Example header markup it powers:
  ```html
  <link rel="stylesheet" href="/brand/soteria-forge-brand.css">

  <header class="sf-header">
    <a class="sf-logo" href="/">
      <img class="sf-logo__mark" src="/brand/soteria-forge-mark.svg" alt="">
      <span class="sf-wordmark">SOTERIA<span class="forge"> FORGE</span></span>
    </a>
    <nav><!-- Courses · Records · avatar --></nav>
  </header>

  <!-- course progress -->
  <div class="sf-progress"><div class="sf-progress__fill" style="width:64%"></div></div>
  <button class="sf-btn">Resume module</button>
  ```
- Wrap `soteria-forge-mark-mono.svg` as an icon component so `color` drives it; use the full-color SVG where the gradient should always show (favicon, marketing hero).
- Load Oswald + Barlow Semi Condensed via the app's existing font pipeline; don't bake the wordmark into the color mark — keep mark and type as separate elements so the wordmark stays selectable/translatable.
- For favicons, rasterize `soteria-forge-mark.svg` at 16/32/180/512 rather than shipping the SVG as the only favicon (older browsers).
