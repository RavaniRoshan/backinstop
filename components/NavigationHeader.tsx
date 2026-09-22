'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Zap,
  Shield,
  Activity,
  Lock,
  ArrowRight,
  TrendingUp,
  Terminal,
  FileCode,
  Check,
  Copy,
} from 'lucide-react';
import { CubeLogo } from '@/components/CubeLogo';

interface NavigationHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenModal: (mode: 'waitlist' | 'discord' | 'signin' | 'news') => void;
}

type MenuKey = 'primitives' | 'workloads' | null;

export function NavigationHeader({
  isDark,
  onToggleTheme,
  onOpenModal,
}: NavigationHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection to adapt pill styling seamlessly
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (key: MenuKey) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveMenu(key);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const handleLinkClick = (hash: string) => {
    setActiveMenu(null);
    setMobileOpen(false);
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyInstallCommand = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('pip install "backstop-ai[anthropic]"');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const isDockActive = scrolled || activeMenu !== null || mobileOpen;

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300 px-3 sm:px-6 pt-3 sm:pt-4">
      <div
        ref={navRef}
        onMouseLeave={handleMouseLeave}
        className="max-w-6xl mx-auto pointer-events-auto relative"
      >
        {/* Main Dock Bar */}
        <nav
          className={`relative z-30 flex items-center justify-between px-3 sm:px-4 py-2 transition-all duration-300 select-none ${
            isDockActive
              ? 'bg-card/85 dark:bg-card/80 backdrop-blur-md border border-foreground/10 shadow-xs'
              : 'bg-transparent border border-transparent shadow-none'
          }`}
        >
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2.5">
            <a
              href="#"
              className="flex items-center gap-2 group text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 flex items-center justify-center bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                <CubeLogo size={18} strokeColor="currentColor" />
              </div>
              <span className="font-sans font-bold text-base sm:text-lg tracking-tight">
                Backstop
              </span>
            </a>

            {/* Micro Badge */}
            <span className="hidden sm:inline-block font-mono-jet text-[10px] uppercase px-1.5 py-0.5 border border-foreground/10 text-muted-foreground bg-foreground/5">
              in-process
            </span>
          </div>

          {/* Center: Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-1 font-mono-jet text-xs font-semibold">
            {/* Primitives Trigger */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'primitives' ? null : 'primitives')}
              onMouseEnter={() => handleMouseEnter('primitives')}
              className={`flex items-center gap-1 px-3 py-1.5 transition-all cursor-pointer border ${
                activeMenu === 'primitives'
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5 border-transparent'
              }`}
            >
              <span>Primitives</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeMenu === 'primitives' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Workloads Trigger */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'workloads' ? null : 'workloads')}
              onMouseEnter={() => handleMouseEnter('workloads')}
              className={`flex items-center gap-1 px-3 py-1.5 transition-all cursor-pointer border ${
                activeMenu === 'workloads'
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5 border-transparent'
              }`}
            >
              <span>Workloads</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeMenu === 'workloads' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Direct Benchmarks Anchor */}
            <button
              onClick={() => handleLinkClick('#benchmarks')}
              className="px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-foreground/5 border border-transparent transition-colors cursor-pointer"
            >
              Benchmarks
            </button>

            {/* Direct Architecture Anchor */}
            <button
              onClick={() => handleLinkClick('#architecture')}
              className="px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-foreground/5 border border-transparent transition-colors cursor-pointer"
            >
              Architecture
            </button>

            {/* Docs Link */}
            <Link
              href="/docs"
              className="px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-foreground/5 border border-transparent transition-colors cursor-pointer"
            >
              Docs
            </Link>
          </div>

          {/* Right: Quick actions (Theme, GitHub, CTA, Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono-jet text-xs">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              className="p-1.5 sm:p-2 text-foreground/75 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              aria-label="Toggle dark/light mode"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* GitHub link */}
            <a
              href="https://github.com/RavaniRoshan/backstop"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <span>GitHub</span>
            </a>

            {/* Action CTA */}
            <button
              onClick={() => onOpenModal('waitlist')}
              className="px-3 sm:px-3.5 py-1.5 bg-primary text-primary-foreground font-sans font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              Get Backstop
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        {/* =========================================================================
            DESKTOP ACCORDION DROPDOWN PANELS (Smooth slide-down from bottom of dock)
            ========================================================================= */}
        <div
          onMouseEnter={() => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          className={`hidden md:block absolute top-full left-0 right-0 pt-1 transition-all duration-200 origin-top ${
            activeMenu
              ? 'opacity-100 scale-y-100 pointer-events-auto'
              : 'opacity-0 scale-y-95 pointer-events-none'
          }`}
        >
          <div className="bg-card/95 backdrop-blur-md border border-foreground/10 shadow-xl text-foreground overflow-hidden">
            {/* Primitives Panel */}
            {activeMenu === 'primitives' && (
              <div className="p-5">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-2.5 mb-3 font-mono-jet text-[11px]">
                  <span className="uppercase tracking-wider font-bold text-foreground/70">
                    Core Reliability Primitives (In-Process)
                  </span>
                  <button
                    onClick={() => handleLinkClick('#primitives')}
                    className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
                  >
                    <span>Jump to Live Simulator</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div
                    onClick={() => handleLinkClick('#primitives')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap size={15} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-bold text-xs">Priority Backpressure</span>
                    </div>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Sheds asynchronous background jobs to protect interactive user latency.
                    </p>
                  </div>

                  <div
                    onClick={() => handleLinkClick('#primitives')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield size={15} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-bold text-xs">Hard Budget Isolation</span>
                    </div>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Deterministic token and dollar ceilings per tenant, session, or agent loop.
                    </p>
                  </div>

                  <div
                    onClick={() => handleLinkClick('#primitives')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Activity size={15} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-bold text-xs">Circuit Breakers</span>
                    </div>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Tri-state failure detection preventing retry storms during provider incidents.
                    </p>
                  </div>

                  <div
                    onClick={() => handleLinkClick('#primitives')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lock size={15} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-bold text-xs">Zero Egress Security</span>
                    </div>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Hooks Node/Python sockets directly. Keys and prompts never exit your VPC.
                    </p>
                  </div>
                </div>

                {/* Bottom Quick-Install Bar */}
                <div className="mt-3 pt-2.5 border-t border-foreground/10 flex items-center justify-between font-mono-jet text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Zero dependencies runtime hook:</span>
                    <code className="px-2 py-0.5 bg-muted border border-foreground/15 text-foreground font-bold">
                      pip install &quot;backstop-ai[anthropic]&quot;
                    </code>
                  </div>
                  <button
                    onClick={copyInstallCommand}
                    className="flex items-center gap-1 px-2.5 py-1 bg-muted hover:bg-card border border-foreground/15 transition-colors cursor-pointer font-bold"
                  >
                    {copiedInstall ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span>Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Install Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Workloads Panel */}
            {activeMenu === 'workloads' && (
              <div className="p-5">
                <div className="border-b border-foreground/10 pb-2.5 mb-3 font-mono-jet text-[11px] uppercase tracking-wider font-bold text-foreground/70">
                  Supported Workload Types
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => handleLinkClick('#primitives')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-bold text-xs text-foreground block mb-1">
                      Autonomous Agent Swarms
                    </span>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Prevent recursive agent tool-calling runaway bills and API rate-limit exhaustion.
                    </p>
                  </div>

                  <div
                    onClick={() => handleLinkClick('#architecture')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-bold text-xs text-foreground block mb-1">
                      Production RAG &amp; Ingestion
                    </span>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Smooth batch embedding queues so user-facing queries maintain sub-second latency.
                    </p>
                  </div>

                  <div
                    onClick={() => handleLinkClick('#benchmarks')}
                    className="p-3 border border-foreground/10 hover:border-foreground/30 hover:bg-muted/60 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-bold text-xs text-foreground block mb-1">
                      Multi-Tenant Enterprise SaaS
                    </span>
                    <p className="font-mono-jet text-[11px] text-muted-foreground leading-relaxed">
                      Strict noisy-neighbor isolation per customer token quota without external proxy hops.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            MOBILE COMPACT FLYOUT (Clean, non-intrusive)
            ========================================================================= */}
        {mobileOpen && (
          <div className="md:hidden mt-2 border border-foreground/10 bg-card/95 backdrop-blur-md shadow-xl p-4 font-mono-jet text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2 pb-3 border-b border-foreground/10">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Navigation
              </div>
              <button
                onClick={() => handleLinkClick('#primitives')}
                className="w-full text-left p-2 hover:bg-muted/60 flex items-center justify-between font-bold text-foreground"
              >
                <span>Primitives (Simulator)</span>
                <ArrowRight size={13} className="text-primary" />
              </button>
              <button
                onClick={() => handleLinkClick('#benchmarks')}
                className="w-full text-left p-2 hover:bg-muted/60 flex items-center justify-between font-bold text-foreground"
              >
                <span>Empirical Benchmarks</span>
                <ArrowRight size={13} className="text-primary" />
              </button>
              <button
                onClick={() => handleLinkClick('#architecture')}
                className="w-full text-left p-2 hover:bg-muted/60 flex items-center justify-between font-bold text-foreground"
              >
                <span>SDK Architecture</span>
                <ArrowRight size={13} className="text-primary" />
              </button>
              <Link
                href="/docs"
                className="w-full text-left p-2 hover:bg-muted/60 flex items-center justify-between font-bold text-foreground"
              >
                <span>Documentation</span>
                <ArrowRight size={13} className="text-primary" />
              </Link>
            </div>

            {/* Quick Install */}
            <div className="pt-3 pb-3 border-b border-foreground/10">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Zero-Dependency Install
              </div>
              <div
                onClick={copyInstallCommand}
                className="p-2 bg-muted border border-foreground/15 flex items-center justify-between cursor-pointer"
              >
                <code className="text-[11px] font-bold">pip install &quot;backstop-ai[anthropic]&quot;</code>
                <span className="text-[10px] text-primary underline">
                  {copiedInstall ? 'Copied!' : 'Copy'}
                </span>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-3 flex items-center justify-between">
              <a
                href="https://github.com/RavaniRoshan/backstop"
                target="_blank"
                rel="noreferrer"
                className="font-bold hover:text-primary transition-colors"
              >
                GitHub Repo ↗
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenModal('waitlist');
                }}
                className="px-3 py-1.5 bg-primary text-primary-foreground font-sans font-bold text-xs"
              >
                Get Backstop
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
