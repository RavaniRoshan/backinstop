# AGENTS.md — Agent Guide for the Backstop Website Repo

## What this repo is

The marketing + docs website for **Backstop** ([RavaniRoshan/backstop](https://github.com/RavaniRoshan/backstop)) — a Python library providing in-process token budgets, circuit breaking, and concurrency control for OpenAI/Anthropic SDK clients.

- `app/page.tsx` — the retro/brutalist single-page marketing landing.
- `app/docs/` + `content/docs/` — the Fumadocs-powered documentation site at `/docs`.
- `plan.md` — the execution plan with the progress-marking system. **Read it first.**

## Stack

- Next.js 15 (App Router) + React 19, TypeScript strict.
- Tailwind CSS 4 (via `@tailwindcss/postcss`), `@tailwindcss/typography`, `tw-animate-css`.
- GSAP + `motion` for landing-page animation.
- Fumadocs (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`) for `/docs`; MDX content in `content/docs/`.
- Package manager: **bun** (lockfile is `bun.lock`). Always use `bun add` / `bun run`.

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun run dev` |
| Production build | `bun run build` |
| Lint | `bun run lint` |

The build runs full TypeScript checking (`typescript.ignoreBuildErrors: false`) but skips ESLint — run `bun run lint` separately before claiming done.

## Ground rules

1. **Source of truth for product facts is the upstream repo**, not this codebase. API names (`Backstop.wrap`, `BackstopConfig`, `BudgetExceededError`), install commands (`pip install "backstop-ai[anthropic]"`), CLI verbs (`backstop verify | demo | doctor`), and benchmark numbers (~0.09 ms p50 / ~0.10 ms p99) come from the GitHub README and its `docs/` folder. The product is **Python-only** — never invent a TypeScript SDK in copy or snippets.
2. **Do not redesign the landing page.** The retro design system (pixel/mono fonts, bordered "window" cards, dithered spheres, marquee tickers, GSAP effects) is intentional. Marketing changes are words, links, and data — not layout or visuals.
3. **Docs follow Diátaxis** (tutorials / how-to / reference / explanation — see the quadrant folders in `content/docs/`). Match each page's tone to its quadrant: tutorials are lessons, how-tos are recipes, reference is a dictionary, explanation is a discussion.
4. **Docs theme reuses the retro design tokens** defined in `app/globals.css` so `/` and `/docs` feel like one product.

## Progress tracking (required)

`plan.md` is the single progress record. When working in this repo:

- Read `plan.md` before starting; pick the next unchecked task in order (Phase 0 → 3).
- Mark each task `[~]` when starting, `[x]` only after its Verification step passes, `[!]` if blocked (with a `> Blocker:` line), `[-]` if skipped (with `> Reason:`).
- Leave a `> Note:` line if stopping mid-task, and update the "Overall progress" counters and "Work log" at the bottom of `plan.md` in the same commit.
- A task is not done because the code looks right — it is done when the stated verification command/check passed.

## Conventions

- Component files: PascalCase in `components/`; shadcn-style UI primitives in `components/ui/`.
- Imports use the `@/` alias (see `tsconfig.json`).
- `next.config.ts` sets `output: 'standalone'` and `transpilePackages: ['motion']` — don't remove these; the `DISABLE_HMR` webpack block exists for agent-driven editing sessions — keep it.
- MDX docs pages need frontmatter: `title`, `description`, and optionally `icon`; every page ends with an "Edit on GitHub" link to its source file in RavaniRoshan/backstop.
