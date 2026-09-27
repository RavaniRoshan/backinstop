# AGENTS.md — Agent Guide for the Backstop Website Repo

## What this repo is

The marketing + docs website for **Backstop** ([RavaniRoshan/backstop](https://github.com/RavaniRoshan/backstop)) — an in-process guardrail library for OpenAI/Anthropic SDK clients: token budgets, circuit breaking, concurrency control, and an opt-in priced spend ledger. The reference implementation is Python (`backstop-ai` on PyPI); a partial TypeScript port is also published on npm under the same name — see rule 1 below before describing it, because it is divergent and not a mirror.

- `app/page.tsx` — the retro/brutalist single-page marketing landing.
- `app/docs/` + `content/docs/` — the Fumadocs-powered documentation site at `/docs`.
- `agent.md` — the execution state and key decisions from the last build.

> There is no `plan.md` in this repository. An earlier version of this file
> pointed at one; nothing tracked it, and the plan-tracking section below was
> written for it. Use `git log` and this file instead. Do not recreate it and do
> not cite it as a source.

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

1. **Source of truth for product facts is the upstream repo**, not this codebase. API names (`Backstop.wrap`, `BackstopConfig`, `BudgetExceededError`, `CircuitBreakerOpenError`), install commands (`pip install "backstop-ai[anthropic]"`), CLI verbs (`backstop verify | demo | doctor | ledger demo | ledger show | ledger export`), and the overhead number (0.07 ms at p50, p95 and p99, from the committed snapshot in `docs/benchmark-results-2026-07-20.md`) all come from the GitHub README and its `docs/` folder. Two rules that were wrong here and are now fixed:
   - **0.6.0 is published**, not unreleased: PyPI `backstop-ai`, npm `backstop-ai`, the `v0.6.0` GitHub Release, MIT licensed. `main` carries unreleased work past that tag, so a source install tracks `main`, not the release. Never say "unreleased".
   - **The overhead figure is 0.07 ms**, and only 0.07 ms. An earlier README claimed ~0.09 ms p50 on a named configuration that no artifact recorded, and upstream deleted that claim rather than restating it. The committed snapshot records the date, seed, mock transport, no-network and 1,000 requests — and does **not** record the host CPU, OS, Python version or SDK version. State those conditions wherever the number appears; do not add a precision the evidence does not carry.
   - **The product is not Python-only any more, and the TypeScript package is not a mirror.** `backstop-ai` on npm is a published, *divergent* partial port (see upstream `docs/planning/05-expansion-roadmap.md` §1.1 and the README's "TypeScript (partial port)" section). It wraps the client rather than injecting a transport, has five priorities against Python's three, and has no metrics, OTel, Redis, hierarchical budgets, audit sinks or ledger. So: never hide it, and never advertise parity that does not exist. Use the Python package for the full feature set or for Anthropic.

2. **Do not redesign the landing page.** The retro design system (pixel/mono fonts, bordered "window" cards, dithered spheres, marquee tickers, GSAP effects) is intentional. Marketing changes are words, links, and data — not layout or visuals.
3. **Docs follow Diátaxis** (tutorials / how-to / reference / explanation — see the quadrant folders in `content/docs/`). Match each page's tone to its quadrant: tutorials are lessons, how-tos are recipes, reference is a dictionary, explanation is a discussion.
4. **Docs theme reuses the retro design tokens** defined in `app/globals.css` so `/` and `/docs` feel like one product.

## Progress tracking

There is no `plan.md` in this repository and there is no progress file. The
commits are the record: `git log --oneline` says what shipped, and this file plus
`agent.md` say what is true. If you want a task list, keep it in the commit
message and in the pull request body rather than inventing a file.

The rule that mattered most, kept: a task is not done because the code looks
right — it is done when the stated verification command actually passed. For this
repo that is `bun run build` (which typechecks, because
`typescript.ignoreBuildErrors: false`) **and** `bun run lint` (which the build
skips).

## Conventions

- Component files: PascalCase in `components/`; shadcn-style UI primitives in `components/ui/`.
- Imports use the `@/` alias (see `tsconfig.json`).
- `next.config.ts` sets `output: 'standalone'` and `transpilePackages: ['motion']` — don't remove these; the `DISABLE_HMR` webpack block exists for agent-driven editing sessions — keep it.
- MDX docs pages need frontmatter: `title`, `description`, and optionally `icon`; every page ends with an "Edit on GitHub" link to its source file in RavaniRoshan/backstop.
- Docs navigation is generated from the filesystem by `source.getPageTree()` in `app/docs/layout.tsx`; there is no `meta.json`. The one place pages are listed by hand is `app/sitemap.ts` — a new docs page that is not in the sitemap is not registered.
- A figure the upstream repo does not commit is a figure you may not print. The site carries exactly one overhead number (0.07 ms) and one modelled gateway number, and both say so where they appear.
- `public/demo.gif` is the flagship terminal capture, copied byte-for-byte from upstream `usecases/major-end-to-end/demo.gif` (md5 `60e2291026cf8d75aa684abd92abd01e`, 2.42 MB, 1552x992, 42.4s). It is deliberately a plain `<img loading="lazy" decoding="async">` and must never be re-encoded, resized, re-compressed or moved to `next/image` — the 2.4 MB is the deliverable, and the optimiser buys nothing on an animated GIF while adding a runtime failure mode. `bun run lint` will warn `@next/next/no-img-element`; that warning is expected and is not a reason to change it.
