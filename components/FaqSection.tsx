'use client';

import React, { useState } from 'react';
import { CubeLogo } from './CubeLogo';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: '1 What Is Backstop?',
    answer:
      'Backstop is an in-process reliability layer for the OpenAI and Anthropic Python SDKs. It provides backpressure, hard budget enforcement, autonomous circuit breaking, and granular telemetry for multi-agent workflows—with zero external proxies and sub-millisecond latency overhead.',
  },
  {
    id: 2,
    question: '2 Why In-Process Instead Of A Hosted Reverse Proxy?',
    answer:
      'Hosted proxies (like Cloudflare AI Gateway, Portkey, or LiteLLM servers) add a network round trip to every call — the order of tens of milliseconds in practice, and a rule of thumb rather than a Backstop measurement. They also create a single point of failure and force your prompts and provider credentials to transit third-party infrastructure. Backstop runs inside your process: zero proxy hops, zero third-party egress.',
  },
  {
    id: 3,
    question: '3 How Does Backstop Prevent Multi-Agent Runaway Spend?',
    answer:
      'Autonomous agent loops can easily get trapped in infinite reasoning or recursion cycles, burning thousands of dollars in minutes. Backstop tracks cumulative token counts locally in real time. Once an agent or session hits its assigned token ceiling, Backstop raises BudgetExceededError before the request is dispatched, so nothing is spent.',
  },
  {
    id: 4,
    question: '4 How Does Circuit Breaking Handle 429 & 503 Provider Outages?',
    answer:
      'When Anthropic or OpenAI return HTTP 429 (Rate Limit Exceeded) or 503 (Service Unavailable), naive retry logic creates a catastrophic "retry storm" that amplifies the outage. Backstop applies its own backoff and an in-process state machine (Closed → Half-Open → Open). While the circuit is open, requests fail fast with CircuitBreakerOpenError before dispatch instead of piling onto a provider that is already failing.',
  },
  {
    id: 5,
    question: '5 Can Backstop Automatically Fallback Between Providers?',
    answer:
      'No. By design Backstop is not a multi-provider router and does not route requests between model providers. If you need automatic cross-provider fallback, compose Backstop with a router such as LiteLLM in front of your wrapped client. Backstop still enforces budgets and circuit breaking on every call that flows through it.',
  },
  {
    id: 6,
    question: '6 Does Backstop Touch My Prompts Or Alter Model Outputs?',
    answer:
      'No. Backstop intercepts only the transport and socket connection layer (httpx). It never reads, alters, or tokenizes your prompt contents or completions, maintaining strict compliance and zero semantic degradation.',
  },
  {
    id: 7,
    question: '7 What SDKs And Frameworks Are Supported?',
    answer:
      'Backstop wraps the official Python SDKs for OpenAI (>=2.37,<4) and Anthropic (>=0.98,<2) on Python 3.10–3.12. It interoperates with LangChain, LlamaIndex, CrewAI, and AutoGen only at the SDK level (not via framework-specific hooks). See the SDK compatibility matrix for the full version range.',
  },
  {
    id: 8,
    question: '8 What Is The Latency Overhead?',
    answer:
      '0.07 ms of control-path overhead — the same figure at p50, p95 and p99 — in the single snapshot the repository commits: 1,000 requests through a local httpx.MockTransport, no network, seed 0x00C0FFEE, recorded 2026-07-20. That snapshot does not record the host CPU, OS, Python version or SDK version, so it is one recorded run rather than a guarantee. Re-measure on your own host with backstop benchmark. The opt-in spend ledger is not this cheap: with it enabled a request roughly doubles in cost, and docs/ledger.md publishes that measurement.',
  },
  {
    id: 9,
    question: '9 How Do I Install And Configure It?',
    answer:
      'Installation is a single line: pip install "backstop-ai[anthropic]". 0.6.0 is published — on PyPI as backstop-ai, on npm as backstop-ai, and as the v0.6.0 GitHub Release — and the project is MIT licensed. The default branch carries unreleased work past that tag, so pip install -e ".[anthropic]" tracks main rather than the release. You wrap your existing client initialization: "client = Backstop.wrap(OpenAI(), budget=50_000, config=BackstopConfig(initial_concurrency=4))". Existing code remains unchanged.',
  },
  {
    id: 10,
    question: '10 Is Backstop Open Source?',
    answer:
      'Yes. Backstop is MIT licensed. The complete source code, tests, and documentation are hosted on GitHub at https://github.com/RavaniRoshan/backstop.',
  },
];

export function FaqSection({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const [openIds, setOpenIds] = useState<number[]>([1]);

  const toggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-foreground text-background py-24 px-6 md:px-16 relative">
      {/* Corner Crop Ticks */}
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute -top-6 -left-6 opacity-40 font-mono-jet text-xs select-none">
          ⌐
        </div>
        <div className="absolute -top-6 -right-6 opacity-40 font-mono-jet text-xs select-none">
          ¬
        </div>
        <div className="absolute -bottom-6 -left-6 opacity-40 font-mono-jet text-xs select-none">
          ⩆
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-40 font-mono-jet text-xs select-none">
          ∵
        </div>

        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-background text-foreground text-[10px] font-mono-jet px-3 py-1 font-bold mb-4">
            BACKSTOP.FAQ.01
          </span>
          <h2 className="text-4xl md:text-6xl font-sans-dm font-semibold tracking-tight">
            Reliability Layer FAQ.
          </h2>
          <p className="mt-3 text-sm md:text-base opacity-75 max-w-xl mx-auto font-mono-jet">
            Everything you need to know about in-process AI backpressure, budgets, and circuit breaking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Accordion Questions Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="border-l-2 border-dashed border-background/30 pl-4 py-2 transition-colors"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between text-left group py-1 cursor-pointer"
                  >
                    <span className="font-mono-jet text-[13px] md:text-[14px] text-background group-hover:text-secondary tracking-wide transition-colors">
                      {item.question}
                    </span>
                    <span className="w-6 h-6 shrink-0 border border-background flex items-center justify-center text-[10px] font-mono-jet ml-3 hover:bg-background hover:text-foreground transition-colors">
                      {isOpen ? '∧' : '∨'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-2 text-background/90 text-[15px] md:text-[16px] font-normal leading-relaxed pr-4 pt-1 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Rail: [B.64] + cube mark in crop ticks */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Install Box */}
            <div className="border border-background/30 p-4 bg-background/5">
              <div className="flex items-center justify-between pb-2 border-b border-background/20 text-[10px] font-mono-jet opacity-70">
                <span>TERMINAL INSTALL</span>
                <span>0.6.0 · MIT</span>
              </div>
              <div className="font-mono-jet text-[11px] break-all leading-tight mt-3 select-all bg-background/10 p-2.5 border border-background/20 space-y-2">
                <div className="text-secondary">$ pip install &quot;backstop-ai[anthropic]&quot;</div>
                <div className="text-background/80">$ backstop verify  # 30-second keyless proof</div>
              </div>
              <div className="mt-3 text-[10px] font-mono-jet opacity-60 flex justify-between">
                <span>IN-PROCESS HOOK</span>
                <span>+0.07ms LATENCY</span>
              </div>
            </div>

            {/* Shield Mark in Crop-Ticks */}
            <div className="border border-background/30 p-8 flex flex-col items-center justify-center text-center relative bg-background/5">
              <div className="absolute top-2 left-2 opacity-40 font-mono-jet text-xs">
                ⌐
              </div>
              <div className="absolute top-2 right-2 opacity-40 font-mono-jet text-xs">
                ¬
              </div>
              <div className="absolute bottom-2 left-2 opacity-40 font-mono-jet text-xs">
                ⩆
              </div>
              <div className="absolute bottom-2 right-2 opacity-40 font-mono-jet text-xs">
                ∵
              </div>

              <CubeLogo size={64} strokeColor="currentColor" strokeWidth={2} />
              <div className="font-sans-dm font-semibold text-xl text-background mt-4">
                Backstop
              </div>
              <div className="text-[11px] font-mono-jet opacity-75 mt-1">
                In-Process Reliability Engine
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 w-full">
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2 bg-background text-foreground font-mono-jet text-xs font-bold hover:bg-secondary transition-colors text-center"
                >
                  GitHub Repo ↗
                </a>
                <button
                  onClick={onOpenWaitlist}
                  className="px-4 py-2 border border-background text-background font-mono-jet text-xs font-bold hover:bg-background/20 transition-colors cursor-pointer"
                >
                  Get Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
