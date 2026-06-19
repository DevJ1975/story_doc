# StoryDoc Clone — Build Spec & Seed Content

This repo holds the **completed engineering handoff** and the **seed content** for a
Storydoc-style interactive-document app (React + Next.js) — scroll-based, responsive,
web-native documents that replace static PDF/PowerPoint decks. The application itself is
**not yet built**; what lives here is the build-ready spec plus the example document used
as the first template and as analytics test data.

## What's here

| File | What it is |
| --- | --- |
| [`HANDOFF.md`](./HANDOFF.md) | The complete engineering spec — **start here**. Architecture, data model, block catalog, milestones, and resolved decisions. |
| [`docs/soteria-forge-atlanta-airport-brochure.md`](./docs/soteria-forge-atlanta-airport-brochure.md) | Long-form source content for the seed document (the "Soteria Forge" LMS brochure). |
| [`docs/seed/soteria-forge-atl.json`](./docs/seed/soteria-forge-atl.json) | The seed document as the machine-readable section/block tree. |
| [`docs/seed/themes.json`](./docs/seed/themes.json) | Theme presets, including the default **Soteria Forge** theme. |

## Confirmed decisions

These are locked in (see §17 of `HANDOFF.md`):

- **Auth** — email magic-link via Auth.js.
- **Backend** — Prisma + Postgres + Auth.js.
- **Public URL shape** — `/v/[slug]`.
- **Brand** — pre-branded "Soteria Forge"; its dark theme ships as the **default** theme.
- **PDF export** — Phase 2.
- **Image/file uploads** — external URLs in the MVP; uploader + blob storage in Phase 2.

## Next steps

Follow the Appendix B milestones (**M1 Skeleton → M6 Polish**) in
[`HANDOFF.md`](./HANDOFF.md), building to the MVP scope (§4) and acceptance criteria (§15).
