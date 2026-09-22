# Agent.md — Execution Context for the Backstop Site

> Companion to `AGENTS.md` and `plan.md`. This file describes the current
> execution state, key decisions, and the next-slice script for any agent or
> human continuing this work. **Read `plan.md` for the full task list with
> live checkboxes.**

## What this repo is

Marketing + docs website for **Backstop** — a Python library providing
in-process token budgets, circuit breaking, and concurrency control for
OpenAI/Anthropic Python SDK clients. Repo: `RavaniRoshan/backstop`.

## Current state

- **Phase 0 — Pre-flight:** ✅ Complete. `bun install` ✅; `bun run build` ✅.
- **Phase 1 — Landing page content fixes:** ✅ Complete. All fake TS SDK references
  replaced with real Python API. Benchmark numbers corrected (0.11/0.12→0.09/0.10 ms).
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

1. **No TypeScript SDK exists.** The upstream repo is Python-only. All copy uses
   the real Python API: `from backstop import Backstop, BackstopConfig`;
   `Backstop.wrap(OpenAI(), budget=50_000, config=BackstopConfig(...))`;
   `BudgetExceededError` from `backstop.exceptions`; CLI `backstop verify | demo | doctor`;
   `pip install "backstop-ai[anthropic]"`; 0.6.0 unreleased (source install until PyPI).
2. **Supported providers: OpenAI + Anthropic only.** No Google GenAI / Gemini /
   Ollama / TypeScript / Vercel AI SDK claims.
3. **Benchmark truth from README:** ~0.09 ms p50 / ~0.10 ms p99.
4. **Do not redesign the landing page.** The retro design system (pixel/mono
   fonts, bordered "window" cards, dithered spheres, marquee tickers, GSAP
   effects) is intentional. Marketing changes are words, links, data — not layout.
5. **Docs follow Diátaxis** (tutorials / how-to / reference / explanation).
6. **Docs theme reuses retro design tokens** from `app/globals.css`.

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

`plan.md` is the single progress record. Status legend:
`[ ]` not started · `[~]` in progress · `[x]` done+verified · `[!]` blocked · `[-]` skipped.

## Next-slice

All planned work is complete. No further implementation is required.

Verification summary (all passed):
- `bun run build` — 33 static pages generated, no errors
- `bun run lint` — no issues
- `agent-browser` E2E: landing page renders, `/docs` renders, search finds `BudgetExceededError`, dark mode persists across `/` ↔ `/docs`, no console errors
