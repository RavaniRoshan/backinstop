# Agent.md — Execution Context for the Backstop Site

> Companion to `AGENTS.md`. This file describes the current execution state and
> the key decisions, for any agent or human continuing this work. There is no
> `plan.md` in this repository and there never was — the commit log is the task
> list.

## What this repo is

Marketing + docs website for **Backstop** — a Python library providing
in-process token budgets, circuit breaking, concurrency control and an opt-in
priced spend ledger for OpenAI/Anthropic Python SDK clients. A partial
TypeScript port is published on npm under the same name. Repo:
`RavaniRoshan/backstop`.

## Current state

- **Phase 0 — Pre-flight:** ✅ Complete. `bun install` ✅; `bun run build` ✅.
- **Phase 1 — Landing page content fixes:** ✅ Complete. All fake TS SDK references
  replaced with real Python API. (The 0.09/0.10 ms benchmark numbers that fix
  introduced have since been corrected again to the committed 0.07 ms — see Key
  decisions.)
  Docs links wired (`/docs`, `/docs/explanation/architecture`,
  `/docs/explanation/benchmarks`, `/docs/explanation/threat-model`,
  `/docs/tutorials/quickstart`). `bun run build` ✅; `bun run lint` ✅.
- **Phase 2 — Docs site (Fumadocs):** ✅ Complete. All 26 `.mdx` pages written
  across tutorials/how-to/reference/explanation quadrants. Fumadocs configured
  via `lib/source.ts`, `components/mdx.tsx`, `next.config.ts` (`createMDX`).
  `app/docs/layout.tsx` + `page.tsx` render the docs shell. `app/sitemap.ts`
  lists all 27 URLs (root + 26 docs). `next-themes` added for cross-page dark
  mode persistence. ✅
- **Phase 3 — Final verification:** ✅ Complete. `bun run build` ✅ (33 pages),
  `bun run lint` ✅, browser E2E via `agent-browser` ✅ (landing renders,
  `/docs` renders, search finds `BudgetExceededError`, dark mode persists
  across routes, no console errors).

## Key decisions (do not redo)

1. **The Python API is the reference surface; a TypeScript package also exists
   and is a divergent partial port.** All copy uses the real Python API:
   `from backstop import Backstop, BackstopConfig, attribution`;
   `Backstop.wrap(OpenAI(), budget=50_000, config=BackstopConfig(...))`;
   `BudgetExceededError` from `backstop.exceptions`; `CircuitBreakerOpenError`
   for a fast-fail on an open circuit; CLI `backstop verify | demo | doctor |
   ledger demo | ledger show | ledger export`; `pip install
   "backstop-ai[anthropic]"`. `backstop-ai` on npm is a published **partial**
   TypeScript port — OpenAI only, patches the client instead of injecting a
   transport, five priorities against Python's three, no metrics / OTel / Redis /
   hierarchical budgets / ledger. Never advertise parity, never hide it.
2. **0.6.0 is published**, not unreleased: PyPI `backstop-ai`, npm
   `backstop-ai`, the `v0.6.0` GitHub Release. MIT licensed. `main` carries
   unreleased work past the tag, so `pip install -e ".[anthropic]"` tracks
   `main`.
3. **Supported providers on the Python side: OpenAI + Anthropic only.** No
   Google GenAI / Gemini / Ollama / Vercel AI SDK claims.
4. **Benchmark truth:** 0.07 ms at p50, p95 and p99, from
   `docs/benchmark-results-2026-07-20.md` — 1,000 requests, local
   `httpx.MockTransport`, no network, seed `0x00C0FFEE`, dated 2026-07-20. The
   snapshot records no host CPU, OS, Python or SDK version, so it is one recorded
   run and not a guarantee. The old ~0.09 ms / 0.10 ms figures are gone
   upstream and must not come back here.
5. **The spend ledger is the differentiator, and it is opt-in.** `SpendEvent`
   1.0 (18 fields, 13 attribution dimensions), `Decimal` money end to end
   rendered as a string on the wire, `cost=None` plus a counted
   `unpriced_requests` for an unknown model, a CSV chargeback with the honesty
   columns beside the money, four runaway detectors in shadow mode by default,
   and detection that is report-only — it cannot block, cancel or kill. The
   ledger is not free: roughly +130 to +147 µs p50 with it on, against +3–5 µs
   with it off. Say the number with its condition; never say "the ledger is also
   0.07 ms".
6. **Do not redesign the landing page.** The retro design system (pixel/mono
   fonts, bordered "window" cards, dithered spheres, marquee tickers, GSAP
   effects) is intentional. Marketing changes are words, links, data — not layout.
7. **Docs follow Diátaxis** (tutorials / how-to / reference / explanation).
8. **Docs theme reuses retro design tokens** from `app/globals.css`.

## Stack

- Next.js 15 (App Router) + React 19, TypeScript strict.
- Tailwind CSS 4, `@tailwindcss/typography`, `tw-animate-css`.
- GSAP + `motion` for landing animations.
- Fumadocs (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`) for `/docs`.
- Package manager: **bun** (lockfile is `bun.lock`). Use `bun add` / `bun run`.

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun run dev` |
| Production build | `bun run build` |
| Lint | `bun run lint` |

The build runs full TypeScript checking (`typescript.ignoreBuildErrors: false`)
but skips ESLint — run `bun run lint` separately.

## Progress tracking

There is no `plan.md`. The commit log is the progress record, and `AGENTS.md`
carries the rules. A task counts as done only when `bun run build` and
`bun run lint` have actually been run and passed — the build typechecks, the
build does not lint.

## Next-slice

All original planned work is complete. Subsequent work is driven by upstream
releases: when `RavaniRoshan/backstop` ships something, this site's job is to
make the copy match it and to remove whatever it previously claimed that the
upstream repo no longer supports.

Last full verification (2026-09-26, ledger update):
- `bun run build` — 36 static pages generated, no errors, no orphan-page warning
- `bun run lint` — no issues
