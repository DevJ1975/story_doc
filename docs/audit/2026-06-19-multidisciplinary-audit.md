# Multidisciplinary Audit — Soteria Forge story doc

**Date:** 2026-06-19 · **Artifact:** the Soteria Forge interactive "story doc" (live static
reader + seed + spec) · **Method:** four specialist agents (HR · Marketing · Graphics ·
UI/UX) audited independently (Round 1), then cross-critiqued each other (Round 2); a
separate HR × Marketing collaboration then **repositioned** the brief. This report records
the findings, the conflicts and how they were resolved, and what was applied.

---

## Process

1. **Round 1 — independent audits** (report-only). Each lens produced findings + concrete
   before/after fixes.
2. **Round 2 — cross-critique.** Each lens reacted to the other three, defended or conceded
   on conflicts, and returned a reconciled change list.
3. **Repositioning collaboration.** On new direction, HR + Marketing (deep-reasoning)
   produced a complementary reposition: Marketing wrote the copy; HR supplied the substance
   and **claim guardrails**; the guardrails were applied to the copy during integration.
4. **Integration** (single-writer per file) → validate → commit → deploy.

---

## 1. Round-1 findings by lens (condensed)

**HR / People & Compliance**
- Overstated compliance/legal claims ("Audit-ready by default", "OSHA/TSA/FAA aligned") →
  capability verbs ("supports / built to help you stay audit-ready") + disclaimer.
- Fabricated person-attributed testimonial ("Director of Ramp Safety (composite)") → reframe;
  no fabricated named endorser.
- Per-employee analytics (§14) = employee monitoring → needs consent / DNT-GPC / anonymization
  / purpose-limitation guardrail.
- Inclusive, plain-language, multilingual/localization gap; buyer-fit for L&D/HR.
- Publishing a real employee's direct mobile/email = personal data → confirm consent.

**Marketing**
- Hero led with a feature list, not the outcome; no single portable tagline.
- Missing "how it works in 3 steps" band and a standards/social-proof strip.
- **OG image was an SVG** → won't unfurl on Slack/LinkedIn/iMessage; needs a 1200×630 PNG.
- Brochure CTA still pointed to `mailto:hello@example.com`; brochure had no contact section.
- Split "illustrative" vs "by-design" metrics; brand-vertical reconciliation; tagline casing.

**Graphics**
- **WCAG fails:** white-on-Ember CTA = 3.65:1; Ember-on-Cast small text = 3.25:1.
- Brand tokens redeclared in `styles.css` instead of imported from `soteria-forge-brand.css`
  (drift risk); missing `--radius-tile`; off-brand success green `#37B98A`.
- §13 / docs still cited the **stale `#3DA9FC` / `#FF6B1F`** palette.
- Art direction for production OG + dashboard PNGs (embed real Oswald/Barlow at raster).

**UI/UX**
- Brand package not adopted as a single token source (re-declared, fonts imported twice).
- `contact` block shipped but undocumented in §6/registry/Zod; `quote` used but marked P2.
- Image renderer emitted no width/height (CLS); progress bar should be `aria-hidden`;
  whole-doc `aria-live` too broad; table `<th>` lacked `scope`.
- Mobile CTA hidden < 560px with no replacement; OG-as-PNG (with Marketing).

---

## 2. Round-2 cross-critique — conflicts & resolutions

| # | Tension (lenses) | Resolution |
| --- | --- | --- |
| 1 | **CTA contrast fix** — darken fill vs. charcoal-on-ember (Graphics ∩ UI/UX) | **Darken the fill**: `--ember-cta:#BF3D0E` (5.40:1) + hover `#A8350C`; keep white text and the ember identity. Applied to site; recommended for brand `.sf-btn` too. |
| 2 | **Testimonial** — remove vs. keep for social proof (HR ∩ Marketing) | **Keep a quote, drop the fabricated person**: composite, explicitly "illustrative, not a single named customer." |
| 3 | **Claim strength** — hedge vs. punch (HR ∩ Marketing) | Precision over hedging: say what the system *does* ("records a dated, attributable, exportable completion"); never "certified/guaranteed/ADA-compliant." |
| 4 | **`muted` color** — brand `#8A929C` vs reader `#A9B2BC` (Graphics) | Keep `#A9B2BC` for the dark reader (better contrast); documented as a reader-local override. |
| 5 | **Header** — reuse `.sf-header` vs bespoke (Graphics ∩ UI/UX) | Keep the bespoke translucent sticky header; import brand only for **tokens**. |
| 6 | **Analytics consent UX now?** (HR ∩ UI/UX) | render.js implements **no** tracking yet → no live consent UI now; add a §14 guardrail + a footer privacy line; build the gate when `/api/track` lands. |
| 7 | **"3-step" band & new CTAs** — new block types? (Marketing ∩ UI/UX) | **No new block types**: compose from `list`/`stats`/`cta` to keep the registry/Zod contract closed. |
| 8 | **success tone** green vs spark (Graphics ∩ UI/UX) | Marketing/dashboard may keep green status semantics; **marketing chrome** maps positive → Spark. |

---

## 3. Repositioning collaboration (HR × Marketing)

The brief was repositioned from *airport safety/compliance LMS (1,000 employees)* to a
**workforce-development platform for a Unifi-scale ground & terminal services operator
(6,000+ deskless frontline)** — **leadership development, company culture, and
customer-service excellence**, with safety/compliance as one supporting pillar.

- **Marketing** delivered section-by-section copy + the canonical tagline **"Develop the
  people behind every passenger,"** a reframed customer-experience "moment," five pillars,
  and terminal-services image direction.
- **HR** supplied the credible substance — pain economics at 6,000+ (turnover/onboarding
  throughput, leadership-pipeline gaps, engagement, accessibility/sensitive-assistance,
  de-escalation, multilingual/offline access-equity, SLA reporting), a role→development map,
  illustrative KPIs, and the **guardrails** (no fabricated testimonials, label every metric
  *illustrative*, no fear-framing, no legal/accreditation claims, SOC 2 = "in progress
  (pending)," dignity-first on accessibility, privacy-as-development-not-surveillance).
- **Reconciliation:** HR's guardrails were applied verbatim to Marketing's copy during
  integration (every metric labeled illustrative; "built to/supports"; composite testimonial;
  SOC 2 phrased as attestation-in-progress).

---

## 4. Changelog — applied

- **Repositioned** the seed (13 sections) + the no-JS fallback + head/OG/meta + footer to the
  6,000+ terminal workforce-development story; Appendix A re-synced to the seed.
- **SOC 2 Type II — compliance in progress (pending)** added to the trust section + footer.
- **WCAG fixes:** `--ember-cta:#BF3D0E` / hover `#A8350C` for all primary CTAs; `--ember-ink:#B5390D`
  for small ember text on light bands (eyebrows, table headers, numbered markers).
- **a11y:** table `<th scope="col">`; `image` emits `decoding="async"` (+ optional width/height);
  `contact` block gains a `blurb`.
- **Spec sync:** `quote` promoted to MVP; `contact` documented in the §6 catalog.
- **Imagery:** in-doc dashboard relabeled to **frontline readiness by service line** (customer
  service, wheelchair assistance, gate, cabin, ticketing; 6,000+).
- **Brand:** earlier pivot to the official Ember/Charcoal palette + Oswald/Barlow + Forged-Shield
  assets; `themes.json` + HANDOFF theme corrected off the stale blue palette.

---

## 5. Outstanding / recommended next

- **OG image → PNG (1200×630).** Highest-ROI share fix. Blocked locally (no rasterizer/fonts);
  needs the Adobe render path (approval) or an external export.
- **Real terminal-services photos** (wheelchair assistance, passenger service, gate) for the
  hero/sections — via Adobe Stock licensing (approval) or user-provided photos. No
  text-to-image generator is available in this environment.
- **Monica's headshot** — replace `assets/team/monica-green.svg` with the real photo at
  `assets/team/monica-green.jpg`.
- **Vercel deployment protection** — preview is SSO-gated; disable Vercel Authentication for a
  publicly shareable link (Project → Settings → Deployment Protection).
- **Single-source brand tokens** — import `assets/brand/soteria-forge-brand.css` and alias the
  reader's `--ember*` to `--sf-*` (values already match) to end token drift.
- **§14 analytics privacy guardrail** — add consent / DNT-GPC / anonymization to the spec
  before the analytics MVP (M5).
- **Long-form brochure + HANDOFF prose** — reposition to match the live brief (brochure pass
  in progress).
