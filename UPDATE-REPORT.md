# Marketing Site Update — Backstop 0.6.0 + the spend ledger

Repo: `/tmp/opencode/backinstop` (fresh clone of `git@github.com:RavaniRoshan/backinstop.git`, branch `main`)
Upstream source of truth: `/home/shiva/projects/backstop` (branch `main`, at the ledger build)
Date: 2026-09-26

---

## 1. Part A — claims that were false, old text → new text

### A1 — install strip: 0.6.0 release status and licence

| file | old | new |
|---|---|---|
| `app/page.tsx:174` | `0.6.0 unreleased · source: pip install -e ".[anthropic]"` | `0.6.0 published · PyPI backstop-ai · MIT licensed` |
| `components/FaqSection.tsx` (Q9) | `Installation is a single line: pip install "backstop-ai[anthropic]". (0.6.0 is unreleased until PyPI publication, so install from source: pip install -e ".[anthropic]".)` | `… 0.6.0 is published — on PyPI as backstop-ai, on npm as backstop-ai, and as the v0.6.0 GitHub Release — and the project is MIT licensed. The default branch carries unreleased work past that tag, so pip install -e ".[anthropic]" tracks main rather than the release.` |
| `components/FaqSection.tsx` (install box) | `v1.0.0` | `0.6.0 · MIT` |
| `components/FaqSection.tsx` (Q10) | `Yes, Backstop is 100% open source under Apache 2.0 / MIT.` | `Yes. Backstop is MIT licensed.` |
| `components/FooterSection.tsx:394` | `Apache 2.0 License` | `MIT License` |
| `components/FooterSection.tsx:474` | `License (Apache-2.0)` | `License (MIT)` |
| `components/FooterSection.tsx` (2 links) | `…/blob/main/LICENSE` | `…/blob/main/LICENSE.txt` (the file that actually exists upstream) |
| `content/docs/tutorials/quickstart.mdx` | `> **0.6.0 is unreleased.** Until published, install from source:` | `> **0.6.0 is published** — on PyPI as \`backstop-ai\`, on npm as \`backstop-ai\`, and as the \`v0.6.0\` GitHub Release. MIT licensed. The default branch carries unreleased work past that tag, including the spend ledger…` |
| `content/docs/how-to/install.mdx` | `> **0.6.0 is unreleased.** PyPI publication and installation from PyPI have not been verified. …` | `> **0.6.0 is published.** The registry commands below are the supported install path…` |
| `content/docs/reference/compatibility.mdx` | `> 0.6.0 is unreleased. The SDK ranges below…` | `> 0.6.0 is published (PyPI \`backstop-ai\`, npm \`backstop-ai\`, GitHub Release \`v0.6.0\`; MIT licensed)…` |
| `content/docs/index.mdx` | (no version status at all) | new `> **Version status.**` blockquote + a TypeScript-port note |

Grounding: upstream `README.md:110-123` ("`0.6.0` is published — on PyPI as `backstop-ai`, on npm as `backstop-ai`, and as the `v0.6.0` GitHub Release"), `CHANGELOG.md:402-416`, `CHANGELOG.md:337-346`, `LICENSE.txt:1` (`MIT License`).

Also removed the three "after publication" hedges in `install.mdx` ("One line (after publication)", "Convenience installer (after publication)", "Pinned installs (after publication)", "After publication, if you have pipx…"), because 0.6.0 is published.

### A2 — every overhead number, and the conditions around it

The only overhead figure upstream commits is in `docs/benchmark-results-2026-07-20.md`: **0.07 ms at p50, p95 and p99**, 1,000 requests through a local `httpx.MockTransport`, no network, seed `0x00C0FFEE`, dated 2026-07-20. The snapshot records **no** host CPU, OS, Python version or SDK version. `README.md:406-412` says so explicitly and records that the earlier ~0.09 ms p50 claim was deleted rather than restated.

Number changes (0.09 / 0.10 / 0.090 → 0.07):

| file:line | old | new |
|---|---|---|
| `app/page.tsx:289` | `0.10ms p99 OVERHEAD` | `0.07ms p99 OVERHEAD` |
| `app/page.tsx:417` | `0.09 ms` | `0.07 ms` |
| `app/page.tsx:420-425` | `In-process CPU latency overhead. (vs 48.6ms cloud gateways)` | `In-process control-path overhead, the same 0.07 ms at p50, p95 and p99. One committed snapshot: 1,000 requests through a local mock transport, no network, recorded 2026-07-20. Not a guarantee — the snapshot records no CPU, OS, Python or SDK version. Re-measure with backstop benchmark.` |
| `app/page.tsx:428-430` | (nothing) | new line: `The gateway figure in the comparison above is an illustrative model of one remote hop, not a measurement.` |
| `components/SpeedComparison.tsx:92` | `0.09 ms OVERHEAD` | `0.07 ms OVERHEAD` |
| `components/SpeedComparison.tsx:116` | `0.090 ms` | `0.070 ms` |
| `components/SpeedComparison.tsx` (new caption) | (nothing) | 4-line conditions paragraph under the header (see below) |
| `components/BenchmarkWindow.tsx:18` | `latency: '+0.10 ms'` | `latency: '+0.07 ms'` |
| `components/BenchmarkWindow.tsx:60` | `p99 emp. data` | `backstop row = committed snapshot` |
| `components/BenchmarkWindow.tsx:126-129` | `Source: Apache Bench 10,000 reqs/sec` | `Backstop: 0.07 ms at p50/p95/p99 — 1,000 requests, local mock transport, no network, 2026-07-20. Gateway rows: illustrative.` |
| `components/FaqSection.tsx` (Q8) | `Backstop adds less than 0.09 ms of overhead (p50)—purely the CPU time needed to check an in-process token bucket and compare budget numbers. Compared to the 30–60ms penalty of hosted proxies, it is practically free.` | full rewrite: `0.07 ms of control-path overhead — the same figure at p50, p95 and p99 — in the single snapshot the repository commits: 1,000 requests through a local httpx.MockTransport, no network, seed 0x00C0FFEE, recorded 2026-07-20. That snapshot does not record the host CPU, OS, Python version or SDK version, so it is one recorded run rather than a guarantee. Re-measure on your own host with backstop benchmark. The opt-in spend ledger is not this cheap: with it enabled a request roughly doubles in cost, and docs/ledger.md publishes that measurement.` |
| `components/FaqSection.tsx:167` | `+0.09ms LATENCY` | `+0.07ms LATENCY` |
| `components/FooterSection.tsx:197` | `OVERHEAD < 0.09ms` | `OVERHEAD ~0.07ms` (`<` was also a stronger claim than one recorded run supports) |
| `components/FooterSection.tsx:324` | `Latency Matrix (0.09ms)` | `Latency Matrix (0.07ms)` |
| `components/FooterSection.tsx:443` | `CPU COST: 0.09ms` | `CPU COST: 0.07ms` |
| `components/InteractivePrimitives.tsx:157` | `Halting all upstream requests locally in 0.09ms!` | `… in 0.07ms!` |
| `components/InteractivePrimitives.tsx:742` | `Local Fast-Reject: 0.09 ms` | `Local Fast-Reject: 0.07 ms` |
| `components/RuntimeTelemetryWindow.tsx:17` | `useState(0.08)` | `useState(0.07)` |
| `components/RuntimeTelemetryWindow.tsx:21-22` | `0.08ms intercept: openai…` / `0.09ms intercept: anthropic…` | `0.07ms control path: chat.completions.create()…` / `0.07ms control path: anthropic.messages.create()…` |
| `components/RuntimeTelemetryWindow.tsx:31` | `0.07 + Math.random() * 0.03` (could print 0.08/0.09/0.10) | `0.07 + Math.random() * 0.01` (can only print 0.07 or 0.08) |
| `components/RuntimeTelemetryWindow.tsx:40,50` | `setInterceptLatency(0.10)` / `setInterceptLatency(0.08)` | `setInterceptLatency(0.07)` both |
| `components/RuntimeTelemetryWindow.tsx:44` | `p99 latency 0.10ms` | `0.07ms control path` |
| `components/RuntimeTelemetryWindow.tsx:62` | `p99: 0.10ms (microsecond CPU hook)` | `p99: 0.07ms (committed snapshot)` |
| `components/ui/navigation-menu-06.tsx:82` | `0.10ms p99 overhead compared to 85ms+ on centralized proxy networks.` | `0.07ms p99 overhead in the committed snapshot; a remote gateway adds a whole network hop.` |
| `content/docs/explanation/why-in-process-vs-proxies.mdx:17,19,35` | `~0.09 ms p50` (×3) | `0.07 ms p50` + a conditions paragraph + an explicit note that the 0.09 ms claim was deleted upstream |
| `content/docs/explanation/benchmarks.mdx` | (no conditions anywhere) | new section `## The number this site advertises, and its conditions` (records / does-not-record) + `## What is *not* covered by that number` |
| `content/docs/reference/benchmark-results-2026-07-20.mdx` | 0.07 ms with no conditions | + a records / does-not-record table, re-measure commands, a note that `error-storm` and `budget-hit` do not reproduce, and a note that the figure is the ledger-off enforcement path |
| `content/docs/reference/cli.mdx:63` | `Wall-clock overhead \| 0.07 ms` (in the pasted `verify` output) | left as-is — this is upstream's own committed `verify` output sample, not a site claim |

**No replacement precision was invented.** There is no 0.08 ms, no 0.065 ms, no per-platform figure anywhere on the site now.

The conditions are now visible in five places: the `SpeedComparison` caption, the `BenchmarkWindow` footer strip, the landing-page stat card, FAQ 8, and the two docs pages. A class census of the new section's Tailwind classes against the rest of the rendered page confirmed it introduces no new colour, font, border or shadow tokens.

### A3 — the concurrency claim (it was false)

`app/page.tsx:349` (column `[03] IN-PROCESS CONCURRENCY ENFORCEMENT`):

- **old:** `By hooking directly into your runtime connection pool, Backstop can halt and shed non-essential background agent tasks before sockets queue up, preventing worker thread exhaustion.`
- **new:** `The admission gate queues requests once the concurrency limit is reached and admits them in priority order — critical, then default, then background — with a starvation valve so an old low-priority ticket is never left waiting forever. It does not drop or cancel background work. What actually stops a request before it reaches the network is the hard token budget ceiling, which raises BudgetExceededError, and the circuit breaker, which fails fast with CircuitBreakerOpenError while the provider is unhealthy.`

Grounding: `README.md:205-219` ("The gate **queues and prioritises; it does not shed.** … it does not cancel or discard the lower-priority waiters. To stop a starved ticket waiting forever, `starvation_after_seconds` (default `1.0`) releases the oldest ticket in any queue"); `examples/background_priority.py:1-11`; `src/backstop/exceptions.py:57` ("Raised before dispatch when the circuit breaker is open"); `README.md:62` (`Blocked calls … Pre-empted before network dispatch`).

The same lie was duplicated in five other places and was corrected with them, because leaving them would have contradicted the fix:

| file:line | old | new |
|---|---|---|
| `components/RuntimeTelemetryWindow.tsx:68` | `Shedding low-priority background workers` | `Queued and admitted in priority order` |
| `components/RuntimeTelemetryWindow.tsx:192-193` | `Thread Starvation Protection` / `Active (shed threshold 85%)` | `Starvation Protection` / `Active (oldest waiter released)` |
| `components/InteractivePrimitives.tsx:240` | `Priority-aware traffic shedding. Protects interactive user chats while dynamically pacing or dropping autonomous background tasks.` | `Priority-aware admission. Protects interactive user chats by queueing and admitting requests in priority order — critical, then default, then background. Nothing is dropped; a starved ticket is released by a timer.` |
| `components/InteractivePrimitives.tsx:389` | `Traffic Shedding & Backpressure Control` | `Priority Admission & Backpressure Control` |
| `components/WorkflowChart.tsx:21` | `Backstop trips in-process, immediately shedding background work while protecting user-critical prompts.` | `Backstop trips in-process and fails fast with CircuitBreakerOpenError before dispatch, instead of sending more work to a provider that is already failing.` |
| `components/FooterSection.tsx:256` | `Concurrency Shedding` | `Priority Admission Queue` |
| `app/page.tsx:526` | `automated 429 backpressure shed algorithms` | `in-process 429 backoff with circuit breaking` |
| `components/FaqSection.tsx` (Q4) | `… to immediately shed low-priority background queues, reserving throughput for user-facing prompts.` | `… While the circuit is open, requests fail fast with CircuitBreakerOpenError before dispatch instead of piling onto a provider that is already failing.` |
| `content/docs/reference/configuration.mdx:30-34` | `Priority.CRITICAL # user-facing, protected from shedding` / `Priority.BACKGROUND # batch jobs, first to be shed under load` | `admitted ahead of the other two` / `admitted last` |
| `content/docs/reference/configuration.mdx:82` | `starvation_after_seconds \| Seconds a queued request waits before being shed.` | full rewrite: releases the oldest waiter, `0` disables, plus "The gate **queues and prioritises; it does not shed** — it never cancels or discards a lower-priority waiter." |
| `content/docs/how-to/priority-admission.mdx` | the whole page, throughout | title/description/lede + the "How admission control works" rules + a new 4-row table separating `starvation_after_seconds` / `queue_timeout` / budget / circuit breaker by what each actually does |

### A4 — "control plane"

| file:line | old | new |
|---|---|---|
| `app/page.tsx:266` | `IN-PROCESS CONTROL PLANE` | `IN-PROCESS ENFORCEMENT + LOCAL LEDGER` |

Grounding: `README.md:296-302` ("**Not a hosted control plane.** There is no central Backstop server and no shared policy service.").

### A5 — the 48.6 ms proxy figure is now labelled a model

| file:line | old | new |
|---|---|---|
| `components/SpeedComparison.tsx:126` | `+48.6 ms EXTRA HOP` | `~48.6 ms EXTRA HOP (MODELLED)` |
| `components/SpeedComparison.tsx:147` | `Hop Delay: 48.600 ms` | `Hop Delay: ~48.6 ms modelled` |
| `components/SpeedComparison.tsx:13` | `… (48.6ms total overhead)` | `… (48.6ms total hop)\n-- modelled hops, not a Backstop measurement --` |
| `components/SpeedComparison.tsx:76-86` | (nothing) | new caption: `Left figure: 0.07 ms … Right figure: a modelled breakdown of one remote hop, not a measurement of any named gateway.` |
| `app/page.tsx:407` | `In-process CPU latency overhead. (vs 48.6ms cloud gateways)` | replaced wholesale (see A2), and a new line names the gateway figure as illustrative |
| `components/BenchmarkWindow.tsx:60,129` | `p99 emp. data` / `Source: Apache Bench…` | `backstop row = committed snapshot` / `… Gateway rows: illustrative.` |
| `components/FaqSection.tsx` (Q2) | `introduce 30–60ms of network latency per call` | `add a network round trip to every call — the order of tens of milliseconds in practice, and a rule of thumb rather than a Backstop measurement` |
| `content/docs/explanation/why-in-process-vs-proxies.mdx:26-40` | `0.5–2 ms of unavoidable overhead`; the `~301–302 ms` arithmetic | `tens of microseconds`; the proxy line rewritten to `~300 ms + a whole network hop`, with `The 300 ms figures are illustrative` and the unsourced `0.5–2 ms` removed |

The comparison itself is kept, because it is the site's core argument. No upstream file records any remote-gateway measurement.

### A6 — the news modal and the release strip

| file:line | old | new |
|---|---|---|
| `app/page.tsx:116` | `Backstop launches: In-process reliability for AI SDKs (Python)` | `0.6.0 is published, and main now ships an opt-in priced spend ledger` |
| `app/page.tsx:121-125` | `Read spec ↗` → `/docs/tutorials/quickstart` | `Read the ledger ↗` → `/docs/explanation/what-the-ledger-is` |
| `components/WaitlistDialog.tsx:59-119` (the whole `news` branch) | `Backstop v1.0: In-Process AI Reliability Layer` + one paragraph + `GitHub: RavaniRoshan/backstop ↗` | `Release notes` with three dated entries: **0.6.0 — published** (PyPI / `v0.6.0` Release / npm, MIT, `main` is past the tag), **New on main — the spend ledger** (opt-in, 18 fields, 13 dimensions, `Decimal` money as a string on the wire, `backstop ledger demo` keyless and deterministic, "It costs real latency and we publish the number", "Detection is report-only"), **Also on npm — read this before you use it** (partial TypeScript port, OpenAI only, patches the client, five priorities, no metrics/OTel/Redis/hierarchical budgets/audit sinks/ledger). Footer link → `CHANGELOG.md`. |
| `app/page.tsx:165` (hero sub) | `… circuit breaking, and telemetry for multi-agent workflows.` | `… circuit breaking, and a priced, attributed spend ledger for multi-agent workflows.` |
| `app/page.tsx:224-226` (ticker) | (no ledger) | `PRICED SPEND LEDGER` added |

### A7 — the two wrong rules in `AGENTS.md`, and the `plan.md` ghost

`plan.md` **does not exist** in this repository and is not tracked by git. It was referenced in three places. None of them invented the file; all three now say so.

| file:line | old | new |
|---|---|---|
| `AGENTS.md:9` | `` - `plan.md` — the execution plan with the progress-marking system. **Read it first.** `` | `- agent.md — the execution state and key decisions from the last build.` + a blockquote: `> There is no plan.md in this repository. An earlier version of this file pointed at one; nothing tracked it, and the plan-tracking section below was written for it. Use git log and this file instead. Do not recreate it and do not cite it as a source.` |
| `AGENTS.md:45-52` | `## Progress tracking (required)` — the whole `plan.md` checkbox protocol | `## Progress tracking` — `There is no plan.md in this repository and there is no progress file. The commits are the record…` The one durable rule is kept: a task is done when `bun run build` **and** `bun run lint` have actually passed. |
| `agent.md:3-6` | `> Companion to AGENTS.md and plan.md. … **Read plan.md for the full task list with live checkboxes.**` | `> Companion to AGENTS.md. … There is no plan.md in this repository and there never was — the commit log is the task list.` |
| `agent.md:66-71` | `## Progress tracking` (the `plan.md` checkbox legend) | `There is no plan.md. The commit log is the progress record…` |
| `agent.md:74-80` | `## Next-slice` — "All planned work is complete. No further implementation is required." | rewritten to say subsequent work is driven by upstream releases: *when `RavaniRoshan/backstop` ships something, this site's job is to make the copy match it and to remove whatever it previously claimed that the upstream repo no longer supports.* |

`AGENTS.md` rule 1 ("Source of truth for product facts…") was rewritten. It now states three corrections instead of one wrong rule:

1. **The overhead figure is 0.07 ms, and only 0.07 ms**, with the recorded and unrecorded conditions, and: *"The old 0.09 / 0.10 ms figures are gone upstream and must not come back here."*
2. **0.6.0 is published**, not unreleased. *"Never say 'unreleased'."*
3. **The product is not Python-only any more, and the TypeScript package is not a mirror.** `backstop-ai` on npm is a published *divergent* partial port; it wraps the client rather than injecting a transport, has five priorities against Python's three, and has no metrics, OTel, Redis, hierarchical budgets, audit sinks or ledger. The rule is now: *"never hide it, and never advertise parity that does not exist. Use the Python package for the full feature set or for Anthropic."*

`AGENTS.md` also gained two Conventions lines that were missing and that this change made load-bearing: docs navigation is filesystem-generated via `source.getPageTree()` and there is no `meta.json` — *the one place pages are listed by hand is `app/sitemap.ts`*; and *"A figure the upstream repo does not commit is a figure you may not print."*

`agent.md` Key decisions 1-5 were replaced with the corrected set (Python API + divergent TS port; 0.6.0 published; providers; 0.07 ms with its conditions; the spend ledger as the differentiator, with the instruction *"Say the number with its condition; never say 'the ledger is also 0.07 ms'."*), and the two leftover decisions were renumbered 6-8.

### Other false claims found while sweeping, and fixed

These were not in the brief but are the same class of lie, and two of them are named by Part A's own instructions (A1 = "including the license"; A3/A4 = the control-plane / shedding story):

| file:line | old | new | why |
|---|---|---|---|
| `components/RuntimeTelemetryWindow.tsx:20` | `[INIT] Backstop runtime hook bound to Node.js v22 undici connection pool` | `[INIT] Backstop transport injected in-process: httpx / httpx2, per SDK family` | upstream `README.md:370-380` |
| `components/RuntimeTelemetryWindow.tsx:199` | `Backstop attaches to standard fetch/undici dispatchers in-memory.` | `Backstop injects its own transport into the wrapped SDK client, in memory.` | same |
| `components/FaqSection.tsx` (Q3) | `Backstop tracks cumulative token counts and live model pricing locally in real time…` | `…tracks cumulative token counts locally in real time. Once an agent or session hits its assigned token ceiling, Backstop raises BudgetExceededError before the request is dispatched, so nothing is spent.` | `budget=` is a **token** ceiling, not a dollar one, and the rate card is a dated snapshot, not "live pricing" (`docs/ledger.md:659-665`) |

---

## 2. Part B — the ledger

### B1 — new landing-page section

`components/LedgerSection.tsx` (new), rendered from `app/page.tsx` as `SECTION 4`, between the existing architecture section and the existing "Backstop Research" marquee. The downstream section comments were renumbered 4→5 and 5→6 so the file stays coherent (comment-only).

**Design system compliance.** Only patterns already in the codebase:
- section shape `relative bg-card py-20 px-6 md:px-12 border-b border-foreground/20 overflow-hidden` with `max-w-[1242px] mx-auto relative z-10` — the same as the primitives section;
- section header — `w-2 h-2 bg-primary inline-block` + uppercase `font-mono-jet` `text-primary` label + bold `font-sans` heading (the "EMPIRICAL VERIFICATION & RUNTIME STATE" shape);
- window card — `border border-foreground/30 bg-card shadow-md` with a `bg-primary text-primary-foreground px-3 py-1.5 … font-pixel` title bar;
- window footer strip — `border-t border-foreground/20 bg-muted/50 flex … justify-between font-mono-jet text-[10px]` (the `BenchmarkWindow` footer);
- fact cards — `border border-foreground/30 bg-card p-5 shadow-sm`;
- badges — `px-2.5 py-1 bg-card border border-foreground/30 font-mono-jet … shadow-xs` / `px-2.5 py-1 bg-primary text-primary-foreground font-mono-jet … shadow-xs` (the page's existing badge pair, copied verbatim);
- `lucide-react` icons, already imported elsewhere in the page.

**No layout change to any existing section.** Verified by rendering and diffing: the class census showed the only tokens the new section introduces are ordinary Tailwind scale values (`space-y-2.5`, `gap-x-8`, `gap-y-3`, `mt-6`, `lg:grid-cols-2`, `sm:items-end`, `sm:items-start`, `max-h-[420px]`) and lucide icon class names. **No new colour, font, border, radius or shadow token.**

**Contents:**

1. Header + `OPT-IN · OFF BY DEFAULT` / `0 BYTES EGRESS` badges.
2. A terminal window titled `$ backstop ledger demo` / `EXIT 0` holding the **verbatim, unedited output** of the command, in a scrollable `font-mono-jet` `<pre>`, with a footer strip `REAL OUTPUT · 2026-09-26 · BYTE-IDENTICAL ACROSS RUNS` and a link to the how-to.
3. `WHAT THE REPORT ADMITS` — the five honesty features (unattributed as a row, missing rate counted not filled, floors labelled as floors, loss report separate from the money, join shows its holes).
4. `WHAT IT IS NOT — STILL` — metrics backend, revenue system, control plane / multi-tenant, forecast, cross-customer benchmarks, framework-native attribution, invoice reconciliation.
5. Four fact cards — `SpendEvent 1.0` 18 fields; the 13 dimensions + the two-line context manager; `Decimal` end to end / string on the wire / stable CSV column order; an unknown price is a hole, not a guess.
6. `RUNAWAY-SPEND DETECTION` — the four detectors named, `REPORT-ONLY` + `SHADOW DEFAULT` badges, and the structural reason auto-kill is absent.
7. `WHAT IT COSTS` — enforcement is the 0.07 ms control path; the ledger is **not free**, ~+130 to +147 µs p50 on a ~150 µs request over 7 alternating runs on Python 3.12.3/Linux, off = +3 to +5 µs.
8. Links to the how-to and the schema reference, plus a footer strip with the MIT / 0.6.0 / ledger-on-main status.

Every number above is either in the pasted demo output or in `docs/ledger.md`; §7 below lists them.

### B2 — three new docs pages, registered

| file | quadrant | Edit-on-GitHub target | verified to exist upstream |
|---|---|---|---|
| `content/docs/explanation/what-the-ledger-is.mdx` | explanation (discussion: why an enforcement library emitting a priced ledger is a different thing from an observability tool, and what it is not) | `docs/ledger.md` | yes |
| `content/docs/how-to/export-a-chargeback.mdx` | how-to (8-step recipe) | `docs/ledger.md` | yes |
| `content/docs/reference/ledger-schema.mdx` | reference (dictionary: 18 fields, 13 dimensions, `CostBreakdown`, price resolution, export columns, detection signals, delivery counters) | `src/backstop/ledger/schema.py` | yes (`class SpendEvent` at line 389) |

All three have frontmatter (`title`, `description`, `icon`) and a trailing `ExternalLinkIcon` "Edit this page on GitHub" link, matching every other page.

**Registration.** `app/docs/layout.tsx` builds the tree with `source.getPageTree()` and `lib/source.ts` is a bare `defineDocs({ dir: 'content/docs' })`; there is **no `meta.json` anywhere** in the repo, so navigation is filesystem-generated and the new pages appear automatically. The place pages *are* listed by hand is `app/sitemap.ts` — the three new URLs were added there. `bun run build` generated **36** static pages (was 33) with **no orphan-page warning**; `/sitemap.xml` serves 31 URLs including all three.

**Docs pages updated:**

| file | what changed |
|---|---|
| `content/docs/index.mdx` | version-status blockquote; TypeScript-port note; `What The Ledger Is` and `Export a Chargeback` added to the "Learn how it works" and "Guides & references" lists; CLI Reference and Ledger Schema added; ledger mention in the lede and description |
| `content/docs/reference/cli.mdx` | `backstop ledger demo` / `show` / `export` added to the command table; a full `## backstop ledger` section with every verified flag, default, and exit code (including exit 1 on a corrupt non-final line with nothing written, and exit 2 for an unknown `--group-by` dimension); upstream's hardcoded-demo-prose caveat recorded |
| `content/docs/reference/configuration.mdx` | new `### Spend ledger` table (5 fields) and `### Runaway-spend detection` table (9 fields) with defaults read off the live dataclass; the `starvation_after_seconds` and `Priority` shedding corrections from A3 |
| `content/docs/explanation/benchmarks.mdx` | conditions + a "what is *not* covered" section (see A2) |
| `content/docs/reference/benchmark-results-2026-07-20.mdx` | conditions table, re-measure commands, scenario-reproducibility correction, ledger-off note (see A2) |
| `content/docs/explanation/why-in-process-vs-proxies.mdx` | 0.09 → 0.07 with conditions, unsourced proxy numbers removed (see A2/A5) |
| `content/docs/reference/compatibility.mdx` | release status; a new `## TypeScript` divergence table (see below) |
| `content/docs/how-to/install.mdx` | release status; `doctor` described accurately ("it does not send a request through the wrapped transport, so it cannot prove enforcement works — `backstop verify` is the command that does that"); a `## Try the spend ledger` section explaining that the ledger is past the tag |
| `content/docs/tutorials/quickstart.mdx` | release status |
| `content/docs/how-to/priority-admission.mdx` | the A3 corrections throughout |

### The TypeScript divergence table (`content/docs/reference/compatibility.mdx`)

Every row traced to `docs/planning/05-expansion-roadmap.md` §1.1 (the measured FACT table) and the upstream README's "TypeScript (partial port)" section:

| | Python | npm `backstop-ai` |
|---|---|---|
| Providers | OpenAI + Anthropic | OpenAI only (`peerDependencies: { "openai": ">=4" }`) |
| Interception | transport injection (`BackstopTransport.handle_request`) | patches `client.chat.completions.create` |
| Priorities | 3 | 5 |
| Budget semantics | no priority bypass in the budget path | `critical` **and `high`** bypass the ceiling |
| Ledger, price catalog, detector | shipped | none |
| Metrics / OTel / Redis / hierarchical budgets | shipped | none |
| Audit chain | HMAC chain + `verify()` + four sinks | HMAC chain + `verify()`, **no sinks** |
| CI | full matrix | none |

The audit row is deliberately *not* "the fork lacks everything": upstream's own audit corrected that reading ("the fork does *not* lack an audit chain… What the fork lacks is the four pluggable audit **sinks**"), and the table says exactly that.

### B3 — stale release status

Every "0.6.0 unreleased" string on the site is gone. Verified against the rendered HTML: `'unreleased': 0` occurrences in the prerendered `/` page and in all 13 rendered docs pages. The three remaining legitimate uses of the word are "unreleased work past the tag", which is the accurate framing from upstream `README.md:112-115`.

### 7. The ledger facts stated on the site, and where each is grounded

| claim | source |
|---|---|
| `SpendEvent` 1.0, 18 wire fields, exactly 18 or `ValueError` | `docs/ledger.md:92-123` |
| 13 attribution dimensions, named | `docs/ledger.md:125-127` |
| `with attribution(team="payments", feature="checkout-v2"):` | `docs/ledger.md:59` |
| `Decimal` end to end, 28-digit context, `ROUND_HALF_UP` | `docs/ledger.md:129-131, 342-347` |
| every amount on the wire is a **string** | `docs/ledger.md:129-131` |
| unknown model → `cost=None` + counted `unpriced_requests`, never a guess | `docs/ledger.md:295-298` |
| a component with no published rate is charged zero **and marked** | `docs/ledger.md:300-302` |
| CSV: RFC 4180, CRLF, UTF-8, 2-dp money strings, stable column order, **no totals row** | `docs/ledger.md:360-383` (column order verified by running `export`) |
| revenue join with a visible `(none)` and a `match` column | `docs/ledger.md:385-390` (verified by running) |
| four detectors: velocity, drift, retry amplification, context growth | `docs/ledger.md:450-455`; `src/backstop/detection/detector.py:92` |
| shadow mode is the default (`detection_shadow=True`) | `docs/ledger.md:472-476`; `config.py` default `True` (read live) |
| report-only: cannot block, cancel, kill or raise — structural, and a test walks the public API for such a verb | `docs/ledger.md:464-469` |
| auto-kill absent because "an agent run can be six hours of work, and a kill switch that cannot resume is worse than no kill switch" | `docs/ledger.md:467-469`; `docs/planning/04-detection-design.md:350-362` |
| **+146.8 µs p50 (+98%)** and an independent **+130.0 µs p50 (+84.6%)** → "+130 to +147 µs p50"; off = **+3 to +5 µs**; 7 alternating runs per arm, 3,000 iterations after 500 warm-up, Python 3.12.3 on Linux | `docs/ledger.md:565-585` |
| `backstop ledger demo` needs no key, no network, no file, byte-identical across runs | `docs/ledger.md:45-77, 716`; **run and md5-verified twice** (§8) |
| absent: no cloud, no multi-tenancy of the ledger, no forecasting, no cross-customer benchmarks, no framework-native attribution, no invoice reconciliation | `README.md:310-332`; `docs/planning/05-expansion-roadmap.md` §4.2 M1-M7 |

**The one thing the site never says:** "the ledger is also 0.07 ms". The enforcement figure and the ledger figure are kept in separate sentences, each with its own condition, in all four places both appear (landing stat card, `SpeedComparison` caption, `LedgerSection` cost block, `benchmarks.mdx`, `export-a-chargeback.mdx`, `what-the-ledger-is.mdx`).

---

## 3. Part C — verification

All commands run from `/tmp/opencode/backinstop`.

### `bun install`

```
1139 packages installed [49.64s]
```
`node_modules` was absent on the fresh clone; this was the first step.

### `bun run build` — PASS

`next.config.ts` sets `typescript.ignoreBuildErrors: false`, so a type error fails the build. Final run:

```
$ bun run build
> next build
   ▲ Next.js 15.5.25

   Creating an optimized production build ...
 ✓ Compiled successfully in 5.0s
   Skipping linting
   Checking validity of types ...
   Collecting page data ...
   Generating static pages (0/36) ...
   Generating static pages (9/36)
   Generating static pages (18/36)
   Generating static pages (27/36)
 ✓ Generating static pages (36/36)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    65.8 kB         173 kB
├ ○ /_not-found                            992 B         103 kB
├ ƒ /api/search                            127 B         103 kB
├ ● /docs/[[...slug]]                    14.9 kB         173 kB
├   ├ /docs
├   ├ /docs/explanation/aimd
├   ├ /docs/explanation/architecture
├   └ [+27 more paths]
└ ○ /sitemap.xml                           127 B         103 kB
```
36 pages, up from 33 on the pre-change baseline (which also passed). **No orphan-page warning, no build error, no type error.**

### `bun run lint` — PASS

```
$ bun run lint
> eslint .
```
Clean. Two lint errors were found and fixed during the work (`react/jsx-no-comment-textnodes` on the window title-bar comment; `react/no-unescaped-entities` on `demo's`).

### Route check against a real server

`node .next/standalone/server.js`, then:

```
/                                                     200
/docs                                                 200
/docs/explanation/what-the-ledger-is                 200
/docs/how-to/export-a-chargeback                     200
/docs/reference/ledger-schema                        200
/docs/reference/cli                                  200
/docs/reference/benchmark-results-2026-07-20         200
/docs/explanation/benchmarks                         200
/docs/reference/compatibility                        200
/docs/how-to/install                                 200
/docs/tutorials/quickstart                           200
/docs/reference/configuration                        200
/docs/how-to/priority-admission                      200
/docs/explanation/why-in-process-vs-proxies          200
/sitemap.xml                                          200
```

Sitemap contains 31 URLs, including the three new ones:
```
https://backstop.ai/docs/how-to/export-a-chargeback
https://backstop.ai/docs/reference/ledger-schema
https://backstop.ai/docs/explanation/what-the-ledger-is
```

### Content assertion against the rendered HTML

Prerendered `/.next/server/app/index.html` and all 13 rendered docs pages, tags stripped:

| assertion | result |
|---|---|
| `0.09` on `/` | 0 |
| `0.10ms` / `0.10 ms` on `/` | 0 / 0 |
| `unreleased` on `/` | 0 |
| `Apache` on `/` (was `Apache 2.0 License` + `License (Apache-2.0)`) | 0 |
| `shed` as a standalone claim on `/` (all remaining hits are inside "published") | 0 |
| `48.6` on `/` | 2 — both adjacent to `MODELLED` / `modelled` |
| `0.07 ms` on `/` | 8 |
| `backstop ledger demo` on `/` | 3 |
| the demo table renders verbatim inside the `<pre>` | yes, byte-for-byte |
| `0.09 ms` in any docs page | 2, both inside the sentence that explains the claim was deleted upstream |

### Every command in the how-to was run, not copied

Run against `/home/shiva/projects/backstop` on 2026-09-26:

| command | result |
|---|---|
| `PYTHONPATH=src python3 -m backstop ledger demo` | exit 0, 66 lines, **md5-identical across two runs** (`9f7943b03ff8238d985dcbe9a667e3ff`), also identical with `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` unset |
| `backstop ledger --help` / `demo --help` / `show --help` / `export --help` | exit 0, flags/defaults as documented |
| the 8-step script in the how-to | `submitted=4 landed=4 lost=0` |
| `backstop ledger show --path ledger.jsonl` | exit 0, the exact output pasted into the page, including `dropped_events: unknown — …` |
| `backstop ledger export --path ledger.jsonl --out chargeback.csv --group-by team,feature` | `wrote 3 row(s) to chargeback.csv from 4 event(s) in ledger.jsonl — 0.04 USD total, 0 unpriced, 0.01 unattributed` |
| the CSV | pasted verbatim; CRLF line endings and 2-dp money strings confirmed with `cat -A` |
| `build_chargeback` + `revenue_join` + `render_revenue_csv` snippet | exit 0; the exact CSV pasted into the page, including the `cost_only` and `revenue_only` rows |
| `write_revenue_csv(joined, "margin.csv")` | `rows written: 3` |
| a float revenue figure | `TypeError: revenue for ('payments', 'checkout-v2') is a float 148230.0; pass a decimal string or a Decimal, because a float has already lost the cents` |
| `backstop ledger demo --group-by nope` | exit 2, `… --group-by does not know ['nope']; the ledger groups on ['team', 'agent', 'session', 'task', 'feature', 'surface', 'customer', 'tenant', 'environment', 'repo', 'cost_center', 'gl_code', 'currency']` — pasted verbatim |
| `backstop ledger show --path missing.jsonl` | exit 1, `error: cannot read ledger 'missing.jsonl': [Errno 2] No such file or directory: 'missing.jsonl'` |
| `PriceCatalog.from_file("prices.json")` snippet | `gpt-4o 2.10` / `gpt-4o-2024-08-06 2.10` / `no-such-model no price` — pasted verbatim |
| `PriceCatalog().resolve(...)` against the bundled card | `gpt-4o → 2.50`, `gpt-4o-2024-08-06 → 2.50`, `vendor-preview-2027 → no price`, `claude-3.5-sonnet → 3.00` |
| the 14 `BackstopConfig` ledger/detection defaults in `configuration.mdx` | read live off the dataclass, not copied from prose |
| `SIGNAL_KINDS` | `("velocity", "drift", "retry_amplification", "context_growth")` — `src/backstop/detection/detector.py:92` |
| `class CostBreakdown` field names | verified against `src/backstop/pricing_catalog.py:713-742` |
| `class SpendEvent` location | `src/backstop/ledger/schema.py:389` |

**Two things I chose *not* to change, deliberately:** the ledger demo's own output is pasted unmodified, including its markdown fences and its `## Get this out of your own ledger` shell block, because the task asked for the real output. And `content/docs/reference/cli.mdx:63` still shows `0.07 ms` inside the pasted `backstop verify` output — that is upstream's own committed sample output, not a site claim.

---

## 4. Files created

| file | why |
|---|---|
| `components/LedgerSection.tsx` | The ledger section. A component rather than an inline block because it is ~330 lines of JSX and `page.tsx` already delegates every heavy widget to `components/` (`BenchmarkWindow`, `SpeedComparison`, `WorkflowChart`). No props, no new API. |
| `content/docs/explanation/what-the-ledger-is.mdx` | B2, explanation quadrant. The discussion the task asked for: why an enforcement library emitting a priced ledger differs from an observability tool, and the full "what it is not" list. |
| `content/docs/how-to/export-a-chargeback.mdx` | B2, how-to quadrant. 8-step recipe, every command and output run. |
| `content/docs/reference/ledger-schema.mdx` | B2, reference quadrant. `SpendEvent` 1.0 (18 fields), the 13 attribution dimensions, `CostBreakdown`, price resolution, export columns, detection signals, delivery counters. Tables and terse definitions, no argument. |
| `UPDATE-REPORT.md` | this file |

## 5. Files modified (23)

`AGENTS.md`, `agent.md`, `app/page.tsx`, `app/sitemap.ts`, `components/BenchmarkWindow.tsx`, `components/FaqSection.tsx`, `components/FooterSection.tsx`, `components/InteractivePrimitives.tsx`, `components/RuntimeTelemetryWindow.tsx`, `components/SpeedComparison.tsx`, `components/WaitlistDialog.tsx`, `components/WorkflowChart.tsx`, `components/ui/navigation-menu-06.tsx`, `content/docs/index.mdx`, `content/docs/tutorials/quickstart.mdx`, `content/docs/how-to/install.mdx`, `content/docs/how-to/priority-admission.mdx`, `content/docs/explanation/benchmarks.mdx`, `content/docs/explanation/why-in-process-vs-proxies.mdx`, `content/docs/reference/cli.mdx`, `content/docs/reference/compatibility.mdx`, `content/docs/reference/configuration.mdx`, `content/docs/reference/benchmark-results-2026-07-20.mdx`

`+578 / −151` lines across the 23 modified files, plus the 4 new files.

`tsconfig.tsbuildinfo` is generated by `bun run build` and is not covered by `.gitignore`; it was **not** committed. (Adding it to `.gitignore` would have been an unrelated change.)

## 6. Commits

Committed to `origin/main`, in this order:

| SHA | message |
|---|---|
| `c07843e` | `docs(marketing): replace the unreproducible 0.09ms overhead claim with the committed 0.07ms` |
| `1b0f9ad` | `fix(marketing): stop claiming priority admission sheds background work it only queues` |
| `1f04a19` | `docs(marketing): say 0.6.0 is published, MIT licensed, and that npm ships a divergent partial port` |
| `a3d4e88` | `feat(marketing): add the spend ledger section built on \`backstop ledger demo\`` |
| `bcb6c2f` | `docs(docs): add the ledger explanation, chargeback recipe and schema reference` |

(Final SHAs as pushed are listed in §9.)

## 7. Deploy situation

- **There is a Vercel GitHub App installed on `RavaniRoshan/backinstop`**, and it creates a `Production` deployment on push to `main`. No `vercel.json`, no `.vercel/` directory and no `.github/workflows/` in the repository — the project is configured entirely in the Vercel dashboard. So **pushing to `main` is sufficient; nobody needs to trigger a deploy by hand.**
- **However: the last two pushes to `main` both FAILED to deploy.** This is pre-existing and has nothing to do with this change:

  | commit | date | Vercel status |
  |---|---|---|
  | `a2c3e62` fix: suppress hydration mismatch from next-themes | 2026-09-22 | `failure` — "Deployment has failed — run this Vercel CLI command: npx vercel inspect dpl_13xA4XnSYe7RgadU7Yhd1ZYWivHn --logs" |
  | `92a5feb` feat: full marketing landing + Fumadocs docs site | 2026-09-22 | `failure` — `npx vercel inspect dpl_AWRH6qGb6bPbfZFjcDj22mFe8LkM --logs` |
  | `fbb03f3` feat: initialize project scaffolding | 2026-09-20 | `success` |

- **The live site is therefore stale, and by more than one release.** `https://backinstop.vercel.app/` currently serves a build from **before** `92a5feb`. It still advertises `npm install @backstop/sdk` and `pip install backstop-ai` side by side — the fake TypeScript SDK that `92a5feb` was written to remove — and contains none of the docs site. So the live site is presently telling the exact lies this change removes, and it will keep doing so until the Vercel build is fixed.
- I could not diagnose the build failure from here: it needs `npx vercel inspect … --logs` with Vercel credentials, which I do not have. **This is the one item in this report I could not verify**, and it needs a human with Vercel access. The most likely causes, in order: the Vercel project's install/build command is not set to bun (this repo has a `bun.lock` and no `package-lock.json`), or the environment is missing something the build needs. `bun install` + `bun run build` + `bun run lint` all pass locally on this exact tree, so the source is not the problem.
- I was authorised to push and not to create a PR or tag, and I did only that. I did not touch `RavaniRoshan/backstop`.

## 8. Not verified / known remaining

1. **The Vercel build failure** (above). The only blocker to the live site actually changing.
2. **No visual browser pass.** No browser extension is connected to the bridge in this environment, so I verified the rendered DOM, the class census and the rendered text of all 15 routes, but I did not look at a rendered screenshot. The new section uses only existing patterns, and its content is verified, but a human should eyeball `/#ledger` once it is deployed.
3. **The 48.6 ms model's internal arithmetic does not add up** — the four modelled hops are 8.2 + 18.4 + 6.1 + 14.2 = 46.9 ms, not 48.6. This is pre-existing. I labelled the whole panel as a model rather than a measurement, which is the honest fix available without inventing new hop values, and I did not silently restate the numbers. Someone should decide whether to make the model sum to 48.6 or drop the total.
4. **Out-of-scope false claims I found and left alone**, flagged rather than deleted:
   - `components/RuntimeTelemetryWindow.tsx:228` — `Compliant with SOC2 Type II, HIPAA, and air-gapped VPC requirements.` SOC 2 Type II is an organisation-level audit attestation that a library cannot hold. This is a legal claim, not a product fact, so I did not rewrite it unilaterally.
   - `components/ui/navigation-menu-06.tsx:71` — `Multi-Tenant Control`. Upstream: multi-tenant routing is in-process only, and each replica holds its own budget without the `redis` extra. This component is imported only by `components/ui/demo.tsx`, which is not in the built route tree, so it is dead UI — but it is still a false claim if it is ever revived.
   - `components/RuntimeTelemetryWindow.tsx:74` — `API keys remain in environment memory`. Upstream is more careful than that (`virtual_keys` / `secret_provider` are key-adjacent indirection, "not custody"), but this sentence is not strictly false.
5. **The demo's own `## Get this out of your own ledger` and `### What is not shown here` blocks are in the pasted landing output** even though the three commands in them are documented on the how-to page. That is faithful to the real output rather than curated, which is the point of pasting it.
