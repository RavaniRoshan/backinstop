'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CubeLogo } from './CubeLogo';
import { WireframeCube } from './WireframeCube';
import {
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ArrowUp,
  ShieldCheck,
  Cpu,
  Activity,
  Zap,
  Sparkles,
  GitFork,
  Star,
} from 'lucide-react';

interface FooterSectionProps {
  onOpenWaitlist?: () => void;
  onOpenNews?: () => void;
}

export function FooterSection({ onOpenWaitlist, onOpenNews }: FooterSectionProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePkgTab, setActivePkgTab] = useState<'pip'>('pip');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const packageCommands = {
    pip: 'pip install "backstop-ai[anthropic]"',
  };

  return (
    <footer id="site-footer" className="relative bg-card text-card-foreground border-t-2 border-foreground/30 overflow-hidden">
      {/* Background Rotating Wireframe Accent */}
      <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] opacity-10 pointer-events-none select-none">
        <WireframeCube color="currentColor" />
      </div>

      {/* Pre-Footer Action Banner / Callout Window */}
      <div className="max-w-[1242px] mx-auto px-6 md:px-12 pt-16 pb-12 relative z-10">
        <div className="bg-background border-2 border-foreground/30 shadow-md">
          {/* Retro Window Header */}
          <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-xs font-pixel tracking-wider">
            <div className="flex items-center gap-2">
              <Terminal size={13} />
              <span>TERMINAL ▪ IN-PROCESS RUNTIME DEPLOYMENT</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OPERATIONAL // ZERO PROXY HOPS</span>
            </div>
          </div>

          {/* Window Interior */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono-jet font-bold tracking-wider">
                  v1.0.4 PRODUCTION READY
                </span>
                <span className="text-[11px] font-mono-jet opacity-70">
                  APACHE 2.0 &amp; MIT OPEN SOURCE
                </span>
              </div>
              <h3 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight leading-tight">
                Protect your AI workflows from runaway spend and 429 cascades.
              </h3>
              <p className="text-sm md:text-base opacity-85 leading-relaxed font-sans max-w-2xl">
                Install Backstop in under 60 seconds. Wrap your standard OpenAI and Anthropic client in-process without routing prompts through 3rd-party servers.
              </p>
            </div>

            {/* Quick Install Console */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Package selector tabs */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {(['pip'] as const).map((pkg) => (
                    <button
                      key={pkg}
                      id={`pkg-tab-${pkg}`}
                      onClick={() => setActivePkgTab(pkg)}
                      className={`px-2.5 py-1 text-xs font-mono-jet transition-colors cursor-pointer border border-foreground/30 ${
                        activePkgTab === pkg
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'bg-muted hover:bg-background text-foreground'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono-jet opacity-70">Zero external deps</span>
              </div>

              {/* Shell display */}
              <div className="bg-muted p-3 border border-foreground/30 flex items-center justify-between font-mono-jet text-xs md:text-sm shadow-inner">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-primary font-bold select-none">$</span>
                  <span className="text-foreground select-all">{packageCommands[activePkgTab]}</span>
                </div>
                <button
                  id={`btn-copy-${activePkgTab}`}
                  onClick={() => copyToClipboard(packageCommands[activePkgTab], activePkgTab)}
                  className="px-2.5 py-1 bg-card hover:bg-background border border-foreground/30 text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Copy command"
                >
                  {copiedCmd === activePkgTab ? (
                    <>
                      <Check size={13} className="text-primary" />
                      <span className="font-bold text-primary">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  id="footer-github-star-btn"
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-sans font-bold text-xs md:text-sm text-center border border-foreground/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Star size={14} className="fill-current" />
                  <span>Star on GitHub</span>
                </a>
                <button
                  id="footer-early-access-btn"
                  onClick={onOpenWaitlist}
                  className="px-4 py-2 bg-card hover:bg-muted font-sans font-bold text-xs md:text-sm text-center border border-foreground/30 text-foreground transition-colors cursor-pointer"
                >
                  Get Updates
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Columns */}
        <div className="mt-16 pt-12 border-t border-foreground/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <CubeLogo size={28} strokeColor="currentColor" strokeWidth={2.2} />
              <span className="font-sans font-bold text-2xl tracking-tight text-foreground">
                Backstop
              </span>
              <span className="px-1.5 py-0.5 bg-muted border border-foreground/30 text-[10px] font-mono-jet font-bold">
                SDK v1.0
              </span>
            </div>

            <p className="text-xs sm:text-sm opacity-85 leading-relaxed font-sans">
              The in-process reliability layer for AI SDKs. Providing backpressure, hard spend isolation, adaptive circuit breakers, and sub-millisecond local telemetry for autonomous multi-agent swarms.
            </p>

            {/* Live Status Indicator */}
            <div className="p-2.5 bg-muted border border-foreground/20 text-xs font-mono-jet flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold">IN-PROCESS ENGINE</span>
              </div>
              <span className="opacity-75">OVERHEAD ~0.07ms</span>
            </div>

            {/* Newsletter Dispatch Form */}
            <form onSubmit={handleSubscribe} className="space-y-1.5 pt-1">
              <label htmlFor="footer-newsletter-email" className="block text-[11px] font-mono-jet font-bold opacity-80 uppercase tracking-wider">
                Reliability Engineering Dispatch
              </label>
              <div className="flex">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-background border border-foreground/30 text-xs text-foreground outline-none focus:border-primary font-mono-jet"
                />
                <button
                  type="submit"
                  id="footer-newsletter-submit"
                  className="px-3 py-1.5 bg-primary text-primary-foreground border-y border-r border-foreground/30 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0 font-mono-jet"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] font-mono-jet text-primary font-bold flex items-center gap-1 animate-in fade-in">
                  <Check size={12} />
                  <span>Subscribed to quarterly benchmark reports.</span>
                </div>
              )}
            </form>
          </div>

          {/* Col 2: Primitives (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono-jet font-bold uppercase tracking-wider text-primary border-b border-foreground/20 pb-1 flex items-center gap-1.5">
              <Zap size={13} />
              <span>Primitives</span>
            </div>
            <ul className="space-y-2 text-xs font-mono-jet opacity-90">
              <li>
                <a href="#primitives" className="hover:text-primary hover:underline transition-colors block">
                  Admission Queue
                </a>
              </li>
              <li>
                <a href="#primitives" className="hover:text-primary hover:underline transition-colors block">
                  Hard Budget Isolation
                </a>
              </li>
              <li>
                <a href="#primitives" className="hover:text-primary hover:underline transition-colors block">
                  Circuit Breakers (429)
                </a>
              </li>
              <li>
                <a href="#primitives" className="hover:text-primary hover:underline transition-colors block">
                  Priority Admission Queue
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-primary hover:underline transition-colors block">
                  Dynamic Fallbacks
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-primary hover:underline transition-colors block">
                  Zero Egress Guard
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: SDKs & Runtimes (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono-jet font-bold uppercase tracking-wider text-primary border-b border-foreground/20 pb-1 flex items-center gap-1.5">
              <Cpu size={13} />
              <span>Runtimes</span>
            </div>
            <ul className="space-y-2 text-xs font-mono-jet opacity-90">
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Python 3.10–3.12</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>OpenAI SDK (in-process hook)</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Anthropic SDK (in-process hook)</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Benchmarks & Docs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono-jet font-bold uppercase tracking-wider text-primary border-b border-foreground/20 pb-1 flex items-center gap-1.5">
              <Activity size={13} />
              <span>Benchmarks</span>
            </div>
            <ul className="space-y-2 text-xs font-mono-jet opacity-90">
              <li>
                <a href="#benchmarks" className="hover:text-primary hover:underline transition-colors block">
                  Latency Matrix (0.07ms)
                </a>
              </li>
              <li>
                <a href="#benchmarks" className="hover:text-primary hover:underline transition-colors block">
                  Memory Profile &lt; 8MB
                </a>
              </li>
              <li>
                <a href="#benchmarks" className="hover:text-primary hover:underline transition-colors block">
                  Multi-Agent Swarm Test
                </a>
              </li>
              <li>
                <a href="#dispatches" className="hover:text-primary hover:underline transition-colors block">
                  Whitepaper &amp; Spec
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary hover:underline transition-colors block">
                  FAQ &amp; Architecture
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenNews}
                  className="hover:text-primary hover:underline transition-colors text-left cursor-pointer"
                >
                  Release Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Open Source & Community (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono-jet font-bold uppercase tracking-wider text-primary border-b border-foreground/20 pb-1 flex items-center gap-1.5">
              <GitFork size={13} />
              <span>Open Source</span>
            </div>
            <ul className="space-y-2 text-xs font-mono-jet opacity-90">
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Issue Tracker</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop/blob/main/LICENSE.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Apache 2.0 License</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Contributing</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenWaitlist}
                  className="hover:text-primary hover:underline transition-colors text-left cursor-pointer"
                >
                  Enterprise Support
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Security Audit</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Retro Telemetry Diagnostic Ribbon */}
        <div className="mt-12 bg-background border border-foreground/30 p-2.5 font-mono-jet text-[11px] flex flex-wrap items-center justify-between gap-3 text-card-foreground shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary">[SYSTEM AUDIT]</span>
            <span className="opacity-80">TRANSPORT: In-Process Client Hook</span>
            <span className="opacity-40">|</span>
            <span className="opacity-80">EGRESS: 0.00 KB (Strict Local-Only)</span>
            <span className="opacity-40">|</span>
            <span className="opacity-80">PROXY HOPS: 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-70">CPU COST: 0.07ms</span>
            <span className="px-1.5 py-0.2 bg-primary text-primary-foreground text-[9px] font-bold">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Legal, Copyright, & Back to Top Bar */}
        <div className="mt-8 pt-6 border-t border-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-jet opacity-80">
          <div className="flex items-center gap-2">
            <span>Backstop © 2026</span>
            <span className="opacity-40">·</span>
            <span>All rights reserved.</span>
            <span className="opacity-40">·</span>
            <a
              href="https://github.com/RavaniRoshan/backstop"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary hover:underline"
            >
              github.com/RavaniRoshan/backstop
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RavaniRoshan/backstop/blob/main/LICENSE.txt"
              target="_blank"
              rel="noreferrer"
              className="hover:underline hover:text-primary"
            >
              License (Apache-2.0)
            </a>
            <span className="opacity-40">·</span>
            <Link
              href="/docs"
              className="hover:underline hover:text-primary"
            >
              Documentation
            </Link>
            <span className="opacity-40">·</span>
            <button
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer px-2 py-1 bg-muted border border-foreground/20"
              title="Return to top"
            >
              <ArrowUp size={12} />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
