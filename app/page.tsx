'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { CubeLogo } from '@/components/CubeLogo';
import { DitherCloudCanvas } from '@/components/DitherCloudCanvas';
import { WireframeCube } from '@/components/WireframeCube';
import { RuntimeTelemetryWindow } from '@/components/RuntimeTelemetryWindow';
import { DitherSphere } from '@/components/DitherSphere';
import { CostChartWindow } from '@/components/CostChartWindow';
import { SpeedComparison } from '@/components/SpeedComparison';
import { WorkflowChart } from '@/components/WorkflowChart';
import { FaqSection } from '@/components/FaqSection';
import { BootLoader } from '@/components/BootLoader';
import { WaitlistDialog } from '@/components/WaitlistDialog';
import { BenchmarkWindow } from '@/components/BenchmarkWindow';
import { LedgerSection } from '@/components/LedgerSection';
import { PatentCollage } from '@/components/PatentCollage';
import { FooterSection } from '@/components/FooterSection';
import { NavigationHeader } from '@/components/NavigationHeader';
import { InteractivePrimitives } from '@/components/InteractivePrimitives';
import { GsapEffects } from '@/components/GsapEffects';
import { Moon, Sun, Check, Copy, Shield, Zap, Lock, Activity } from 'lucide-react';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'waitlist' | 'discord' | 'signin' | 'news'>('waitlist');
  const [copiedCode, setCopiedCode] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const openModal = (mode: 'waitlist' | 'discord' | 'signin' | 'news' = 'waitlist') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const pyCode = `from openai import OpenAI
from backstop import Backstop, BackstopConfig
from backstop.exceptions import BudgetExceededError

# Wrap a standard client in-process — zero proxy hop, zero egress
client = Backstop.wrap(
    OpenAI(),
    budget=50_000,          # hard token ceiling for this session
    config=BackstopConfig(initial_concurrency=4),
)

try:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello"}],
    )
except BudgetExceededError:
    print("Budget hit — no runaway loop possible.")
`;

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground font-sans">
      {/* GSAP Page-wide Animation Enhancer */}
      <GsapEffects />

      {/* In-process boot loader progress */}
      <BootLoader />

      {/* Interactive modal dialog */}
      <WaitlistDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultMode={modalMode}
      />

      {/* =========================================================================
          GLOBAL NAVIGATION (Scroll-Aware, Responsive, Mobile Drawer & Quick Install)
          ========================================================================= */}
      <NavigationHeader
        isDark={isDark}
        onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
        onOpenModal={(mode) => openModal(mode)}
      />

      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section className="relative pt-24 sm:pt-28 pb-20 overflow-hidden bg-background">
        {/* Full-bleed dithered wave canvas with bottom fade */}
        <DitherCloudCanvas />

        {/* Retro Release News Dialog over the dither wave */}
        <div className="relative -mt-20 md:-mt-24 z-20 flex justify-center px-4">
          <div className="w-full max-w-xl bg-card border-retro-double-card border-foreground/40 shadow-lg">
            {/* Title bar */}
            <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between text-[11px] font-pixel tracking-wider">
              <div className="flex items-center gap-1.5">
                <span>Release Notes ▪ Backstop In-Process Engine</span>
                <span className="inline-block w-2 h-3.5 bg-primary-foreground animate-blink" />
              </div>
              <button
                onClick={() => openModal('news')}
                className="text-[10px] hover:opacity-80 cursor-pointer"
              >
                ⊠
              </button>
            </div>

            {/* News Body */}
            <div className="p-3.5 bg-card text-card-foreground font-mono-jet text-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="font-medium leading-snug">
                0.6.0 is published, and main now ships an opt-in priced spend
                ledger
              </p>
              <Link
                href="/docs/explanation/what-the-ledger-is"
                className="text-right underline font-bold hover:text-primary shrink-0"
              >
                Read the ledger ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content Container with Crop-Mark Corner Ticks */}
        <div className="max-w-[1242px] mx-auto px-6 md:px-12 mt-12 relative">
          {/* Corner ticks */}
          <div className="absolute top-0 left-2 opacity-50 font-mono-jet text-sm select-none pointer-events-none">
            ⌐
          </div>
          <div className="absolute top-0 right-2 opacity-50 font-mono-jet text-sm select-none pointer-events-none">
            ¬
          </div>
          <div className="absolute bottom-0 left-2 opacity-50 font-mono-jet text-sm select-none pointer-events-none">
            ⩆
          </div>
          <div className="absolute bottom-0 right-2 opacity-50 font-mono-jet text-sm select-none pointer-events-none">
            ∵
          </div>

          {/* Decorative vertical badge on hero edge */}
          <div className="hidden xl:block absolute -left-10 top-12 writing-vertical-lr text-[10px] font-mono-jet opacity-40 tracking-wider select-none pointer-events-none">
            0xBF8_TRANSPORT_HOOK // [BACKSTOP.IN_PROCESS.RELIABILITY]
          </div>

          {/* Eyebrow Row */}
          <div className="gsap-hero-badge flex items-center justify-between py-4 text-[15px] md:text-[17px] font-mono-jet opacity-85 max-w-3xl mx-auto">
            <span>In-Process Reliability</span>
            <span className="flex-1 mx-4 text-center tracking-widest opacity-30 overflow-hidden select-none">
              ................................................................
            </span>
            <span className="text-right shrink-0">Zero cloud proxies. Zero latency.</span>
          </div>

          {/* Massive Display H1 */}
          <h1 className="gsap-hero-title text-center font-sans font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[98px] leading-[0.96] tracking-tight max-w-5xl mx-auto my-6 text-foreground">
            The In-Process Reliability Layer For AI SDKs
          </h1>

          <p className="gsap-hero-sub text-center text-base sm:text-lg md:text-xl font-normal max-w-3xl mx-auto opacity-85 leading-relaxed">
            Backpressure, hard budget enforcement, circuit breaking, and a priced, attributed spend ledger for multi-agent workflows. Intercepts transport calls directly inside your runtime without routing prompts through third-party servers.
          </p>

          {/* Terminal Install Strip */}
          <div className="gsap-hero-cta mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-card border border-foreground/30 shadow-xs font-mono-jet text-xs md:text-sm">
              <span className="text-primary font-bold">$</span>
              <span className="text-foreground">pip install &quot;backstop-ai[anthropic]&quot;</span>
              <span className="opacity-40">|</span>
              <span className="text-[10px] opacity-80">0.6.0 published · PyPI backstop-ai · MIT licensed</span>
              <button
                onClick={() => copySnippet('pip install "backstop-ai[anthropic]"')}
                className="ml-2 text-xs opacity-70 hover:opacity-100 hover:text-primary transition-colors cursor-pointer"
                title="Copy install command"
              >
                {copiedCode ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* CTA Row */}
          <div className="gsap-hero-cta flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-8 pb-10">
            <a
              href="https://github.com/RavaniRoshan/backstop"
              target="_blank"
              rel="noreferrer"
              className="gsap-retro-btn font-sans font-bold text-2xl sm:text-4xl md:text-5xl text-foreground underline underline-offset-8 decoration-2 hover:decoration-4 hover:text-primary transition-all"
            >
              Star on GitHub ↗
            </a>
            <span className="text-2xl opacity-30 select-none">·</span>
            <Link
              href="/docs"
              className="gsap-retro-btn font-sans font-bold text-2xl sm:text-4xl md:text-5xl text-foreground underline underline-offset-8 decoration-2 hover:decoration-4 hover:text-primary transition-all"
            >
              Read the Docs →
            </Link>
            <span className="text-2xl opacity-30 select-none">·</span>
            <button
              onClick={() => openModal('waitlist')}
              className="gsap-retro-btn font-sans font-bold text-2xl sm:text-4xl md:text-5xl text-foreground underline underline-offset-8 decoration-2 hover:decoration-4 hover:text-primary transition-all cursor-pointer"
            >
              Get Updates
            </button>
          </div>
        </div>
      </section>

      {/* Act Boundary Marquee Ticker */}
      <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden select-none border-y border-foreground/30">
        <div className="animate-ticker text-[11px] font-mono-jet tracking-widest uppercase font-bold">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-4">
              <span>∵ ⩆ BACKSTOP</span>
              <span>•</span>
              <span>IN-PROCESS TRANSPORT GUARD</span>
              <span>•</span>
              <span>ZERO PROXY HOPS</span>
              <span>•</span>
              <span>HARD BUDGET CEILINGS</span>
              <span>•</span>
              <span>PRICED SPEND LEDGER</span>
              <span>•</span>
              <span>CASCADE PREVENTER</span>
              <span>⩆ ∵</span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          FLAGSHIP TERMINAL DEMO
          ========================================================================= */}
      <section
        id="demo"
        className="relative bg-background py-20 px-6 md:px-12 border-b border-foreground/20"
      >
        <div className="max-w-[1242px] mx-auto">
          {/* Section header — the existing shape: square, mono label, bold heading */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-primary inline-block" />
                <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                  THE FLAGSHIP DEMO
                </span>
              </div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl text-foreground tracking-tight max-w-3xl">
                Forty-two seconds, no API key, and a chargeback that prints what
                it could not measure
              </h2>
              <p className="text-[15px] md:text-[16px] opacity-90 leading-relaxed mt-3 max-w-3xl">
                A terminal capture of one command.{' '}
                <span className="font-mono-jet text-[14px]">backstop ledger demo</span>{' '}
                prices 1,967 fixed requests per team and per feature from the
                bundled rate card, with no API key, no network call and no file —
                run it yourself and you get the same bytes back. 69 of those
                requests declared no team and no feature, so $1.54 of the $34.56
                — 4.45% of priced spend — belongs to nobody, and it is printed as
                a row instead of dropped. Another 34 sit on a model the rate card
                does not carry, so their cost is absent rather than zero. A CFO
                trusts a number that names its own gaps.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <span className="px-2.5 py-1 bg-card border border-foreground/30 font-mono-jet text-xs font-bold text-primary shadow-xs">
                RENDERED CAPTURE · NOT A SCREEN RECORDING
              </span>
              <span className="px-2.5 py-1 bg-primary text-primary-foreground font-mono-jet text-xs font-bold shadow-xs">
                KEYLESS · OFFLINE
              </span>
            </div>
          </div>

          {/* Terminal window: the flagship capture, embedded verbatim */}
          <div className="border border-foreground/30 bg-card shadow-md">
            <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[11px] font-pixel tracking-wider">
              <div className="flex items-center gap-2">
                <span>$ backstop ledger demo --group-by team,feature</span>
                <span className="opacity-70 hidden sm:inline">
                  {'// NO API KEY · NO NETWORK · NO FILE'}
                </span>
              </div>
              <span className="font-mono-jet text-[10px] font-bold">EXIT 0</span>
            </div>

            <div className="p-2.5 bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element --
                  a 2.4MB animated single-play GIF gains nothing from the image
                  optimiser, and next/image would add a runtime failure mode for
                  no benefit. Pinned byte-exact in usecases/. */}
              <img
                src="/demo.gif"
                alt="A terminal session where a backend architect reads a repo, wraps a client, turns the ledger on, prices every request, builds a per-team chargeback, hits a real CSV error, admits an unpriced model and an unattributed share, and settles"
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </div>

            <div className="p-3 border-t border-foreground/20 bg-muted/50 flex flex-wrap items-center justify-between gap-2 font-mono-jet text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary inline-block" />
                <span className="font-bold text-foreground">
                  TERMINAL CAPTURE · 1552×992 · 42.4s · LAZY-LOADED, NO IMAGE
                  OPTIMISER
                </span>
              </div>
              <Link
                href="/docs/explanation/what-the-ledger-is"
                className="underline hover:text-primary font-bold"
              >
                What the ledger is not →
              </Link>
            </div>
          </div>

          {/* The one caveat the capture cannot state for itself */}
          <div className="border border-foreground/30 bg-card p-5 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-primary inline-block" />
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                WHAT THE CAPTURE IS NOT
              </span>
            </div>
            <p className="text-[14px] opacity-90 leading-relaxed">
              The traffic is synthetic and fixed, so the request counts are a
              scenario and the dollars are exact only for that volume under a
              rate card dated 2026-09-26. It is a rendered capture, not a screen
              recording: every figure on it is either a real fact from the
              repository or a labelled scenario number. And it does not reconcile
              against a provider invoice —{' '}
              <span className="font-bold">backstop ledger show</span> reads
              Backstop&apos;s own file and cannot read OpenAI&apos;s or
              Anthropic&apos;s. That gap is the honest limit of the picture above.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CORE PRIMITIVES & RETRO DESKTOP
          ========================================================================= */}
      <section
        id="primitives"
        className="relative bg-card py-20 px-6 md:px-12 border-b border-foreground/20 overflow-hidden"
      >
        {/* Giant Halftone Dither Spheres in the background animated with GSAP */}
        <div className="absolute -top-12 left-10 opacity-20 pointer-events-none gsap-floating-sphere-1">
          <DitherSphere size={320} />
        </div>
        <div className="absolute top-1/3 -right-20 opacity-20 pointer-events-none gsap-floating-sphere-2">
          <DitherSphere size={440} />
        </div>
        <div className="absolute -bottom-20 left-1/4 opacity-15 pointer-events-none gsap-floating-sphere-3">
          <DitherSphere size={360} />
        </div>

        {/* Content container */}
        <div className="max-w-[1242px] mx-auto relative z-10">
          {/* Tag chip top-left */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-mono-jet font-bold tracking-widest border border-foreground/30">
                BACKSTOP.PRIMITIVES
              </span>
              <span className="hidden sm:inline text-xs font-mono-jet font-bold text-foreground">
                {"// SYSTEM ARCHITECTURE & INTERACTIVE RUNTIME"}
              </span>
            </div>
            <div className="text-[11px] font-mono-jet opacity-80">
              IN-PROCESS ENFORCEMENT + LOCAL LEDGER
            </div>
          </div>

          {/* Core Interactive Primitives Simulator Engine */}
          <InteractivePrimitives onOpenWaitlist={() => openModal('waitlist')} />

          {/* System Workbench: Empirical Benchmarks & Runtime Telemetry */}
          <div className="mt-14 pt-10 border-t border-foreground/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-primary inline-block" />
                  <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                    EMPIRICAL VERIFICATION &amp; RUNTIME STATE
                  </span>
                </div>
                <h3 className="font-sans font-bold text-2xl md:text-3xl text-foreground tracking-tight">
                  Zero-Egress Architecture vs Remote Proxies
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2.5 py-1 bg-card border border-foreground/30 font-mono-jet text-xs font-bold text-primary shadow-xs">
                  0.07ms p99 OVERHEAD
                </span>
                <span className="px-2.5 py-1 bg-primary text-primary-foreground font-mono-jet text-xs font-bold shadow-xs">
                  0 BYTES EGRESS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Latency Benchmark Matrix (6 cols) */}
              <div id="benchmarks" className="lg:col-span-6 flex flex-col">
                <BenchmarkWindow />
              </div>

              {/* Right Column: Live In-Process Telemetry & Socket Pool Inspector (6 cols) */}
              <div className="lg:col-span-6 flex flex-col">
                <RuntimeTelemetryWindow />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CODE INTEGRATION & SPEED DEMO
          ========================================================================= */}
      <section
        id="architecture"
        className="relative bg-background py-20 px-6 md:px-12 border-b border-foreground/20"
      >
        <div className="max-w-[1242px] mx-auto">
          {/* Section Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-sans font-bold text-foreground leading-[0.96] tracking-tight mb-12">
            Why Remote AI Gateways Are The Wrong Abstraction
          </h2>

          {/* 3 Text Columns on Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-foreground/20 pt-8 mb-16">
            {/* Column 1 */}
            <div className="md:col-span-4 border-l-2 border-primary pl-4 space-y-2">
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                [01] ZERO NETWORK PROXY HOPS
              </span>
              <p className="text-[15px] md:text-[16px] opacity-90 leading-relaxed">
                Hosted reverse proxies (Cloudflare AI Gateway, Portkey, LiteLLM) force every LLM call to make an extra cloud roundtrip (adding 30–60ms of overhead). Backstop runs in-process with a microsecond-level CPU check before making a direct TLS connection.
              </p>
            </div>

            {/* Column 2 */}
            <div className="md:col-span-4 border-l-2 border-primary pl-4 space-y-2">
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                [02] ZERO DATA EGRESS OR KEY EXPOSURE
              </span>
              <p className="text-[15px] md:text-[16px] opacity-90 leading-relaxed">
                Passing user prompts, chat histories, and master provider API keys through a third-party gateway creates unnecessary compliance liability and outage risk. Backstop requires zero external credentials and transmits zero telemetry off-box.
              </p>
            </div>

            {/* Column 3 */}
            <div className="md:col-span-4 border-l-2 border-primary pl-4 space-y-2">
              <span className="font-mono-jet text-[11px] font-bold uppercase tracking-wider text-primary">
                [03] IN-PROCESS CONCURRENCY ENFORCEMENT
              </span>
              <p className="text-[15px] md:text-[16px] opacity-90 leading-relaxed">
                The admission gate queues requests once the concurrency limit is
                reached and admits them in priority order — critical, then default,
                then background — with a starvation valve so an old low-priority
                ticket is never left waiting forever. It does not drop or cancel
                background work. What actually stops a request before it reaches
                the network is the hard token budget ceiling, which raises
                <span className="font-mono-jet text-[14px]"> BudgetExceededError</span>, and
                the circuit breaker, which fails fast with
                <span className="font-mono-jet text-[14px]"> CircuitBreakerOpenError</span> while
                the provider is unhealthy.
              </p>
            </div>
          </div>

          {/* Code Integration Tabbed Window */}
          <div className="mb-16 border border-foreground/30 bg-card shadow-md">
            <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[11px] font-pixel tracking-wider">
              <div className="flex items-center gap-2">
                <span>ONE-LINE IN-PROCESS ADAPTER</span>
                <span className="opacity-70">{`// ZERO ARCHITECTURAL CHANGES`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono-jet border border-primary-foreground/30 font-bold">
                  Python
                </span>
              </div>
            </div>

            <div className="p-4 bg-muted/60 relative">
              <pre className="font-mono-jet text-xs md:text-sm text-foreground overflow-x-auto leading-relaxed p-2">
                {pyCode}
              </pre>

              <button
                onClick={() => copySnippet(pyCode)}
                className="absolute top-4 right-4 px-2.5 py-1 bg-card border border-foreground/30 text-xs font-mono-jet flex items-center gap-1.5 hover:bg-background transition-colors cursor-pointer"
              >
                {copiedCode ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Speed Comparison Demo */}
          <div className="mb-16">
            <SpeedComparison />
          </div>

          {/* Two Chart Panels: Cascade & Budget Enforcement */}
          <div className="mb-16">
            <WorkflowChart />
          </div>

          {/* Price Containment Window & Stat Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Retro Chart Window (8 cols) */}
            <div className="lg:col-span-8 flex justify-center">
              <CostChartWindow />
            </div>

            {/* Stats Row (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-foreground/30 bg-card p-6 shadow-sm">
                <div className="font-sans font-bold text-5xl md:text-6xl text-primary">
                  0.07 ms
                </div>
                <div className="font-mono-jet text-[13px] opacity-80 font-medium mt-1">
                  In-process control-path overhead, the same 0.07 ms at p50, p95
                  and p99. One committed snapshot: 1,000 requests through a local
                  mock transport, no network, recorded 2026-07-20. Not a
                  guarantee — the snapshot records no CPU, OS, Python or SDK
                  version. Re-measure with <span className="font-bold">backstop benchmark</span>.
                </div>
                <div className="font-mono-jet text-[12px] opacity-70 font-medium mt-2 pt-2 border-t border-foreground/20">
                  The gateway figure in the comparison above is an illustrative
                  model of one remote hop, not a measurement.
                </div>
              </div>

              <div className="border border-foreground/30 bg-card p-6 shadow-sm">
                <div className="font-sans font-bold text-5xl md:text-6xl text-foreground">
                  $0.00
                </div>
                <div className="font-mono-jet text-[13px] opacity-80 font-medium mt-1">
                  SaaS markup or proxy subscription fee. 100% open source.
                </div>
              </div>
            </div>
          </div>

          {/* Logo Banner & Open Roles / Contribute */}
          <div className="border-t-2 border-foreground/20 pt-12 flex flex-col items-center text-center">
            <CubeLogo size={72} strokeColor="currentColor" strokeWidth={2.2} />
            <div className="font-sans font-bold text-3xl md:text-4xl text-foreground mt-4 tracking-tight">
              Backstop Reliability Core
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xl sm:text-3xl md:text-4xl font-sans font-semibold text-foreground">
              <span>Ready for Production Swarms</span>
              <span className="text-lg font-mono-jet select-none">▶▶▶</span>
              <a
                href="https://github.com/RavaniRoshan/backstop"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-8 decoration-2 hover:decoration-4 hover:text-primary transition-all"
              >
                Inspect Repository
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE SPEND LEDGER
          ========================================================================= */}
      <LedgerSection />

      {/* Act Boundary Marquee Ticker */}
      <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden select-none border-y border-foreground/30">
        <div className="animate-ticker text-[11px] font-mono-jet tracking-widest uppercase font-bold">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-4">
              <span>∵ ⩆ BACKSTOP RESEARCH</span>
              <span>•</span>
              <span>MULTI-AGENT RESILIENCY</span>
              <span>•</span>
              <span>ZERO EGRESS ARCHITECTURE</span>
              <span>•</span>
              <span>IN-PROCESS TRANSPORT HOOK</span>
              <span>⩆ ∵</span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: TECHNICAL BLOG / DISPATCHES
          ========================================================================= */}
      <section
        id="dispatches"
        className="relative bg-secondary/20 py-20 px-6 md:px-12 border-b border-foreground/20"
      >
        <div className="max-w-[1242px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-mono-jet font-bold tracking-wider">
              Backstop Engineering Dispatches
            </span>
            <div className="text-[11px] font-mono-jet opacity-80">
              FIELD NOTES ON AGENT RELIABILITY
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Featured Card: Architecture Schematic (7 cols) */}
            <div className="lg:col-span-7 border border-foreground/30 bg-card p-6 shadow-md">
              <PatentCollage />

              <div className="mt-5 flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono-jet font-bold border border-foreground/30">
                  Engineering Spec
                </span>
                <span className="font-mono-jet text-[11px] opacity-70">
                  Technical Whitepaper
                </span>
              </div>

              <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-foreground mt-3 tracking-tight">
                In-Process Transport Interception vs Remote Proxies
              </h3>

              <p className="text-[15px] opacity-85 mt-2 leading-relaxed">
                Why external API gateways break the latency contract for multi-agent loops. Detailed breakdown of local token buckets, socket pool exhaustion, and in-process 429 backoff with circuit breaking.
              </p>

              <div className="mt-4 pt-3 border-t border-foreground/20 flex justify-between items-center">
                <span className="font-mono-jet text-[11px] opacity-70">
                  By Backstop Core Team
                </span>
                <Link
                  href="/docs/explanation/architecture"
                  className="font-sans font-semibold text-[15px] underline underline-offset-4 hover:text-primary"
                >
                  Read Architecture Docs →
                </Link>
              </div>
            </div>

            {/* Right Rail: Two Articles (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Post 1 */}
              <div className="border border-foreground/30 bg-card p-5 shadow-sm">
                <div className="text-[10px] font-mono-jet opacity-70 mb-1">
                  CASE STUDY // RUNAWAY AGENTS
                </div>
                <h4 className="font-sans font-semibold text-xl text-foreground">
                  Anatomy of a $4,200 Multi-Agent Infinite Loop
                </h4>
                <p className="text-[14px] opacity-85 mt-2 leading-relaxed">
                  “How a recursive code refactor agent hit an unhandled git merge exception, retried in a tight parallel loop across 32 threads, and spent thousands before human alerting fired.”
                </p>
                <div className="mt-4 pt-2 border-t border-foreground/20 flex justify-end">
                  <Link
                    href="/docs/explanation/benchmarks"
                    className="font-sans font-semibold text-[14px] underline hover:text-primary"
                  >
                    Read Analysis →
                  </Link>
                </div>
              </div>

              {/* Post 2 */}
              <div className="border border-foreground/30 bg-card p-5 shadow-sm">
                <div className="text-[10px] font-mono-jet opacity-70 mb-1">
                  SYSTEMS ENGINEERING // THREAT MATRIX
                </div>
                <h4 className="font-sans font-semibold text-xl text-foreground">
                  The 429 Retry Storm: Why Naive Retries Amplify Outages
                </h4>
                <p className="text-[14px] opacity-85 mt-2 leading-relaxed">
                  “Exponential backoff without distributed circuit breaking produces synchronized waves of retry requests that prolong upstream model provider incidents.”
                </p>
                <div className="mt-4 pt-2 border-t border-foreground/20 flex justify-end">
                  <Link
                    href="/docs/explanation/threat-model"
                    className="font-sans font-semibold text-[14px] underline hover:text-primary"
                  >
                    Read Analysis →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FAQ & FOOTER
          ========================================================================= */}
      <div id="faq">
        <FaqSection onOpenWaitlist={() => openModal('waitlist')} />
      </div>

      {/* Comprehensive Retro-Brutalist Backstop Footer Section */}
      <FooterSection
        onOpenWaitlist={() => openModal('waitlist')}
        onOpenNews={() => openModal('news')}
      />
    </div>
  );
}
