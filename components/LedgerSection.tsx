'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Receipt, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

// Real output of `backstop ledger demo`, run 2026-09-26 against upstream main
// with no API key and no network. Exit 0. Byte-identical across runs.
const LEDGER_DEMO_OUTPUT = `# Backstop Ledger — Chargeback

- **1967 requests** on 2026-09-26 (day 2026-09-26), priced from the bundled rate card effective **2026-09-26** (\`price_source=bundled\`).
- **Window:** 2026-09-26T00:00:00.000000Z → 2026-09-26T23:59:28.002464Z
- **Grouped by:** team, feature
- **Models:** claude-haiku-4-5, claude-sonnet-4-20250514, gpt-4.1, gpt-4o, vendor-preview-2027
- **Mode:** 100% offline. No API key, no network call, no live provider data, no file. The traffic is synthetic and fixed; every price and every dollar is computed from the bundled rate card with \`Decimal\` arithmetic.

| team | feature | request_count | input_tokens | output_tokens | total_usd | unpriced_requests | unpriced_components |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| payments | checkout-v2 | 388 | 8532297 | 278259 | 26.21 | 0 | cache_write |
| payments | refunds | 96 | 520529 | 101931 | 3.40 | 0 | (none) |
| support | triage | 240 | 516754 | 87934 | 1.76 | 0 | (none) |
| search | query-rewrite | 1140 | 741077 | 165354 | 1.65 | 0 | (none) |
| (unattributed) | (unattributed) | 69 | 396310 | 39882 | 1.54 | 0 | (none) |
| search | vendor-preview | 34 | 82143 | 11300 | 0.00 | 34 | (none) |
| **Total** | all | 1967 | 10789110 | 684660 | **34.56** | 34 | cache_write |

## What a CFO reads first

- **1.54 of 34.56 (4.45%) of priced spend is unattributed** — 69 of 1967 requests declared no \`team\` and no \`feature\`, so nobody can be charged for that money. It is one row in the table, labelled \`(unattributed)\`, and it is the row a pivot table drops. The share is computed on the exact totals — 1.539061 of 34.547570 to six decimal places — so dividing the rounded dollars above will not reproduce it exactly.
- **34 requests (1.73%) have no price at all** — \`vendor-preview-2027\` is not in the rate card. Their cost is *absent, not zero*, so every total above understates real spend by an unknown amount. A guess would make the number wrong in a way nobody could detect; this one is wrong in a way everybody can.
- 1 token component carries no published rate in this window (\`cache_write\`), so the requests that used it are charged zero for it and every affected row names the gap. Those lines are a floor, not a measurement. 9 of 1967 requests carry tokens Backstop estimated locally because the provider reported no usage, so their cost is a floor too. That count and the unpriced one are not disjoint: a request that is both estimated and unpriced is in each, and its cost is absent rather than a floor, which is the weakest figure in this report.

## Delivery (this process)

- submitted: 1967
- written: 1967
- landed (written less the sink's own losses): 1967
- dropped_events (writer buffer full): 0
- writer sink_errors (escaped the sink): 0
- sink sink_errors (counted by the sink): 0
- sink degraded: no
- **lost (dropped + writer errors + sink errors): 0**

This run lost **0** of 1967 events, counted from the live writer. Both counters matter and neither is written to a ledger file: a file read reports them as unknown rather than as zero.

## Joined against your revenue

Backstop does not become a revenue system. You key your own revenue on the same group tuple and the join shows the margin — with a visible \`(none)\` for any group missing on either side, never a silent zero. Here two groups are missing on purpose: \`research/long-context\` has revenue and no spend in this window, and \`search/vendor-preview\` has spend and no revenue here.

\`\`\`csv
team,feature,request_count,total_usd,revenue_usd,margin_usd,match,currency
payments,checkout-v2,388,26.21,148230.00,148203.79,both,USD
payments,refunds,96,3.40,41200.00,41196.60,both,USD
support,triage,240,1.76,96450.00,96448.24,both,USD
search,query-rewrite,1140,1.65,78500.00,78498.35,both,USD
(unattributed),(unattributed),69,1.54,(none),(none),cost_only,USD
research,long-context,(none),(none),12000.00,(none),revenue_only,USD
search,vendor-preview,34,0.00,(none),(none),cost_only,USD
\`\`\`

## Get this out of your own ledger

\`\`\`bash
backstop ledger demo                        # this table, offline
backstop ledger show   --path ledger.jsonl   # integrity + chargeback
backstop ledger export --path ledger.jsonl --out chargeback.csv \\
                       --group-by team,feature
\`\`\`

### What is not shown here

- The requests are synthetic, so the *volume* is a scenario. The *dollars* are exact for that volume under the bundled rate card.
- The rate card is a snapshot dated 2026-09-26. A negotiated price belongs in a catalog file or a per-call override, and outranks it.
- One day of one shape is not a trend. Read \`unpriced_requests\` and \`unpriced_components\` before you read the total, and group by \`customer\` or \`cost_center\` if those are how you bill.`;

const LEDGER_FACTS: {
  label: string;
  title: string;
  body: string;
  code?: string;
}[] = [
  {
    label: 'THE RECORD',
    title: 'SpendEvent 1.0 — 18 fields',
    body:
      'One frozen, validated record per completed provider request: provider, model, normalised endpoint, priority, outcome, four token counts, latency, retries, your attribution and a priced cost breakdown. An unknown key and a missing key are both errors naming the offender, so a truncated line cannot reload as plausible data.',
  },
  {
    label: 'THE ATTRIBUTION',
    title: '13 dimensions, two lines',
    body:
      'team, agent, session, task, feature, surface, customer, tenant, environment, repo, cost_center, gl_code, currency. You declare who is spending once, at the top of the function that spends it. Scopes merge, the outer value is restored on exit, and a process that declares nothing records an all-None attribution rather than a guess.',
    code: 'with attribution(team="payments",\n              feature="checkout-v2"):\n    client.chat.completions.create(...)',
  },
  {
    label: 'THE MONEY',
    title: 'Decimal end to end, string on the wire',
    body:
      'Every amount crosses the wire as a string, never a JSON number, because a JSON number comes back as a binary float and a finance export that loses cents is worse than one that is awkward to parse. The CSV renders money to two decimals in a stable column order.',
  },
  {
    label: 'THE GAP',
    title: 'An unknown price is a hole, not a guess',
    body:
      'A model missing from the rate card yields cost=None and a counted unpriced_requests. There is no default rate and no neighbouring-model fallback, because a chargeback that is quietly wrong is worse than one that is absent. The 34 requests in the vendor-preview row above are counted; their dollars are absent.',
  },
];

export function LedgerSection() {
  return (
    <section
      id="ledger"
      className="relative bg-card py-20 px-6 md:px-12 border-b border-foreground/20 overflow-hidden"
    >
      <div className="max-w-[1242px] mx-auto relative z-10">
        {/* Section header — the existing shape: square, mono label, bold heading */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-primary inline-block" />
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                THE SPEND LEDGER
              </span>
            </div>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-foreground tracking-tight max-w-3xl">
              The guardrail now tells finance what yesterday cost — and what it
              could not measure
            </h2>
            <p className="text-[15px] md:text-[16px] opacity-90 leading-relaxed mt-3 max-w-3xl">
              Enforcement stops a runaway loop. It does not tell anyone which
              team spent the money. Opt in with one config field and every
              completed provider request appends a priced, attributed record to
              a file you own. A CFO trusts a number that names its own gaps, so
              the gaps are columns beside the money, not a footnote.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <span className="px-2.5 py-1 bg-card border border-foreground/30 font-mono-jet text-xs font-bold text-primary shadow-xs">
              OPT-IN · OFF BY DEFAULT
            </span>
            <span className="px-2.5 py-1 bg-primary text-primary-foreground font-mono-jet text-xs font-bold shadow-xs">
              0 BYTES EGRESS
            </span>
          </div>
        </div>

        {/* Terminal window: the real demo output, verbatim */}
        <div className="border border-foreground/30 bg-card shadow-md mb-6">
          <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[11px] font-pixel tracking-wider">
            <div className="flex items-center gap-2">
              <span>$ backstop ledger demo</span>
              <span className="opacity-70 hidden sm:inline">
                {'// NO API KEY · NO NETWORK · NO FILE'}
              </span>
            </div>
            <span className="font-mono-jet text-[10px] font-bold">EXIT 0</span>
          </div>

          <div className="p-3.5 bg-card">
            <pre className="font-mono-jet text-[11px] leading-relaxed text-card-foreground max-h-[420px] overflow-y-auto">
              {LEDGER_DEMO_OUTPUT}
            </pre>
          </div>

          <div className="p-3 border-t border-foreground/20 bg-muted/50 flex flex-wrap items-center justify-between gap-2 font-mono-jet text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary inline-block" />
              <span className="font-bold text-foreground">
                REAL OUTPUT · 2026-09-26 · BYTE-IDENTICAL ACROSS RUNS
              </span>
            </div>
            <Link
              href="/docs/how-to/export-a-chargeback"
              className="underline hover:text-primary font-bold"
            >
              Run it on your own ledger →
            </Link>
          </div>
        </div>

        {/* What makes it credible, and what it is not */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="border border-foreground/30 bg-card p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-primary" />
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                WHAT THE REPORT ADMITS
              </span>
            </div>
            <ul className="space-y-2.5 font-mono-jet text-[12px] leading-relaxed">
              <li>
                <span className="font-bold">Unattributed spend is a row, not a blank cell.</span>{' '}
                4.45% of priced spend in that window belongs to nobody. An unset
                dimension renders as <span className="font-bold">(unattributed)</span>{' '}
                — the row a pivot table drops.
              </li>
              <li>
                <span className="font-bold">A missing rate is counted, not filled.</span>{' '}
                34 requests have no price at all, so every total above understates
                real spend by an unknown amount. Absent, not zero.
              </li>
              <li>
                <span className="font-bold">Floors are labelled as floors.</span> A token
                component with no published rate is charged zero <em>and named</em> in
                the row, and requests whose tokens were estimated locally are
                flagged <span className="font-bold">estimated_requests</span>.
              </li>
              <li>
                <span className="font-bold">The loss report is separate from the money.</span>{' '}
                Submitted, written, dropped and errors are counted from the live
                writer. Read from a file, a loss counter is reported{' '}
                <span className="font-bold">unknown</span> — never as zero, because a
                zero would be a claim about a process the reader cannot see.
              </li>
              <li>
                <span className="font-bold">The join shows its holes.</span> A group
                missing on either side carries a visible{' '}
                <span className="font-bold">(none)</span> and a match column —{' '}
                <span className="font-bold">both</span>,{' '}
                <span className="font-bold">cost_only</span> or{' '}
                <span className="font-bold">revenue_only</span> — so margin is absent
                rather than silently zero.
              </li>
            </ul>
          </div>

          <div className="border border-foreground/30 bg-card p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-primary" />
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                WHAT IT IS NOT — STILL
              </span>
            </div>
            <ul className="space-y-2 font-mono-jet text-[12px] leading-relaxed">
              <li>
                <span className="font-bold">Not a metrics backend.</span> A file, or a
                bounded in-memory ring. Nothing ships to a collector, nothing is
                queried over HTTP.
              </li>
              <li>
                <span className="font-bold">Not a revenue system.</span> It joins cost
                against a revenue map you supply, on group keys you choose.
              </li>
              <li>
                <span className="font-bold">Not a control plane, and not multi-tenant.</span>{' '}
                One file per process. Rotation, archival, retention and querying are
                yours.
              </li>
              <li>
                <span className="font-bold">Not a forecast.</span>{' '}
                <span className="font-mono-jet">backstop.forecast</span> projects budget
                exhaustion from a measured burn rate; the ledger is a record of what
                happened, not a model of what will.
              </li>
              <li>
                <span className="font-bold">No cross-customer benchmarks.</span> Nothing
                aggregates across deployments, so the demo&apos;s numbers are a
                scenario and not a reference.
              </li>
              <li>
                <span className="font-bold">No framework-native attribution.</span> No
                LangChain, LlamaIndex, CrewAI or AutoGen hook reads a run for you —
                attribution is exactly what your call sites declare.
              </li>
              <li>
                <span className="font-bold">No invoice reconciliation.</span> The ledger
                is never compared to the provider&apos;s bill. That is the gap.
              </li>
            </ul>
          </div>
        </div>

        {/* The four facts, in the existing bordered-card pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {LEDGER_FACTS.map((fact) => (
            <div key={fact.label} className="border border-foreground/30 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-primary inline-block" />
                <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                  {fact.label}
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-foreground tracking-tight">
                {fact.title}
              </h3>
              <p className="text-[14px] opacity-90 leading-relaxed mt-2">
                {fact.body}
              </p>
              {fact.code && (
                <pre className="font-mono-jet text-[11px] leading-relaxed bg-muted border border-foreground/20 p-2.5 mt-3 overflow-x-auto text-foreground">
                  {fact.code}
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Detection: four detectors, shadow by default, report-only */}
        <div className="border border-foreground/30 bg-card p-5 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-primary inline-block" />
                <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                  RUNAWAY-SPEND DETECTION
                </span>
              </div>
              <h3 className="font-sans font-bold text-2xl text-foreground tracking-tight">
                Four detectors. Shadow mode on by default. It cannot stop anything.
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 bg-card border border-foreground/30 font-mono-jet text-xs font-bold text-foreground shadow-xs">
                REPORT-ONLY
              </span>
              <span className="px-2.5 py-1 bg-primary text-primary-foreground font-mono-jet text-xs font-bold shadow-xs">
                SHADOW DEFAULT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono-jet text-[12px] leading-relaxed mb-4">
            <div>
              <span className="font-bold text-primary">velocity</span> — priced spend
              per minute in the window, over threshold.
            </div>
            <div>
              <span className="font-bold text-primary">drift</span> — mean tokens per
              request in the recent half, over the older half.
            </div>
            <div>
              <span className="font-bold text-primary">retry amplification</span> — mean
              retries per request, over threshold.
            </div>
            <div>
              <span className="font-bold text-primary">context growth</span> — this
              request&apos;s input tokens, over the window&apos;s median.
            </div>
          </div>

          <p className="text-[14px] opacity-90 leading-relaxed">
            Each signal is a record. It cannot block a request, cancel work, kill an
            agent, or raise — that is structural, not a promise, and a test walks the
            public API for a verb that could. Auto-kill is absent on purpose: a
            legitimate agent run can be six hours of work, and a kill switch that
            cannot resume destroys it. Shadow mode means the same signals are also
            filed and counted, so a threshold can be tuned against evidence before it
            can interrupt anybody.
          </p>
        </div>

        {/* The cost, stated with its condition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 border border-foreground/30 bg-card p-5 shadow-sm flex flex-col justify-center">
            <div className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
              WHAT IT COSTS
            </div>
            <p className="text-[14px] opacity-90 leading-relaxed">
              Enforcement, with the ledger off — the default — is the 0.07 ms control
              path above. The ledger is <span className="font-bold">not free</span>, and
              the number is measured rather than promised: with the ledger on a request
              roughly doubles in cost, around{' '}
              <span className="font-bold">+130 to +147 microseconds p50</span> on a ~150
              microsecond request, over 7 alternating runs on Python 3.12.3 and Linux,
              with the ledger off at +3 to +5 microseconds. An agent LLM call takes
              seconds, so this is invisible in practice. It is still larger than the
              library&apos;s entire advertised overhead budget, and the honest claim is
              that we publish it.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-foreground/30 bg-card p-5 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Receipt size={14} className="text-primary" />
                <span className="font-mono-jet text-[10px] font-bold uppercase tracking-wider text-primary">
                  RECIPE
                </span>
              </div>
              <Link
                href="/docs/how-to/export-a-chargeback"
                className="font-sans font-semibold text-[15px] underline underline-offset-4 hover:text-primary"
              >
                Export a chargeback →
              </Link>
            </div>
            <div className="border border-foreground/30 bg-card p-5 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Scale size={14} className="text-primary" />
                <span className="font-mono-jet text-[10px] font-bold uppercase tracking-wider text-primary">
                  REFERENCE
                </span>
              </div>
              <Link
                href="/docs/reference/ledger-schema"
                className="font-sans font-semibold text-[15px] underline underline-offset-4 hover:text-primary"
              >
                The 18 fields →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-foreground/20 flex flex-wrap items-center justify-between gap-3 font-mono-jet text-[11px]">
          <span className="opacity-80">
            MIT LICENSED · <span className="font-bold">backstop-ai</span> 0.6.0 ON PyPI,
            npm AND THE v0.6.0 GITHUB RELEASE — LEDGER SHIPS ON MAIN, PAST THE TAG
          </span>
          <Link
            href="/docs/explanation/what-the-ledger-is"
            className="inline-flex items-center gap-1 underline hover:text-primary font-bold"
          >
            Why this is not an observability tool <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
