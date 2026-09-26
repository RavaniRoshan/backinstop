'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Zap,
  Shield,
  Activity,
  Lock,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  ArrowRight,
  TrendingDown,
  Server,
  Sliders,
  Terminal,
} from 'lucide-react';

export type PrimitiveTab = 'backpressure' | 'budget' | 'circuit' | 'egress';

interface InteractivePrimitivesProps {
  onOpenWaitlist?: () => void;
}

export function InteractivePrimitives({ onOpenWaitlist }: InteractivePrimitivesProps) {
  const [activeTab, setActiveTab] = useState<PrimitiveTab>('backpressure');

  // GSAP Ref for animated content panel
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Animate panel when tab changes
  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0.4, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  // ---------------------------------------------------------------------------
  // 1. BACKPRESSURE STATE & SIMULATOR
  // ---------------------------------------------------------------------------
  const [qps, setQps] = useState(120);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [admittedCount, setAdmittedCount] = useState(118);
  const [shedCount, setShedCount] = useState(2);
  const [tier1Queue, setTier1Queue] = useState(1);
  const [tier3Queue, setTier3Queue] = useState(4);

  // Interval traffic simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const load = isSurgeActive ? qps * 4 : qps;
      const baseTier1 = Math.round(load * 0.4);
      const baseTier3 = Math.round(load * 0.6);

      if (load > 250) {
        // High load: shed Tier 3 heavily to protect Tier 1
        setAdmittedCount(baseTier1 + Math.round(baseTier3 * 0.15));
        setShedCount(Math.round(baseTier3 * 0.85));
        setTier1Queue(Math.floor(Math.random() * 2) + 1);
        setTier3Queue(Math.floor(Math.random() * 15) + 12);
      } else {
        // Normal load: admission healthy
        setAdmittedCount(load - Math.floor(Math.random() * 3));
        setShedCount(Math.floor(Math.random() * 2));
        setTier1Queue(0);
        setTier3Queue(Math.floor(Math.random() * 3));
      }
    }, 900);
    return () => clearInterval(timer);
  }, [qps, isSurgeActive]);

  const triggerSurge = () => {
    setIsSurgeActive(true);
    setTimeout(() => setIsSurgeActive(false), 4500);
  };

  // ---------------------------------------------------------------------------
  // 2. BUDGET ISOLATION STATE & SIMULATOR
  // ---------------------------------------------------------------------------
  const [budgetCap, setBudgetCap] = useState(0.50);
  const [currentSpend, setCurrentSpend] = useState(0.08);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isBudgetTripped, setIsBudgetTripped] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[INIT] Agent worker #04 initialized with tenant budget cap $0.50',
    '[OK] Step 1: Query local git commit graph ($0.02 spend)',
    '[OK] Step 2: AST traversal across 14 modules ($0.06 spend)',
  ]);
  const spendMeterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAgentRunning && !isBudgetTripped) {
      interval = setInterval(() => {
        setCurrentSpend((prev) => {
          const stepCost = 0.09 + Math.random() * 0.05;
          const next = Number((prev + stepCost).toFixed(3));
          if (next >= budgetCap) {
            setIsBudgetTripped(true);
            setIsAgentRunning(false);
            setAgentLogs((logs) => [
              `[TRIPPED] Spend reached $${next.toFixed(2)} (>= limit $${budgetCap.toFixed(2)})`,
              `[FAIL-CLOSED] Backstop in-process hook intercepted connection!`,
              `[SAVED] Prevented infinite loop: saved an estimated $380.00!`,
              ...logs.slice(0, 4),
            ]);
            return budgetCap;
          } else {
            setAgentLogs((logs) => [
              `[STEP] Autonomous recursive loop tool call executed (+${stepCost.toFixed(3)}$) - Total: $${next.toFixed(2)}`,
              ...logs.slice(0, 4),
            ]);
            return next;
          }
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAgentRunning, isBudgetTripped, budgetCap]);

  const resetBudgetSim = () => {
    setIsAgentRunning(false);
    setIsBudgetTripped(false);
    setCurrentSpend(0.08);
    setAgentLogs([
      `[RESET] Budget limit set to $${budgetCap.toFixed(2)}. Counter reset to $0.08.`,
      '[READY] Ready to simulate recursive agent loop.',
    ]);
  };

  // ---------------------------------------------------------------------------
  // 3. CIRCUIT BREAKER STATE & SIMULATOR
  // ---------------------------------------------------------------------------
  type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  const [circuitState, setCircuitState] = useState<CircuitState>('CLOSED');
  const [circuitProvider, setCircuitProvider] = useState<'openai' | 'anthropic'>('anthropic');
  const [fallbackActive, setFallbackActive] = useState(false);
  const [circuitLogs, setCircuitLogs] = useState<string[]>([
    '[STATE: CLOSED] Upstream provider Anthropic Claude 3.5 Sonnet responding (p95: 412ms)',
    '[HEALTH] Error rate: 0.02% ▪ Provider rate limit headroom: 88%',
  ]);

  const trigger429Outage = () => {
    setCircuitState('OPEN');
    setFallbackActive(true);
    setCircuitLogs((logs) => [
      '[OUTAGE 429 DETECTED] Upstream returned HTTP 429 (Rate Limit Exceeded)',
      '[CIRCUIT TRIPPED] State -> OPEN. Halting all upstream requests locally in 0.07ms!',
      '[FAST FALLBACK] Rerouting live traffic to GPT-4o-mini fallback model with 0 downtime',
      ...logs.slice(0, 3),
    ]);
  };

  const triggerCanary = () => {
    setCircuitState('HALF_OPEN');
    setCircuitLogs((logs) => [
      '[CANARY PROBE] State -> HALF-OPEN. Passing 5% trial traffic to verify upstream health...',
      '[PROBE RESULT] HTTP 200 OK received in 340ms',
      ...logs.slice(0, 3),
    ]);
  };

  const recoverCircuit = () => {
    setCircuitState('CLOSED');
    setFallbackActive(false);
    setCircuitLogs((logs) => [
      '[RECOVERED] State -> CLOSED. Upstream health confirmed. Primary model restored.',
      ...logs.slice(0, 3),
    ]);
  };

  // ---------------------------------------------------------------------------
  // 4. ZERO EGRESS DATA
  // ---------------------------------------------------------------------------
  const [egressInspectActive, setEgressInspectActive] = useState(false);

  return (
    <div id="interactive-primitives-root" className="w-full">
      {/* Top Console Bar */}
      <div className="bg-background border border-foreground/30 shadow-sm p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-jet">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider text-foreground">
            SYSTEM KERNEL // IN-PROCESS RUNTIME ENGINE
          </span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline px-1.5 py-0.5 bg-muted text-[10px] font-bold border border-foreground/20">
            OVERHEAD: 0.08ms
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="opacity-75">INTERACTIVE MODE:</span>
          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold">
            LIVE SIMULATION
          </span>
        </div>
      </div>

      {/* Main Grid: 4 Primitive Selector Cards (Left 4 cols) + Interactive Simulator Deck (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The 4 Primitive Interactive Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Card 1: Backpressure & Admission Queue */}
          <div
            id="tab-btn-backpressure"
            onClick={() => setActiveTab('backpressure')}
            className={`p-4 border transition-all cursor-pointer select-none relative ${
              activeTab === 'backpressure'
                ? 'bg-card border-2 border-primary shadow-md translate-x-1'
                : 'bg-background border-foreground/30 hover:border-primary/60 shadow-xs'
            }`}
          >
            {activeTab === 'backpressure' && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary" />
            )}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1 ${activeTab === 'backpressure' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <Zap size={14} />
                </div>
                <span className="font-pixel text-[11px] font-bold text-foreground">
                  01. BACKPRESSURE
                </span>
              </div>
              <span className="text-[10px] font-mono-jet font-bold px-1.5 py-0.2 bg-muted border border-foreground/20">
                ADMISSION QUEUE
              </span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed font-sans mt-1">
              Priority-aware traffic shedding. Protects interactive user chats while dynamically pacing or dropping autonomous background tasks.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-jet pt-2 border-t border-foreground/15">
              <span className="opacity-70">Current Traffic:</span>
              <span className="font-bold text-primary">{qps} req/s</span>
            </div>
          </div>

          {/* Card 2: Hard Budget Isolation */}
          <div
            id="tab-btn-budget"
            onClick={() => setActiveTab('budget')}
            className={`p-4 border transition-all cursor-pointer select-none relative ${
              activeTab === 'budget'
                ? 'bg-card border-2 border-primary shadow-md translate-x-1'
                : 'bg-background border-foreground/30 hover:border-primary/60 shadow-xs'
            }`}
          >
            {activeTab === 'budget' && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary" />
            )}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1 ${activeTab === 'budget' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <Shield size={14} />
                </div>
                <span className="font-pixel text-[11px] font-bold text-foreground">
                  02. BUDGET ISOLATION
                </span>
              </div>
              <span className="text-[10px] font-mono-jet font-bold px-1.5 py-0.2 bg-destructive/15 text-destructive border border-destructive/30">
                FAIL-CLOSED
              </span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed font-sans mt-1">
              Hard deterministic spend caps per agent loop, worker thread, or customer tenant. Trips locally in microseconds to stop runaway $4,000 billing loops.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-jet pt-2 border-t border-foreground/15">
              <span className="opacity-70">Spend Status:</span>
              <span className={`font-bold ${isBudgetTripped ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                ${currentSpend.toFixed(2)} / ${budgetCap.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 3: Adaptive Circuit Breakers */}
          <div
            id="tab-btn-circuit"
            onClick={() => setActiveTab('circuit')}
            className={`p-4 border transition-all cursor-pointer select-none relative ${
              activeTab === 'circuit'
                ? 'bg-card border-2 border-primary shadow-md translate-x-1'
                : 'bg-background border-foreground/30 hover:border-primary/60 shadow-xs'
            }`}
          >
            {activeTab === 'circuit' && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary" />
            )}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1 ${activeTab === 'circuit' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <Activity size={14} />
                </div>
                <span className="font-pixel text-[11px] font-bold text-foreground">
                  03. CIRCUIT BREAKERS
                </span>
              </div>
              <span className={`text-[10px] font-mono-jet font-bold px-1.5 py-0.2 border ${
                circuitState === 'CLOSED'
                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                  : circuitState === 'OPEN'
                  ? 'bg-destructive/15 text-destructive border-destructive/30'
                  : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
              }`}>
                {circuitState}
              </span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed font-sans mt-1">
              Automated 429 outage defense. Prevents catastrophic retry storms by tripping locally, executing instant zero-latency fallbacks, and canary probing.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-jet pt-2 border-t border-foreground/15">
              <span className="opacity-70">Fallback Model:</span>
              <span className="font-bold text-foreground">
                {fallbackActive ? 'GPT-4o-mini (Active)' : 'Standby'}
              </span>
            </div>
          </div>

          {/* Card 4: Zero Egress Guard */}
          <div
            id="tab-btn-egress"
            onClick={() => setActiveTab('egress')}
            className={`p-4 border transition-all cursor-pointer select-none relative ${
              activeTab === 'egress'
                ? 'bg-card border-2 border-primary shadow-md translate-x-1'
                : 'bg-background border-foreground/30 hover:border-primary/60 shadow-xs'
            }`}
          >
            {activeTab === 'egress' && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary" />
            )}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1 ${activeTab === 'egress' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <Lock size={14} />
                </div>
                <span className="font-pixel text-[11px] font-bold text-foreground">
                  04. ZERO EGRESS GUARD
                </span>
              </div>
              <span className="text-[10px] font-mono-jet font-bold px-1.5 py-0.2 bg-muted border border-foreground/20">
                0 PROXY HOPS
              </span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed font-sans mt-1">
              Prompts and secrets never leave your runtime memory. Direct in-process connection with zero intermediate 3rd-party servers, logging proxies, or DNS overhead.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-jet pt-2 border-t border-foreground/15">
              <span className="opacity-70">Data Egress:</span>
              <span className="font-bold text-emerald-600">0.00 KB (Strict Local)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Interactive Deep-Dive Simulator (7 cols) */}
        <div ref={panelRef} className="lg:col-span-7 bg-card border-2 border-foreground/30 shadow-md">
          {/* Header of the Active Window */}
          <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between font-pixel text-xs tracking-wider">
            <div className="flex items-center gap-2">
              <Terminal size={13} />
              <span>
                {activeTab === 'backpressure' && 'SIMULATOR ▪ ADMISSION QUEUE & TRAFFIC SHEDDING'}
                {activeTab === 'budget' && 'SIMULATOR ▪ HARD SPEND CEILING & LOOP CIRCUIT'}
                {activeTab === 'circuit' && 'SIMULATOR ▪ 429 OUTAGE MITIGATION & FALLBACK'}
                {activeTab === 'egress' && 'INSPECTION ▪ ZERO EGRESS IN-PROCESS MEMORY HOOK'}
              </span>
            </div>
            <span className="text-[10px] opacity-80 font-mono-jet">PORT: IN-PROCESS</span>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* ================================================================= */}
            {/* TAB 1: BACKPRESSURE SIMULATOR */}
            {/* ================================================================= */}
            {activeTab === 'backpressure' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/20">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-foreground">
                      Traffic Shedding &amp; Backpressure Control
                    </h4>
                    <p className="text-xs opacity-80 font-sans mt-0.5">
                      Adjust incoming traffic QPS and simulate sudden multi-agent traffic spikes.
                    </p>
                  </div>
                  <button
                    onClick={triggerSurge}
                    className={`px-3 py-1.5 text-xs font-mono-jet font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-foreground/30 shrink-0 ${
                      isSurgeActive
                        ? 'bg-destructive text-destructive-foreground animate-pulse'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    <Flame size={13} />
                    <span>{isSurgeActive ? 'SURGE ACTIVE (500+ QPS)' : 'Simulate Traffic Spike'}</span>
                  </button>
                </div>

                {/* Interactive Slider for QPS */}
                <div className="space-y-2 bg-muted p-3.5 border border-foreground/20">
                  <div className="flex items-center justify-between text-xs font-mono-jet">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sliders size={13} />
                      <span>Traffic Generator Load:</span>
                    </span>
                    <span className="px-2 py-0.5 bg-card border border-foreground/30 font-bold text-primary">
                      {isSurgeActive ? qps * 4 : qps} req/s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="400"
                    value={qps}
                    onChange={(e) => setQps(Number(e.target.value))}
                    className="w-full cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-mono-jet opacity-70">
                    <span>30 QPS (Calm)</span>
                    <span>180 QPS (Nominal)</span>
                    <span>400 QPS (Provider Rate Limit Margin)</span>
                  </div>
                </div>

                {/* Real-Time Priority Queues Visualizer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tier 1 Box */}
                  <div className="p-3.5 bg-background border border-foreground/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-jet">
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Tier 1: Interactive Users</span>
                      </span>
                      <span className="text-[10px] px-1.5 bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                        PRIORITY PASS
                      </span>
                    </div>
                    <div className="text-xs font-mono-jet space-y-1 opacity-90">
                      <div>Admission Rate: <span className="font-bold text-emerald-600">99.98%</span></div>
                      <div>Queue Depth: <span className="font-bold">{tier1Queue} req</span></div>
                      <div>P99 Latency Overhead: <span className="font-bold text-primary">+0.08 ms</span></div>
                    </div>
                    {/* Visual Queue Slots */}
                    <div className="flex gap-1 pt-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 flex-1 border border-foreground/20 rounded-xs transition-all duration-300 ${
                            i < tier1Queue + 1
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-muted opacity-40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tier 3 Box */}
                  <div className="p-3.5 bg-background border border-foreground/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-jet">
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Layers size={13} />
                        <span>Tier 3: Autonomous Agents</span>
                      </span>
                      <span className="text-[10px] px-1.5 bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                        SHED DYNAMICALLY
                      </span>
                    </div>
                    <div className="text-xs font-mono-jet space-y-1 opacity-90">
                      <div>Admitted: <span className="font-bold">{admittedCount} req/s</span></div>
                      <div>Shed / Backpressured: <span className="font-bold text-destructive">{shedCount} req/s</span></div>
                      <div>Queue Buffer: <span className="font-bold">{tier3Queue} items</span></div>
                    </div>
                    {/* Visual Queue Slots */}
                    <div className="flex gap-1 pt-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 flex-1 border border-foreground/20 rounded-xs transition-all duration-300 ${
                            i < (tier3Queue % 6) + 1
                              ? isSurgeActive
                                ? 'bg-destructive animate-pulse'
                                : 'bg-amber-500'
                              : 'bg-muted opacity-40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outcome Banner */}
                <div className="p-3 bg-muted border border-foreground/20 text-xs font-mono-jet flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">[BACKPRESSURE RESULT]:</span>
                    <span>Zero socket timeouts. Live user experience remains sub-second.</span>
                  </div>
                  <span className="hidden sm:inline font-bold text-emerald-600">NO 429 CASCADE</span>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2: BUDGET ISOLATION SIMULATOR */}
            {/* ================================================================= */}
            {activeTab === 'budget' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/20">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-foreground">
                      Hard Deterministic Spend Isolation
                    </h4>
                    <p className="text-xs opacity-80 font-sans mt-0.5">
                      Guarantees an agent loop cannot exceed its allocated dollar budget.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isAgentRunning && !isBudgetTripped && (
                      <button
                        onClick={() => setIsAgentRunning(true)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-mono-jet font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer border border-foreground/30"
                      >
                        <Play size={12} />
                        <span>Run Agent Loop</span>
                      </button>
                    )}
                    {(isAgentRunning || isBudgetTripped) && (
                      <button
                        onClick={resetBudgetSim}
                        className="px-3 py-1.5 bg-card hover:bg-muted text-foreground text-xs font-mono-jet font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-foreground/30"
                      >
                        <RotateCcw size={12} />
                        <span>Reset Budget</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Budget Limit Slider */}
                <div className="bg-muted p-3.5 border border-foreground/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-jet">
                    <span className="font-bold flex items-center gap-1.5">
                      <Shield size={13} />
                      <span>Set Session Hard Limit:</span>
                    </span>
                    <span className="px-2 py-0.5 bg-card border border-foreground/30 font-bold text-primary">
                      ${budgetCap.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="2.00"
                    step="0.05"
                    disabled={isAgentRunning}
                    value={budgetCap}
                    onChange={(e) => setBudgetCap(Number(e.target.value))}
                    className="w-full cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-mono-jet opacity-70">
                    <span>$0.20 (Micro-Agent)</span>
                    <span>$1.00 (Standard Worker)</span>
                    <span>$2.00 (Batch Task)</span>
                  </div>
                </div>

                {/* Spend Meter Gauge */}
                <div className="space-y-2 bg-background p-4 border border-foreground/30">
                  <div className="flex items-center justify-between text-xs font-mono-jet">
                    <span className="font-bold">ACCUMULATED RUNTIME SPEND:</span>
                    <span className={`text-base font-bold ${isBudgetTripped ? 'text-destructive font-black' : 'text-primary'}`}>
                      ${currentSpend.toFixed(2)} / ${budgetCap.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-4 bg-muted border border-foreground/30 overflow-hidden relative">
                    <div
                      ref={spendMeterRef}
                      className={`h-full transition-all duration-300 ${
                        isBudgetTripped
                          ? 'bg-destructive'
                          : (currentSpend / budgetCap) > 0.75
                          ? 'bg-amber-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, (currentSpend / budgetCap) * 100)}%` }}
                    />
                  </div>

                  {isBudgetTripped && (
                    <div className="mt-3 p-2.5 bg-destructive/10 border-2 border-destructive text-destructive font-mono-jet text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertTriangle size={16} className="shrink-0 animate-bounce" />
                      <div>
                        <div className="font-bold uppercase tracking-wider">HARD CIRCUIT BREACH DETECTED</div>
                        <div className="text-[11px] opacity-90">
                          In-process transport dropped socket before sending token packet. Loop aborted cleanly without 3rd-party proxy latency.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Real-time Agent Execution Terminal Logs */}
                <div className="bg-muted p-3 border border-foreground/20 font-mono-jet text-[11px] space-y-1">
                  <div className="text-[10px] opacity-60 uppercase font-bold border-b border-foreground/15 pb-1 flex justify-between">
                    <span>In-Process Interceptor Audit Feed</span>
                    <span>ZERO DATA EGRESS</span>
                  </div>
                  <div className="space-y-1 pt-1 max-h-24 overflow-y-auto">
                    {agentLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`truncate ${
                          log.includes('TRIPPED') || log.includes('FAIL-CLOSED')
                            ? 'text-destructive font-bold'
                            : log.includes('SAVED')
                            ? 'text-emerald-600 font-bold'
                            : 'opacity-85'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: CIRCUIT BREAKER SIMULATOR */}
            {/* ================================================================= */}
            {activeTab === 'circuit' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/20">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-foreground">
                      Adaptive Outage Defense (429 &amp; 503 Resilient)
                    </h4>
                    <p className="text-xs opacity-80 font-sans mt-0.5">
                      Experience how Backstop instantly trips on rate limit spikes to prevent thread hang.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {circuitState === 'CLOSED' && (
                      <button
                        onClick={trigger429Outage}
                        className="px-3 py-1.5 bg-destructive text-destructive-foreground text-xs font-mono-jet font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer border border-foreground/30"
                      >
                        <Flame size={13} />
                        <span>Inject 429 Surge</span>
                      </button>
                    )}
                    {circuitState === 'OPEN' && (
                      <button
                        onClick={triggerCanary}
                        className="px-3 py-1.5 bg-amber-500 text-white text-xs font-mono-jet font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer border border-foreground/30"
                      >
                        <Activity size={13} />
                        <span>Probe Canary (5%)</span>
                      </button>
                    )}
                    {(circuitState === 'OPEN' || circuitState === 'HALF_OPEN') && (
                      <button
                        onClick={recoverCircuit}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-mono-jet font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer border border-foreground/30"
                      >
                        <CheckCircle2 size={13} />
                        <span>Recover Primary</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Circuit Tri-State Machine Visual */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono-jet text-xs">
                  <div
                    className={`p-3 border transition-all ${
                      circuitState === 'CLOSED'
                        ? 'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                        : 'bg-muted border-foreground/20 opacity-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold">STATE: CLOSED</div>
                    <div className="text-[10px] mt-1">Normal Dispatch</div>
                  </div>

                  <div
                    className={`p-3 border transition-all ${
                      circuitState === 'OPEN'
                        ? 'bg-destructive/15 border-2 border-destructive text-destructive font-bold shadow-xs'
                        : 'bg-muted border-foreground/20 opacity-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold">STATE: OPEN</div>
                    <div className="text-[10px] mt-1">Local Fast-Reject</div>
                  </div>

                  <div
                    className={`p-3 border transition-all ${
                      circuitState === 'HALF_OPEN'
                        ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                        : 'bg-muted border-foreground/20 opacity-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold">STATE: HALF-OPEN</div>
                    <div className="text-[10px] mt-1">Trial Canary Probe</div>
                  </div>
                </div>

                {/* Comparison Card: Raw SDK vs Backstop Circuit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Without Backstop */}
                  <div className="p-3.5 bg-background border border-foreground/30 space-y-2">
                    <div className="text-xs font-mono-jet font-bold text-destructive flex items-center justify-between">
                      <span>WITHOUT BACKSTOP</span>
                      <span className="text-[9px] px-1 bg-destructive/15">NAIVE RETRY</span>
                    </div>
                    <div className="text-xs font-mono-jet space-y-1 opacity-85">
                      <div>Timeout Hang: <span className="font-bold text-destructive">12,400 ms</span></div>
                      <div>Thread Blocked: <span className="font-bold text-destructive">YES (Pool Exhaustion)</span></div>
                      <div>Retry Behavior: <span className="opacity-80">Synchronized retry storm</span></div>
                    </div>
                  </div>

                  {/* With Backstop */}
                  <div className="p-3.5 bg-background border-2 border-primary space-y-2 shadow-xs">
                    <div className="text-xs font-mono-jet font-bold text-primary flex items-center justify-between">
                      <span>WITH BACKSTOP</span>
                      <span className="text-[9px] px-1 bg-primary text-primary-foreground font-bold">IN-PROCESS</span>
                    </div>
                    <div className="text-xs font-mono-jet space-y-1 opacity-90">
                      <div>Local Fast-Reject: <span className="font-bold text-emerald-600">0.07 ms</span></div>
                      <div>Socket Pool: <span className="font-bold text-emerald-600">100% Protected</span></div>
                      <div>Fallback: <span className="font-bold text-primary">{fallbackActive ? 'GPT-4o-mini (Instant)' : 'Ready'}</span></div>
                    </div>
                  </div>
                </div>

                {/* Live Circuit Log */}
                <div className="bg-muted p-3 border border-foreground/20 font-mono-jet text-[11px] space-y-1">
                  <div className="text-[10px] opacity-60 uppercase font-bold border-b border-foreground/15 pb-1">
                    Event Stream
                  </div>
                  <div className="space-y-1 pt-1">
                    {circuitLogs.map((log, i) => (
                      <div key={i} className={`truncate ${log.includes('OUTAGE') || log.includes('OPEN') ? 'text-destructive font-bold' : log.includes('RECOVERED') ? 'text-emerald-600 font-bold' : 'opacity-85'}`}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: ZERO EGRESS INSPECTION */}
            {/* ================================================================= */}
            {activeTab === 'egress' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/20">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-foreground">
                      In-Process Memory Hook vs Hosted Gateways
                    </h4>
                    <p className="text-xs opacity-80 font-sans mt-0.5">
                      Verify that zero data, master keys, or prompts transit through remote third-party servers.
                    </p>
                  </div>
                  <button
                    onClick={() => setEgressInspectActive(!egressInspectActive)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-mono-jet font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer border border-foreground/30"
                  >
                    <Server size={13} />
                    <span>{egressInspectActive ? 'Hide Memory Layout' : 'Inspect Runtime Memory'}</span>
                  </button>
                </div>

                {/* Architecture Visual Step Comparison */}
                <div className="space-y-3 font-mono-jet text-xs">
                  {/* Hosted Gateway Route */}
                  <div className="p-3 bg-muted border border-foreground/20 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-destructive">HOSTED REVERSE PROXY ARCHITECTURE</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-destructive/15 text-destructive font-bold">
                        +38ms to +50ms OVERHEAD
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] opacity-85">
                      <span className="px-2 py-1 bg-background border border-foreground/20">App Process</span>
                      <ArrowRight size={12} className="opacity-50" />
                      <span className="px-2 py-1 bg-destructive/10 text-destructive border border-destructive/30 font-bold">
                        3rd-Party SaaS Proxy (VPC Egress!)
                      </span>
                      <ArrowRight size={12} className="opacity-50" />
                      <span className="px-2 py-1 bg-background border border-foreground/20">Model Provider</span>
                    </div>
                    <div className="text-[11px] text-destructive/90 opacity-90">
                      ⚠️ Master API keys and raw prompt histories stored on someone else&apos;s servers.
                    </div>
                  </div>

                  {/* Backstop Route */}
                  <div className="p-3 bg-background border-2 border-primary space-y-2 shadow-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-primary">BACKSTOP IN-PROCESS ADAPTER</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-primary text-primary-foreground font-bold">
                        0.08ms LATENCY ▪ 0 HOPS
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <div className="px-2 py-1 bg-primary text-primary-foreground font-bold flex items-center gap-1.5">
                        <Cpu size={12} />
                        <span>App Process [Backstop Hook In-Memory]</span>
                      </div>
                      <ArrowRight size={12} className="text-primary" />
                      <span className="px-2 py-1 bg-muted border border-foreground/20 font-bold">
                        Direct TLS to Provider
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold">
                      ✓ Zero prompt egress. Zero external credentials needed. Sub-millisecond CPU execution.
                    </div>
                  </div>
                </div>

                {/* Memory Inspector Drawer */}
                {egressInspectActive && (
                  <div className="p-3.5 bg-muted border border-foreground/30 font-mono-jet text-xs space-y-2 animate-in fade-in">
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 border-b border-foreground/20 pb-1">
                      Process Memory &amp; Socket Hook Map (node:v22 / C++ V8 Hook)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>Socket Hook: <span className="text-emerald-600 font-bold">Direct socket.connect</span></div>
                      <div>Heap Overhead: <span className="font-bold">&lt; 4.2 MB</span></div>
                      <div>TLS Verification: <span className="font-bold">Strict In-Process</span></div>
                      <div>Out-of-Band Telemetry: <span className="text-emerald-600 font-bold">DISABLED (0 bytes)</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
