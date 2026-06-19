<sub>Capability brief</sub>

# Soteria Forge LMS — Enterprise safety training, built for airport scale

Soteria Forge is a multi-tenant, offline-first, standards-based learning management system engineered for a distributed airport workforce of roughly **1,000 employees** — the ramp crews, baggage handlers, gate agents, and operations staff who keep Hartsfield-Jackson (ATL) moving around the clock. It assumes the conditions you actually operate in: no desks, no reliable signal below-wing, three rotating shifts, and a dozen or more employers sharing one airfield. Training, certification, and audit evidence live in a single system that works whether or not there's a bar of service.

**See how it works ↓**

---

## The 90-second story

It's 04:40. A ramp supervisor checks the board for the 05:00 push and sees a problem: two crew members are showing as lapsed on fall protection, and a third hasn't completed lockout/tagout (LOTO) since transferring in last week. Half the crew is already below-wing, where there's no Wi-Fi and no cell coverage worth the name. Under the old way, this is a scramble — a spreadsheet that's a day stale, a binder of paper sign-offs nobody can find, and a 20-seat classroom that won't open until 08:00. The shift either goes out non-compliant or goes out short.

With Soteria Forge, it's one workflow. The supervisor **assigns** the outstanding modules from a phone before the crew even clocks in. Those crew members **learn offline** — lessons, quizzes, and acknowledgments cached on their devices, completed in a tunnel or on a jet bridge with zero signal. When their devices touch the network again, progress **syncs on reconnect**, the system **certifies** completion with a dated record, and the supervisor watches the names flip to green on a **live dashboard**. No re-watching, no re-keying, no paper. The push goes out on time, and it goes out current.

> Assign → learn offline → sync on reconnect → certify → see it live. One loop, one source of truth.

---

## The operating reality

The constraints aren't edge cases — they're the baseline. Any system that ignores them creates shadow spreadsheets within a month.

| Metric | Value |
| --- | --- |
| Employees to train & recertify | **1,000** |
| Rotating shifts, 24/7 | **3** |
| Desks on the ramp | **0** |

What a platform has to absorb to work here:

- ✓ A **deskless, mobile-first workforce** — training happens on phones and shared tablets, not at workstations
- ✓ **Connectivity dead zones** — tunnels, jet bridges, and below-wing areas where signal simply isn't there
- ✓ **High turnover and continuous onboarding** — new hires arriving every week, not in neat annual cohorts
- ✓ A **multi-employer environment** — multiple companies on one airfield, each needing strict data isolation
- ✓ A **heavy audit load** — OSHA, TSA, and FAA reviews that demand attributable, exportable evidence on demand
- ✓ **Expiring certifications** to track — recurrent training with hard deadlines and no grace for lapses

---

## How the platform answers it

Every constraint above maps to a specific, shipped capability. Nothing here is a roadmap promise; it's how the platform is built.

| Pain point | Capability |
| --- | --- |
| Connectivity dead zones | True offline learning with idempotent sync |
| Onboarding at scale | Bulk roster import + bulk course assignment |
| Multi-employer | Multi-tenant isolation by tenant ID |
| Audit load | Audit trail + xAPI records + dated certificates |
| Recurrent training | Certificate expiry + overdue tracking |
| Hands-on skills | Supervisor practical sign-off |

The hard part isn't any single feature — it's making them dependable together, in the field, at shift change. The offline path is the proof point:

> A handler completes lessons in a tunnel with no signal; records sync automatically on reconnect — nothing re-watched, nothing lost, nothing double-counted.

---

## Capacity & scale at ATL

Built to carry the full ATL footprint without degrading as employers, courses, and devices multiply.

| Capacity (illustrative) | Value |
| --- | --- |
| Employers / tenants isolated | **50+** |
| Courses & micro-lessons | **200+** |
| Median sync reconcile | **<2s** |
| Audit-record completeness | **99.9%** |

The offline-sync architecture is the engineering core. Course content and assignments are cached on the device the moment they're issued, so a worker walking into a dead zone already has everything needed to complete their training. Lesson progress, quiz results, and supervisor sign-offs are recorded **locally** against stable, client-generated IDs — the device never waits on a server to make progress. When connectivity returns, those events sync **idempotently**: each event carries its own identity, so replaying it has no additional effect. A lesson finished once stays finished once, no matter how many times the sync runs or how flaky the link is.

That design makes the common failure modes structurally impossible rather than merely handled. Because completions are keyed by stable client IDs and applied idempotently, there's nothing to re-watch on a dropped connection and nothing to double-count on a retry — the system is conflict-free by construction. Operators don't reconcile spreadsheets; the platform reconciles itself.

![Soteria Forge compliance dashboard showing live training status across ramp crews, with green/amber/red certification states and overdue counts by employer](https://placehold.co/1200x675?text=Soteria+Forge+Compliance+Dashboard)

---

## Capability deep dive

Each capability earns its place by solving something the airfield actually throws at it. Below is the full set, but it's easier to see in motion.

[Product walkthrough (2 min)](https://www.youtube.com/watch?v=dQw4w9WgXcQ) *(placeholder link)*

1. **Offline-first learning with idempotent sync** — content and assignments cache on-device, completions record locally, and events reconcile exactly once when the network returns.
2. **Bulk roster import + bulk course assignment** — onboard hundreds of new hires and push curricula to entire crews in a few clicks, not one record at a time.
3. **Multi-tenant isolation by tenant ID** — every employer's people, progress, and records are partitioned so no tenant can see another's data.
4. **Audit trail + xAPI records + dated certificates** — every learning event is captured as a standards-based statement and rolls up into timestamped, exportable certificates.
5. **Certificate expiry + overdue tracking** — recurrent training deadlines are tracked automatically, surfacing what's lapsing before it lapses.
6. **Supervisor practical sign-off for hands-on skills** — competencies that can't be assessed by a quiz are verified in the field and recorded against the same audit trail.

---

## Rollout timeline

A staged path that proves the hardest mechanic — offline sync — first, then scales outward by population.

| Phase | Timeline | Scope & milestone |
| --- | --- | --- |
| Phase 0 — Pilot | Weeks 1–4 | Single ramp crew; fall protection + LOTO; validate offline sync. |
| Phase 1 — Below-wing ramp | Weeks 5–10 | Full ramp + baggage; bulk roster import. |
| Phase 2 — Terminal-wide | Weeks 11–18 | Gate agents + ops; all core curricula live. |
| Phase 3 — All-tenant | Weeks 19–26 | Every employer onboarded; audit dashboards live. |

The point of starting with a single crew isn't caution for its own sake — it's that you can be live, in the field, capturing real offline completions in **weeks, not quarters**.

---

## Security & compliance

Isolation and auditability are foundational, not add-ons. Every tenant's data is partitioned by tenant ID, so one employer's records are never visible to another. Data is encrypted **in transit and at rest**, access is gated by single sign-on (SSO), and roles follow **least-privilege** principles so people see and do only what their function requires. Behind all of it runs a full, immutable audit trail that records who did what, and when.

That trail is what makes audit day boring — which is the goal. Because every learning event and sign-off is captured as it happens, evidence is assembled continuously rather than reconstructed under deadline pressure.

> Every completion is timestamped, attributable, and exportable for OSHA / TSA / FAA review — assembled as it happens, not reconstructed the night before an inspection.

Standards and controls touched:

- **OSHA** — occupational safety training and recordkeeping
- **TSA** — security-related training evidence
- **FAA** — airfield operational training requirements
- **xAPI records** — standards-based, portable learning statements
- **Dated certificates** — timestamped, attributable proof of completion
- **SOC 2-style access controls** — least-privilege roles, SSO, and audited access

---

## Why Soteria Forge

> We were running ramp safety out of a binder and three spreadsheets that never agreed with each other. With Soteria Forge, "is everyone current?" stopped being a question I had to chase down — it's one live source of truth, and it's right whether or not the crew had signal an hour ago.
>
> — Director of Ramp Safety (composite)

| Differentiator (illustrative) | Value |
| --- | --- |
| Faster onboarding | **40%** |
| Offline completions captured | **100%** |
| Lost records on reconnect | **0** |

What sets it apart:

- **Built for deskless workforces** — designed around phones, shared tablets, and shift work, not office desks
- **Offline-first, not offline-bolted-on** — the sync model is the foundation, so the field case is the default case
- **Multi-employer by design** — tenant isolation is structural, made for shared-airfield operations
- **Audit-ready by default** — evidence accrues automatically; exports are a click, not a project

---

## Final CTA

### Turn "did everyone get trained?" into a live dashboard.

Stop chasing binders and stale spreadsheets. See your real compliance posture, live, across every crew and every employer — including the work that happened with no signal at all.

[**Request a walkthrough**](mailto:hello@example.com)

---

*Soteria Forge LMS — enterprise safety training, built for airport scale. Capability brief prepared for Hartsfield-Jackson Atlanta International (ATL). Metrics labeled "illustrative" are representative, not contractual.*
