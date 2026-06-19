# Handoff — "StoryDoc" Clone (React + Next.js)

> **Purpose of this document.** This is a self-contained engineering handoff for a
> separate agent/developer to build a **Storydoc-style interactive document app** from
> scratch in **React + Next.js**. It assumes no access to the conversation that produced
> it. Read it top to bottom, review the resolved decisions in §17, then build to the
> MVP scope in §4 and the acceptance criteria in §15.

---

## Contents

1. [What we're building](#1-what-were-building)
2. [Background: what Storydoc is](#2-background-what-storydoc-is)
3. [Goals & non-goals](#3-goals--non-goals)
4. [MVP scope vs. later phases](#4-mvp-scope-vs-later-phases)
5. [Core concept: the document model](#5-core-concept-the-document-model)
6. [Block (component) catalog](#6-block-component-catalog)
7. [Tech stack](#7-tech-stack)
8. [Architecture](#8-architecture)
9. [Data model](#9-data-model)
10. [Route map (App Router)](#10-route-map-app-router)
11. [The rendering engine](#11-the-rendering-engine)
12. [The editor](#12-the-editor)
13. [Theming & design system](#13-theming--design-system)
14. [Analytics](#14-analytics)
15. [Acceptance criteria (Definition of Done for MVP)](#15-acceptance-criteria-definition-of-done-for-mvp)
16. [Getting started](#16-getting-started)
17. [Resolved decisions (confirmed before building)](#17-resolved-decisions-confirmed-before-building)
18. [Appendix A — Seed content (a real story doc)](#appendix-a--seed-content-a-real-story-doc)
19. [Appendix B — Milestone plan](#appendix-b--milestone-plan)

---

## 1. What we're building

A web app where a user can **create, edit, theme, publish, and track interactive
"story docs"** — scroll-based, responsive, web-native documents that replace static
PDF/PowerPoint decks. Think: a marketing brochure, sales deck, proposal, or report that
lives at a shareable URL, adapts to mobile, embeds video and interactive components, and
reports back who read it and for how long.

The product has three surfaces:

| Surface | Who | What it does |
| --- | --- | --- |
| **Dashboard** | Authors | Create/manage docs, see analytics |
| **Editor** | Authors | Build a doc out of ordered sections and blocks; set theme; publish |
| **Reader** | Recipients | View the published, interactive doc at a public link; engagement is tracked |

A complete, real story doc is provided as **seed content in [Appendix A](#appendix-a--seed-content-a-real-story-doc)** — use it as the first document the app renders and as test data for the analytics pipeline.

---

## 2. Background: what Storydoc is

[Storydoc](https://storydoc.com) is a SaaS tool for building **interactive presentations
and documents** instead of static slides. Its differentiators — and the features worth
cloning — are:

- **Scroll-based, slide-like sections** that combine into one continuous, narrative web page.
- **Interactive components**: embedded video, tabs, image galleries, animated reveals,
  CTAs, lead-capture forms, "book a meeting" embeds.
- **Automatically responsive** — one doc renders well on desktop and mobile without manual layout.
- **Branded themes** — colors, fonts, logo applied consistently across a doc.
- **Personalization** — per-recipient links that inject variables (e.g. a name or company) into the content.
- **Engagement analytics** — who opened it, time spent per section, read-through/completion, CTA clicks, captured leads.
- **Shareable link + embed + PDF export**.

We are cloning the **author → publish → read → measure** loop, not the entire Storydoc
feature surface. See scope in §4.

---

## 3. Goals & non-goals

**Goals**
- Authors can produce a polished interactive doc with **no code**, from a block-based editor.
- Published docs are **fast, responsive, accessible, and SEO/OG-friendly**.
- Authors get **actionable engagement analytics** per doc and per section.
- The codebase is a clean, typed, conventional **Next.js (App Router) + React** app that's easy to extend.

**Non-goals (explicitly out of scope for the first build)**
- Real-time multiplayer co-editing.
- A free-form drag-anywhere canvas (we use a structured section/block model instead — far simpler and more robust).
- E-signature / proposal acceptance flows.
- AI content generation (left as a Phase 3 hook, not built).
- Custom domains per doc, billing/subscriptions, and team org charts/roles.

---

## 4. MVP scope vs. later phases

### MVP (build this first)
1. **Auth** — email magic-link or credentials sign-up/sign-in.
2. **Dashboard** — list, create, duplicate, rename, delete docs; show status (draft/published) and headline stats.
3. **Editor** — add/reorder/delete **sections**; within a section add/reorder/delete **blocks**; edit block content and per-block style; live preview; autosave.
4. **Block catalog** — the MVP subset in §6.
5. **Theme** — pick/customize a theme (colors, font pairing, density) applied to the whole doc; ship 2–3 presets including the "Soteria Forge" brand theme from Appendix A.
6. **Publish + Reader** — publish to a public slug; reader is server-rendered, responsive, with smooth scroll, a progress indicator, and section anchors.
7. **Analytics** — record views, unique viewers, time-per-section, completion, and CTA clicks; show them on a per-doc analytics page.
8. **Sharing** — copy public link; basic personalization variables (`{{first_name}}`, `{{company}}`) via query params.
9. **Seed** — the Appendix A document loads as an example/template.

### Phase 2
- Lead-capture form block + a leads inbox.
- PDF export of a published doc.
- More block types (tabs, accordion, gallery, stats, embed/iframe, calendar embed).
- Password-gated docs; link expiry.
- Per-recipient personalized links with a tracked recipient identity.

### Phase 3
- AI "generate a draft doc from a prompt or pasted markdown".
- Custom domains, team workspaces & roles, billing.

---

## 5. Core concept: the document model

A story doc is **structured JSON**, not free-form HTML. This is the single most important
design decision: it makes the editor, the renderer, analytics anchors, and versioning all
straightforward.

```
Story (doc)
├─ meta: { title, slug, status, ogImage, themeId }
├─ theme: ThemeTokens (or reference to a Theme)
└─ sections: Section[]            // ordered, each ≈ one "slide"/band
     ├─ id, layout, background, paddingScale, anchor
     └─ blocks: Block[]           // ordered components inside the section
          └─ { id, type, props, style? }
```

- A **Section** is a full-width horizontal band (one visual "slide" in the scroll). It owns
  background, vertical rhythm, and an analytics anchor.
- A **Block** is a typed component inside a section (heading, rich text, image, CTA, …).
- The renderer maps `block.type` → a React component. The editor edits the same tree.
- Store the whole tree as a single `jsonb` column (`Story.content`). Validate it with a
  **Zod** schema that is the shared source of truth for editor and renderer.

Keep a versioned `schemaVersion` field on the document so the model can evolve.

---

## 6. Block (component) catalog

Each block is `{ id, type, props, style? }`. Implement the **MVP set** first.

| Block `type` | MVP? | Key props |
| --- | --- | --- |
| `hero` | ✅ | `eyebrow`, `title`, `subtitle`, `media?`, `cta?` |
| `heading` | ✅ | `text`, `level` (1–4), `align` |
| `richText` | ✅ | `html`/portable rich-text JSON (TipTap) |
| `image` | ✅ | `src`, `alt`, `caption?`, `fit` |
| `video` | ✅ | `provider` (youtube/vimeo/mp4), `url`, `poster?` |
| `button` / `cta` | ✅ | `label`, `href`, `variant`, `trackingId` |
| `callout` | ✅ | `tone` (info/success/warn), `title`, `body` |
| `stats` | ✅ | `items: { value, label }[]` |
| `list` | ✅ | `style` (bullet/check/number), `items[]` |
| `divider` / `spacer` | ✅ | `size` |
| `table` | ✅ | `headers[]`, `rows[][]` |
| `quote` | ✅ | `text`, `attribution` |
| `contact` | ✅ | `name`, `credential?`, `role?`, `phone?`, `email?`, `photo?`, `blurb?` |
| `tabs` | ➖ P2 | `tabs: { label, blocks[] }[]` |
| `accordion` | ➖ P2 | `items: { q, a }[]` |
| `gallery` | ➖ P2 | `images[]`, `layout` |
| `embed` | ➖ P2 | `url` (iframe), `aspect` |
| `form` (lead capture) | ➖ P2 | `fields[]`, `submitLabel`, `destination` |
| `calendar` | ➖ P3 | `provider`, `url` |

Every block should support a small shared `style` object (margin scale, alignment,
max-width, background) so authors can adjust without new block types.

---

## 7. Tech stack

Recommended, opinionated defaults. The constraint is **React + Next.js**; the rest is
chosen to minimize bespoke work. See the resolved decisions in §17.

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router) + TypeScript** | Required; RSC + server actions fit the read/render/track loop |
| UI | **React 18+**, **Tailwind CSS**, **shadcn/ui** (Radix primitives) | Fast, accessible, themeable |
| Icons | **lucide-react** | Clean, consistent |
| DB + ORM | **PostgreSQL + Prisma** | Typed schema; `jsonb` for doc content. Neon/Supabase/Vercel Postgres all fine |
| Auth | **Auth.js (NextAuth v5)** | First-class Next.js integration |
| Rich text | **TipTap** (ProseMirror) | Block-friendly rich text editing → JSON |
| Drag & drop | **dnd-kit** | Reorder sections/blocks |
| Editor state | **Zustand** | Lightweight client store for the editor tree |
| Validation | **Zod** | One schema shared by editor + renderer + API |
| Charts (analytics) | **Recharts** | Simple per-section/time charts |
| Hosting | **Vercel** | Native Next.js target; edge + serverless |

> The chosen backend path is **Prisma + Postgres + Auth.js** (see §17); Supabase's
> all-in-one (Postgres + Auth + Storage) was considered but not taken.

---

## 8. Architecture

- **Server Components by default.** The **Reader** (`/v/[slug]`) is a Server Component that
  loads the doc and renders blocks server-side for speed + SEO + OG tags. Only interactive
  blocks (video, tabs, forms, scroll tracking) hydrate as Client Components.
- **Editor is client-side.** The editor is a Client Component tree backed by a Zustand
  store holding the working document; changes **autosave** via a server action (debounced).
- **Server actions for mutations** (create/update/publish doc, submit lead). **Route
  handlers** for the high-volume, fire-and-forget **analytics ingest** (`POST /api/track`)
  and any webhooks.
- **Content is the contract.** The Zod-validated document JSON is the boundary between
  editor and renderer; never render arbitrary HTML strings without sanitizing.
- **Separation of concerns**
  - `lib/blocks/` — block schema (Zod), registry, and the `type → component` map.
  - `components/reader/` — read-only block renderers.
  - `components/editor/` — editable block wrappers + inspector controls.
  - `lib/analytics/` — client tracker + server ingest + aggregation queries.

```
            ┌────────────┐    autosave (server action)    ┌────────────┐
  Author ──▶│   Editor   │ ──────────────────────────────▶│  Postgres  │
            │ (client)   │◀──────── load doc ──────────────│  (Prisma)  │
            └────────────┘                                 └─────▲──────┘
                                                                 │ aggregate
            ┌────────────┐   POST /api/track (events)            │
 Recipient ─▶│  Reader   │ ──────────────────────────────────────┘
            │ (RSC+hydr) │
            └────────────┘
```

---

## 9. Data model

Prisma-style sketch (adapt names as needed). Use `jsonb` for `Story.content` and
`Theme.tokens`.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  stories   Story[]
  createdAt DateTime @default(now())
}

model Story {
  id            String   @id @default(cuid())
  ownerId       String
  owner         User     @relation(fields: [ownerId], references: [id])
  title         String
  slug          String   @unique          // public reader URL: /v/[slug]
  status        Status   @default(DRAFT)  // DRAFT | PUBLISHED | ARCHIVED
  content       Json                       // the Section[]/Block[] tree (Zod-validated)
  themeId       String?
  theme         Theme?   @relation(fields: [themeId], references: [id])
  ogImageUrl    String?
  schemaVersion Int      @default(1)
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  sessions      ViewSession[]
  events        AnalyticsEvent[]
  leads         Lead[]
}

model Theme {
  id      String  @id @default(cuid())
  name    String
  tokens  Json    // colors, fonts, radius, spacing, density
  stories Story[]
}

model ViewSession {
  id         String   @id @default(cuid())
  storyId    String
  story      Story    @relation(fields: [storyId], references: [id])
  visitorId  String   // anon cookie/localStorage id
  recipient  String?  // from personalization link (e.g. name/company)
  referrer   String?
  device     String?
  startedAt  DateTime @default(now())
  lastSeenAt DateTime @default(now())
  completed  Boolean  @default(false) // reached final section
  events     AnalyticsEvent[]
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  storyId   String
  story     Story    @relation(fields: [storyId], references: [id])
  sessionId String
  session   ViewSession @relation(fields: [sessionId], references: [id])
  type      String   // doc_view | section_view | section_time | cta_click | form_submit | doc_complete
  sectionId String?
  value     Float?   // e.g. seconds for section_time
  meta      Json?
  createdAt DateTime @default(now())
}

model Lead {
  id        String   @id @default(cuid())
  storyId   String
  story     Story    @relation(fields: [storyId], references: [id])
  data      Json     // submitted form fields
  createdAt DateTime @default(now())
}

enum Status { DRAFT PUBLISHED ARCHIVED }
```

---

## 10. Route map (App Router)

```
app/
  (marketing)/
    page.tsx                      # public landing
  (auth)/
    login/page.tsx
    signup/page.tsx
  (app)/                          # authenticated; layout guards session
    dashboard/page.tsx            # list/create docs
    editor/[storyId]/page.tsx     # the editor
    analytics/[storyId]/page.tsx  # per-doc analytics
    settings/page.tsx
  v/[slug]/page.tsx               # PUBLIC reader (server-rendered, OG tags)
  api/
    track/route.ts                # POST analytics events (no auth, rate-limited)
    leads/route.ts                # POST lead capture
  layout.tsx
  globals.css

lib/
  blocks/{schema.ts, registry.ts}
  db.ts                           # prisma client
  auth.ts                         # auth.js config
  analytics/{tracker.ts, ingest.ts, queries.ts}
  personalize.ts                  # {{var}} substitution

components/
  reader/<BlockName>.tsx          # read-only renderers
  editor/<...>.tsx                # editable wrappers + inspector
  ui/...                          # shadcn components
```

Prefer **server actions** (colocated in `app/(app)/.../actions.ts`) for doc CRUD/publish
over hand-rolled API routes; keep `/api/track` and `/api/leads` as route handlers.

---

## 11. The rendering engine

The renderer is the heart of the app. Keep it a pure function of the document JSON.

- **Block registry**: `registry[type] = { reader: Component, editor: Component, schema: ZodType, defaultProps }`.
- **Reader** walks `sections[].blocks[]` and renders `registry[block.type].reader`. Unknown
  types render nothing (forward-compatible). Wrap each `Section` with its analytics anchor
  (`data-section-id`) and theme-aware background.
- **Theme** is applied as **CSS variables** on the doc root (`--sd-color-primary`, `--sd-font-display`, …)
  so all blocks style from tokens; no hard-coded colors in blocks.
- **Responsiveness** is automatic: sections are vertical bands; blocks use fluid Tailwind
  classes and CSS grid/flex; media is `max-width: 100%`. No fixed pixel canvas.
- **Rich text** (`richText` block) renders sanitized TipTap JSON → HTML (use a server-safe
  renderer; sanitize with e.g. `isomorphic-dompurify` if emitting HTML).
- **Personalization**: before render, run `personalize(content, vars)` to replace
  `{{first_name}}`/`{{company}}` tokens from the share link's query params.
- **SEO/OG**: the reader page exports `generateMetadata` from the doc's title/`ogImageUrl`.

The same registry powers the editor (renders `registry[type].editor`) — build once, use twice.

---

## 12. The editor

- **Layout**: left = section/block outline (reorderable via dnd-kit); center = live canvas
  (renders the actual reader components, click to select); right = **inspector** (edit the
  selected block's `props` + `style`).
- **State**: Zustand store holds the working `Story.content`. All edits mutate the store;
  a **debounced autosave** (≈800ms) calls the `updateStory` server action. Show a saved/saving indicator.
- **Add block / add section**: "+" affordances; new blocks come from `registry[type].defaultProps`.
- **Rich text**: TipTap editor bound to the `richText` block; persist as TipTap JSON.
- **Theme panel**: edit theme tokens live; changes reflect immediately via CSS variables.
- **Publish**: server action sets `status=PUBLISHED`, `publishedAt`, ensures unique `slug`,
  returns the public URL.
- **Guardrails**: validate the doc with the Zod schema before publish; block publish on invalid content.

Keep the editor a **structured form over JSON**, not a contenteditable canvas — it is far
more reliable and is the correct interpretation of "Storydoc-like" for an MVP.

---

## 13. Theming & design system

- Theme tokens: `{ colors: {primary, accent, bg, surface, text, muted}, font: {display, body}, radius, density }`.
- Apply as CSS variables on the reader/editor root; Tailwind reads them via `theme.extend` or
  arbitrary `var(--sd-*)` values.
- Ship presets: **Soteria Forge** (primary `#3DA9FC`, accent `#FF6B1F` — see Appendix A),
  plus a neutral "Slate" and a high-contrast "Mono". Per §17, **Soteria Forge is the default theme**.
- Fonts via `next/font`. Default pairing: a strong display face + a readable body face.
- Respect `prefers-reduced-motion`; keep animations subtle (fade/slide-in on scroll via IntersectionObserver).

---

## 14. Analytics

The measurable read-through is a core value prop — build it for the MVP.

**Client tracker** (`lib/analytics/tracker.ts`, runs on the reader):
- On load: create/restore a `visitorId` (localStorage) and start a `ViewSession`; emit `doc_view`.
- Use **IntersectionObserver** on each `[data-section-id]` to emit `section_view` and to
  accumulate dwell time, flushed as `section_time` (seconds) on exit/visibility change.
- `cta_click` on tracked buttons; `form_submit` on lead forms; `doc_complete` when the last section is seen.
- Batch events and `POST /api/track` with `navigator.sendBeacon` on `visibilitychange`/unload.

**Server ingest** (`/api/track`): validate, rate-limit, upsert session `lastSeenAt`, insert events. No auth (public reader), but guard against abuse.

**Aggregation + dashboard** (`analytics/[storyId]`):
- Headline: total views, unique visitors, avg. time on doc, completion rate, CTA clicks, leads.
- Per-section bar chart: avg. dwell time and view count (find drop-off).
- Recent sessions list (device, referrer, recipient, time spent, completed?).

---

## 15. Acceptance criteria (Definition of Done for MVP)

A reviewer should be able to:

1. **Sign up / sign in** and land on an empty dashboard.
2. **Create a doc** (blank or from the seed template) and open it in the editor.
3. **Edit**: add/reorder/delete sections and blocks (all MVP block types in §6), edit rich
   text, set a CTA link; changes **autosave** and survive reload.
4. **Theme**: switch to the Soteria Forge preset and tweak a color; the canvas updates live.
5. **Publish** and open the **public reader URL** in a new browser:
   - Renders all MVP blocks correctly.
   - Is **fully responsive** (verify at 375px and 1440px) with smooth scroll + progress indicator.
   - Has correct **title/OG meta**.
   - A personalization link like `?first_name=Jamil&company=ATL` injects those values.
6. **Analytics**: after viewing the public doc and scrolling through, the doc's analytics
   page shows the view, per-section dwell time, completion, and any CTA click.
7. **Seed**: the Appendix A document renders end-to-end as a real example.
8. **Quality bar**: TypeScript strict passes, `next build` succeeds, no console errors on
   reader/editor, Lighthouse a11y ≥ 90 on the reader.

---

## 16. Getting started

```bash
# scaffold
npx create-next-app@latest storydoc-clone --typescript --tailwind --eslint --app --src-dir

cd storydoc-clone

# core deps
npm i @prisma/client next-auth@beta zod zustand @dnd-kit/core @dnd-kit/sortable \
      @tiptap/react @tiptap/starter-kit lucide-react recharts isomorphic-dompurify
npm i -D prisma

# ui
npx shadcn@latest init

# db
npx prisma init        # set DATABASE_URL, then model per §9
npx prisma migrate dev --name init
```

**Env vars** (`.env`):
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...           # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Deploy:** Vercel project from the repo; add the same env vars; attach a Postgres
(Neon/Supabase/Vercel Postgres). The Reader route should be cacheable/ISR where possible;
`/api/track` runs as a serverless function.

---

## 17. Resolved decisions (confirmed before building)

These decisions are now **made**. Build to them directly.

1. **Auth** — **Email magic-link via Auth.js.** Lowest-friction for recipients/authors;
   first-class Next.js integration.
2. **Backend** — **Prisma + Postgres + Auth.js.** Typed schema, `jsonb` for doc content,
   conventional and easy to extend. (Not Supabase.)
3. **Public URL shape** — **`/v/[slug]`.** Simple, shareable; workspace-scoping deferred to
   Phase 3.
4. **Brand** — **Pre-branded "Soteria Forge".** Ship the Soteria Forge dark theme as the
   DEFAULT theme; the Appendix A document is the showcase seed/template. (Generic-clone path
   not taken.)
5. **PDF export** — **Phase 2.**
6. **Image/file uploads** — **External URLs in MVP; uploader + blob storage in Phase 2.**

> Because of decision #4, the default `themeId` is `soteria-forge` and new blank docs adopt
> the Soteria Forge tokens out of the box.

---

## Appendix A — Seed content (a real story doc)

Use this as the first template and as analytics test data. It is a marketing brochure for
an LMS ("Soteria Forge") targeting a large airport operation. The full long-form source is
available as markdown at `docs/soteria-forge-atlanta-airport-brochure.md` in **this**
repository, and the machine-readable copy lives at `docs/seed/soteria-forge-atl.json`;
below is the same content mapped to the **section/block model** so it drops straight into
the renderer. This is the **complete seed** (10 sections, exercising every MVP block) — no
longer abbreviated.

**Suggested theme (Soteria Forge preset):**
```json
{
  "name": "Soteria Forge",
  "tokens": {
    "colors": {
      "primary": "#E8551F",
      "accent": "#FFB552",
      "bg": "#15171B",
      "surface": "#1B1E23",
      "text": "#F4F2EE",
      "muted": "#A9B2BC"
    },
    "font": {
      "display": "Oswald",
      "body": "Barlow Semi Condensed"
    },
    "radius": "18px",
    "density": "comfortable"
  }
}
```

**Document (complete seed — 10 sections, exercises every MVP block):**
```json
{
  "schemaVersion": 1,
  "meta": {
    "title": "Soteria Forge — Develop the people behind every passenger",
    "slug": "soteria-forge-terminal",
    "status": "DRAFT",
    "themeId": "soteria-forge",
    "ogImageUrl": "assets/photos/terminal-concourse.jpg"
  },
  "sections": [
    {
      "id": "s-hero",
      "layout": "hero",
      "background": "gradient",
      "blocks": [
        {
          "id": "b1",
          "type": "hero",
          "props": {
            "eyebrow": "Development brief · Ground & terminal services",
            "title": "Develop the people behind every passenger",
            "subtitle": "The mobile, offline-first platform built to grow leaders, strengthen culture, and raise customer-service standards across a 6,000+ deskless terminal workforce — from the curb to the gate to below-wing.",
            "cta": { "label": "See how we develop at scale", "href": "#develop" }
          }
        },
        {
          "id": "b41",
          "type": "image",
          "props": {
            "src": "assets/photos/terminal-concourse.jpg",
            "alt": "Travelers in a sunlit airport terminal concourse at golden hour, an aircraft departing beyond the glass",
            "caption": "Every shift, across the whole terminal.",
            "width": 1200,
            "height": 630,
            "fit": "cover"
          }
        }
      ]
    },
    {
      "id": "s-story",
      "layout": "single",
      "anchor": "story",
      "blocks": [
        { "id": "b2", "type": "heading", "props": { "text": "A delayed flight, a full concourse, and one agent who's ready", "level": 2 } },
        { "id": "b3", "type": "richText", "props": { "html": "<p>It's 16:10. A weather hold has stacked three flights into one gate. The service desk line is twenty deep — anxious connections, a family with an unaccompanied minor, an elderly traveler waiting on wheelchair assistance, and a businessman who has already lost his patience. To every one of them, the agent at that desk <em>is</em> the airline. <em>Is</em> the airport. Is your company's reputation, live, with no script and no time.</p><p>With Soteria Forge, that agent did a four-minute service-recovery refresher on their phone between shifts this morning — practiced the exact &ldquo;acknowledge, own it, offer a path&rdquo; moves and watched a lead model the wheelchair-assistance handoff. So when the concourse stacks up, they don't freeze. They step in. The minor is reassured, the elderly passenger is moved with dignity, the line eases — and a moment that could have become a complaint becomes the reason someone flies again.</p>" } },
        { "id": "b4", "type": "callout", "props": { "tone": "info", "title": "One loop, everywhere on the floor", "body": "Learn it offline → practice the real moment → get signed off → get recognized → deliver it for the passenger in front of you." } },
        { "id": "b42", "type": "image", "props": { "src": "assets/photos/wheelchair-assistance.jpg", "alt": "An airport assistance agent walking beside an older traveler seated in a wheelchair in a sunlit terminal", "caption": "Sensitive assistance — handled with dignity.", "width": 1400, "height": 933, "fit": "cover" } }
      ]
    },
    {
      "id": "s-pain",
      "layout": "single",
      "anchor": "pain",
      "blocks": [
        { "id": "b5", "type": "heading", "props": { "text": "Every shift, your brand is in the hands of thousands you can't gather in a room", "level": 2 } },
        { "id": "b6", "type": "stats", "props": { "items": [
          { "value": "6,000+", "label": "frontline employees to onboard, develop & re-train" },
          { "value": "24/7", "label": "rotating shifts across one terminal" },
          { "value": "0", "label": "desks for the people who carry your brand" }
        ] } },
        { "id": "b7", "type": "list", "props": { "style": "check", "items": [
          "Onboarding & continuously re-training 6,000+ people through high turnover and seasonal peaks",
          "Inconsistent customer-service quality across a huge, customer-facing frontline — where every interaction is the airline's brand",
          "No leadership pipeline — strong agents promoted to leads and supervisors with little real development",
          "A disengaged, deskless workforce where culture and values are hard to instill at terminal scale",
          "High-stakes accessibility & sensitive-assistance: wheelchair, passengers with disabilities, elderly travelers, unaccompanied minors",
          "De-escalation and service recovery under pressure during delays, weather holds, and IRROPS",
          "A multilingual, mobile-only, varied-literacy workforce inside terminal connectivity dead zones",
          "Multi-employer, per-airline contracts that demand data isolation plus SLA and quality reporting",
          "Proving training completion, service standards, and impact to airline partners and your own leadership"
        ] } }
      ]
    },
    {
      "id": "s-develop",
      "layout": "single",
      "anchor": "develop",
      "background": "surface",
      "blocks": [
        { "id": "b8", "type": "heading", "props": { "text": "What we develop", "level": 2 } },
        { "id": "b9", "type": "richText", "props": { "html": "<p>Soteria Forge isn't a course library. It's a development system organized around the capabilities that decide passenger experience and retention on a terminal floor — three that grow your people, one flagship for your most sensitive service, and a foundation that keeps it all solid.</p>" } },
        { "id": "b10", "type": "table", "props": {
          "headers": ["Pillar", "What we develop"],
          "rows": [
            ["Leadership development", "Turn your best agents into leads and supervisors — coaching, feedback, running a fair shift, and a promotion-ready bench before you need it."],
            ["Culture & engagement", "Make your values legible to a deskless frontline — onboarding, recognition, and a two-way pulse that reaches every shift, in their language."],
            ["Customer-service excellence", "One consistent standard across thousands of people — presence, problem-solving, de-escalation, and service recovery during IRROPS."],
            ["Accessibility & sensitive-assistance", "Dignity-first development for wheelchair/PRM, elderly, and unaccompanied-minor assistance — skill-built and field-verified; supports your ADA and DOT obligations."],
            ["Safety & compliance (foundation)", "Ramp, security, and recurrent requirements — tracked, dated, and audit-ready — handled quietly so development can lead."]
          ]
        } },
        { "id": "b11", "type": "callout", "props": { "tone": "info", "title": "Four pillars grow your people. The fifth keeps the foundation solid.", "body": "All five reach every employee, on the device already in their pocket — on every shift, with or without signal." } }
      ]
    },
    {
      "id": "s-roles",
      "layout": "single",
      "anchor": "roles",
      "blocks": [
        { "id": "b12", "type": "heading", "props": { "text": "Every role on the floor, developed for what matters most", "level": 2 } },
        { "id": "b13", "type": "table", "props": {
          "headers": ["Service line / role", "Development that matters most"],
          "rows": [
            ["Wheelchair / PRM assistance", "Sensitive-assistance, customer empathy, and safe-transfer technique with supervisor sign-off"],
            ["Passenger & customer service", "De-escalation, service recovery, and each airline's brand standard"],
            ["Gate agents", "Composure under delays & IRROPS, boarding accuracy, PRM/UMNR awareness"],
            ["Ticketing & check-in", "Service excellence, accuracy, and accessibility awareness"],
            ["Special services / UMNR", "Sensitive-assistance, safeguarding, and calm communication"],
            ["Baggage & ramp", "Safe operations, teamwork, and offline-first delivery for below-wing crews"],
            ["Cabin appearance", "Quality standards, safe handling, and inclusion in culture & recognition"],
            ["New supervisors & leads", "A &ldquo;first 90 days as a lead&rdquo; pathway: coaching, fair scheduling, recognition"]
          ]
        } }
      ]
    },
    {
      "id": "s-how",
      "layout": "single",
      "anchor": "how",
      "background": "surface",
      "blocks": [
        { "id": "b14", "type": "heading", "props": { "text": "Development that reaches the whole terminal — on every shift, on or off the grid", "level": 2 } },
        { "id": "b15", "type": "table", "props": {
          "headers": ["The reality on the floor", "How Soteria Forge is built to deliver"],
          "rows": [
            ["Terminal connectivity dead zones", "True offline-first mobile learning; progress syncs idempotently on reconnect — nothing re-watched, nothing lost"],
            ["Onboarding & re-training 6,000+ through high turnover", "Bulk roster import + bulk path assignment; new hires productive in days, not cohorts"],
            ["Multilingual, varied-literacy workforce", "Multilingual delivery and audio/visual-first microlearning in low-text formats"],
            ["Inconsistent service quality across roles", "Role-based paths with practical supervisor sign-off — a standard demonstrated, not just clicked"],
            ["Multi-employer / per-airline contracts", "Multi-tenant isolation by tenant ID — each airline's people and data fully partitioned"],
            ["Proving impact to leadership & airline partners", "Live dashboards plus exportable completion, standard, and SLA reporting"],
            ["A workforce that won't sit in a classroom", "3–5 minute microlearning for between-shift, in-the-pocket moments"]
          ]
        } },
        { "id": "b16", "type": "callout", "props": { "tone": "info", "title": "The fit", "body": "An assistance agent completes a sensitive-handoff refresher in a jet-bridge dead zone with zero signal; the completion syncs automatically on reconnect and lands on the leader's dashboard — nothing re-watched, nothing re-keyed, nothing lost." } },
        { "id": "b17", "type": "cta", "props": { "label": "See the rollout", "href": "#rollout", "variant": "outline", "trackingId": "cta-rollout" } }
      ]
    },
    {
      "id": "s-capacity",
      "layout": "single",
      "anchor": "scale",
      "blocks": [
        { "id": "b18", "type": "heading", "props": { "text": "Built to carry the whole terminal — not a pilot crew", "level": 2 } },
        { "id": "b19", "type": "stats", "props": { "items": [
          { "value": "6,000+", "label": "employees developed on one platform" },
          { "value": "8+", "label": "service lines, curbside to ramp to gate" },
          { "value": "95%+", "label": "learning-path completion, terminal-wide (illustrative)" },
          { "value": "3–5 min", "label": "microlearning, sized for a shift" }
        ] } },
        { "id": "b20", "type": "richText", "props": { "html": "<p>Wheelchair &amp; assistance agents, passenger and customer service, gate agents, ticketing, cabin appearance, baggage &amp; ramp, ops &amp; dispatch, and the supervisors who lead them — every role, in every language, on one source of truth.</p>" } },
        { "id": "b21", "type": "image", "props": {
          "src": "assets/dashboard-preview.svg",
          "alt": "Soteria Forge frontline readiness dashboard showing completion, leadership-readiness, and service standards by service line",
          "caption": "Live frontline readiness dashboard (representative)",
          "fit": "cover"
        } }
      ]
    },
    {
      "id": "s-program",
      "layout": "single",
      "anchor": "program",
      "blocks": [
        { "id": "b22", "type": "heading", "props": { "text": "What it feels like — for the agent, and for the leader", "level": 2 } },
        { "id": "b23", "type": "richText", "props": { "html": "<p>Development only works if people actually do it. So we designed for the realities of a shift: short, practical, social, and recognized.</p>" } },
        { "id": "b43", "type": "image", "props": { "src": "assets/photos/customer-service.jpg", "alt": "A smiling airline customer-service agent handing a boarding pass to a traveler at a terminal gate desk", "caption": "One consistent standard, every interaction.", "width": 1400, "height": 933, "fit": "cover" } },
        { "id": "b24", "type": "list", "props": { "style": "number", "items": [
          "Microlearning that fits a shift — 3–5 minute lessons on the phone, downloadable for the dead zones, in the language they prefer",
          "Practice the real moment — scenario reps for de-escalation, service recovery, and sensitive assistance, not multiple-choice trivia",
          "Get signed off in the field — a lead verifies the skill on the floor, so competence is demonstrated, not just clicked",
          "Get recognized — completions and milestones are visible and celebrated, turning development into momentum"
        ] } },
        { "id": "b25", "type": "callout", "props": { "tone": "info", "title": "For the leader", "body": "Coach from one shared playbook, see readiness at a glance — who's developing, who's promotion-ready, where service standards are strong or slipping — and grow the bench before a vacancy opens." } }
      ]
    },
    {
      "id": "s-rollout",
      "layout": "single",
      "anchor": "rollout",
      "blocks": [
        { "id": "b26", "type": "heading", "props": { "text": "Live with one service line in weeks — terminal-wide on a clear path", "level": 2 } },
        { "id": "b27", "type": "table", "props": {
          "headers": ["Phase", "Timeline", "Scope & milestone"],
          "rows": [
            ["Phase 0 — Pilot service line", "Weeks 1–4", "One service line; customer-service excellence + a sensitive-assistance refresher; validate engagement & offline delivery"],
            ["Phase 1 — Service-line cluster", "Weeks 5–10", "Add wheelchair/assistance + gate & ticketing; bulk roster import; first leadership-path cohort"],
            ["Phase 2 — Terminal-wide", "Weeks 11–18", "All service lines incl. ramp/baggage & ops; culture & engagement and the safety foundation to all 6,000+"],
            ["Phase 3 — All airlines / all tenants", "Weeks 19–26", "Every airline contract onboarded as an isolated tenant; SLA & quality dashboards live for partners"]
          ]
        } },
        { "id": "b28", "type": "divider", "props": { "size": "md" } }
      ]
    },
    {
      "id": "s-security",
      "layout": "single",
      "anchor": "security",
      "background": "surface",
      "blocks": [
        { "id": "b29", "type": "heading", "props": { "text": "Built to be trusted by every airline you serve", "level": 2 } },
        { "id": "b30", "type": "richText", "props": { "html": "<p>Every airline contract runs as its own isolated tenant, partitioned by tenant ID, so one partner's people, progress, and records are never visible to another. Development and engagement data is used to grow, recognize, and record-keep — not to monitor; access is least-privilege and SSO-backed, encrypted in transit and at rest, and a supervisor sees their team, not the whole terminal.</p>" } },
        { "id": "b31", "type": "list", "props": { "style": "check", "items": [
          "Multi-tenant isolation by tenant ID — full data separation per airline contract",
          "Dated, attributable completion & sign-off records with a full audit trail",
          "Purpose-limited, transparent learner data — development and recognition, not surveillance",
          "SOC 2 Type II — compliance in progress (pending)",
          "Exportable SLA & quality reporting for your airline partners",
          "Audit-ready records that support OSHA, TSA, FAA, and airline-client review"
        ] } },
        { "id": "b32", "type": "callout", "props": { "tone": "warn", "title": "SOC 2 Type II — compliance in progress (pending)", "body": "We're building Soteria Forge to enterprise-grade standards and pursuing SOC 2 Type II attestation; our security and data-isolation controls are designed to meet that bar today. (SOC 2 is an attestation, not a certification — report available under NDA once issued.)" } }
      ]
    },
    {
      "id": "s-why",
      "layout": "single",
      "anchor": "why",
      "blocks": [
        { "id": "b33", "type": "heading", "props": { "text": "Most platforms train a desk. We develop a terminal.", "level": 2 } },
        { "id": "b34", "type": "quote", "props": {
          "text": "We have thousands of people who never sit at a desk — and they are the experience our airline partners pay for. Soteria Forge is the first thing that actually reaches them: short lessons they'll do, leaders working from one playbook, and a dashboard that finally answers 'are our people ready?'",
          "attribution": "Composite of frontline operations leaders — illustrative, not a single named customer"
        } },
        { "id": "b35", "type": "stats", "props": { "items": [
          { "value": "6,000+", "label": "frontline employees on one development platform" },
          { "value": "40%", "label": "faster onboarding for new frontline hires (illustrative)" },
          { "value": "95%+", "label": "learning-path completion, terminal-wide (illustrative)" }
        ] } },
        { "id": "b36", "type": "list", "props": { "style": "bullet", "items": [
          "Development-first, not compliance-first — leadership, culture, and service lead; safety is the solid floor beneath them",
          "Built for deskless terminal teams — designed around phones, shared devices, shift work, and dead zones",
          "Offline-first, not offline-bolted-on — the field case is the default case",
          "Multi-tenant by design — per-airline isolation and SLA reporting are structural",
          "One standard, 6,000+ people — role-based paths plus field sign-off so a standard is demonstrated, not assumed"
        ] } }
      ]
    },
    {
      "id": "s-contact",
      "layout": "single",
      "anchor": "contact",
      "background": "surface",
      "blocks": [
        { "id": "b37", "type": "heading", "props": { "text": "Let's build your frontline development program", "level": 2 } },
        { "id": "b38", "type": "contact", "props": {
          "name": "Monica Lynn Green",
          "credential": "MBA",
          "role": "Business Development Lead",
          "phone": "216-244-2749",
          "email": "monicalynn@trainovations.com",
          "photo": "assets/team/monica-green.svg",
          "blurb": "Bring your service lines, your turnover numbers, and your airline SLAs — Monica will map a rollout to your terminal. Typically responds within one business day."
        } }
      ]
    },
    {
      "id": "s-cta",
      "layout": "single",
      "anchor": "cta",
      "background": "primary",
      "blocks": [
        { "id": "b39", "type": "heading", "props": { "text": "Turn \"are our people ready?\" into a live answer.", "level": 2, "align": "center" } },
        { "id": "b40", "type": "cta", "props": {
          "label": "Request a walkthrough",
          "href": "mailto:monicalynn@trainovations.com?subject=Soteria%20Forge%20walkthrough",
          "variant": "accent",
          "trackingId": "cta-primary"
        } }
      ]
    }
  ]
}
```

> This seed is now complete: it exercises **every MVP block type** (hero, heading, richText,
> image, video, cta, callout, stats, list, divider, table, quote) and the analytics anchors
> end-to-end — nothing further needs to be extended. The machine-readable copy is at
> `docs/seed/soteria-forge-atl.json` and the theme presets (including the default Soteria
> Forge) at `docs/seed/themes.json`.

---

## Appendix B — Milestone plan

| Milestone | Deliverable |
| --- | --- |
| **M1 — Skeleton** | Next.js app, Tailwind/shadcn, Prisma schema + migration, Auth.js, empty dashboard |
| **M2 — Renderer** | Block registry + Zod schema; Reader route renders the Appendix A seed responsively |
| **M3 — Editor** | Section/block outline, inspector, TipTap, dnd-kit reorder, autosave |
| **M4 — Publish + Theme** | Publish flow, public slug, theme tokens + presets, OG/SEO, personalization |
| **M5 — Analytics** | Client tracker, `/api/track`, aggregation queries, analytics dashboard |
| **M6 — Polish** | A11y pass, Lighthouse, empty/error states, `next build` clean, deploy to Vercel |

---

*End of handoff. Decisions in §17 are confirmed — start at Milestone 1.*
