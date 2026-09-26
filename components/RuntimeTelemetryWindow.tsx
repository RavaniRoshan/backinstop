'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  sub: string;
  status: 'good' | 'neutral';
}

export function RuntimeTelemetryWindow() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'sockets' | 'audit'>('metrics');
  const [burstActive, setBurstActive] = useState(false);
  const [admittedReqs, setAdmittedReqs] = useState(14820);
  const [interceptLatency, setInterceptLatency] = useState(0.07);
  const [activeSockets, setActiveSockets] = useState(14);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Backstop transport injected in-process: httpx / httpx2, per SDK family',
    '[OK] 0.07ms control path: chat.completions.create() -> admitted',
    '[OK] 0.07ms control path: anthropic.messages.create() -> critical priority',
    '[BUDGET] session_worker_03: tokens admitted (1,240 tokens, $0.018 spend)',
  ]);

  // Periodic subtle jitter to show live heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      if (!burstActive) {
        setAdmittedReqs((prev) => prev + Math.floor(Math.random() * 4) + 1);
        setInterceptLatency(Number((0.07 + Math.random() * 0.01).toFixed(2)));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [burstActive]);

  const triggerMicroBurst = () => {
    if (burstActive) return;
    setBurstActive(true);
    setInterceptLatency(0.07);
    setActiveSockets(42);
    setAdmittedReqs((prev) => prev + 100);

    const burstLog = `[BURST] 100 requests queued on the admission gate: 0 dropped, 0.07ms control path`;
    setLogs((prev) => [burstLog, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setBurstActive(false);
      setActiveSockets(14);
      setInterceptLatency(0.07);
      setLogs((prev) => [
        `[RESTORE] Queue drained. Connection pool returned to 14 warm sockets.`,
        ...prev.slice(0, 4),
      ]);
    }, 2800);
  };

  const metrics: MetricItem[] = [
    {
      label: 'Intercept CPU Overhead',
      value: `${interceptLatency} ms`,
      sub: 'p99: 0.07ms (committed snapshot)',
      status: 'good',
    },
    {
      label: 'Warm Sockets / Max',
      value: `${activeSockets} / 64`,
      sub: burstActive ? 'Queued and admitted in priority order' : 'Healthy connection pool headroom',
      status: 'good',
    },
    {
      label: 'Data Egress to 3rd Party',
      value: '0.00 bytes',
      sub: 'In-process transport: keys never leave host',
      status: 'good',
    },
    {
      label: 'Total Intercepted Calls',
      value: admittedReqs.toLocaleString(),
      sub: 'Zero 500 retry storms triggered',
      status: 'good',
    },
  ];

  return (
    <div className="w-full h-full bg-card border border-foreground/30 shadow-md select-none flex flex-col justify-between">
      {/* Title bar */}
      <div>
        <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between text-[11px] font-pixel tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IN-PROCESS RUNTIME TELEMETRY</span>
          </div>
          <span className="text-[10px] font-mono-jet opacity-90">PID: 49120</span>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-foreground/20 bg-muted/50 px-3 pt-2 gap-2 text-[11px] font-mono-jet">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-2.5 py-1 border-t border-x border-foreground/30 font-bold transition-colors cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-card text-foreground border-b-transparent -mb-[1px]'
                : 'text-foreground/70 hover:text-foreground bg-transparent'
            }`}
          >
            Live Core Metrics
          </button>
          <button
            onClick={() => setActiveTab('sockets')}
            className={`px-2.5 py-1 border-t border-x border-foreground/30 font-bold transition-colors cursor-pointer ${
              activeTab === 'sockets'
                ? 'bg-card text-foreground border-b-transparent -mb-[1px]'
                : 'text-foreground/70 hover:text-foreground bg-transparent'
            }`}
          >
            Connection Pool
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-2.5 py-1 border-t border-x border-foreground/30 font-bold transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-card text-foreground border-b-transparent -mb-[1px]'
                : 'text-foreground/70 hover:text-foreground bg-transparent'
            }`}
          >
            Security Audit
          </button>
        </div>

        {/* Body Content */}
        <div className="p-3.5 font-mono-jet text-[11px] text-card-foreground">
          {activeTab === 'metrics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {metrics.map((m) => (
                  <div key={m.label} className="p-2.5 bg-muted border border-foreground/20">
                    <div className="text-[10px] opacity-75 uppercase truncate">{m.label}</div>
                    <div className="text-lg font-bold text-foreground mt-0.5">{m.value}</div>
                    <div className="text-[9px] opacity-70 mt-0.5 truncate">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Live Log Stream */}
              <div className="p-2.5 bg-muted/80 border border-foreground/20 space-y-1">
                <div className="text-[10px] opacity-70 uppercase font-bold flex items-center justify-between border-b border-foreground/15 pb-1">
                  <span>Intercept Stream</span>
                  <span className="text-[9px] text-emerald-600 font-bold">● ACTIVE HOOK</span>
                </div>
                <div className="space-y-1 pt-1 text-[10px]">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`truncate ${
                        log.includes('BURST')
                          ? 'text-primary font-bold'
                          : log.includes('RESTORE')
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

          {activeTab === 'sockets' && (
            <div className="space-y-3">
              <div className="p-3 bg-muted border border-foreground/20 space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                  <span>Runtime Transport Dispatcher</span>
                  <span className="text-emerald-600 font-bold">DIRECT TLS VERIFIED</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="opacity-80">Provider: api.anthropic.com</span>
                    <span className="font-bold text-foreground">8 sockets (keep-alive)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Provider: api.openai.com</span>
                    <span className="font-bold text-foreground">6 sockets (keep-alive)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Circuit Status</span>
                    <span className="text-emerald-600 font-bold">CLOSED (0 failures in 5m)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Starvation Protection</span>
                    <span className="font-bold text-primary">Active (oldest waiter released)</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-background border border-foreground/20 text-[10px] opacity-85 leading-snug">
                Backstop injects its own transport into the wrapped SDK client, in memory. Requests go straight to the provider: no proxy server, no extra DNS hop, no external latency hop.
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="p-3 bg-muted border border-foreground/20 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <ShieldCheck size={14} />
                  <span>Zero Egress &amp; Memory Isolation Verified</span>
                </div>
                <ul className="space-y-1 text-[10px] opacity-85">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span>No external telemetry servers contacted (0 outbound HTTP calls).</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span>API keys remain in environment memory — never transmitted to third parties.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span>User prompt histories evaluated strictly in local process heap.</span>
                  </li>
                </ul>
              </div>

              <div className="p-2.5 bg-card border border-foreground/20 text-[10px] font-bold text-center text-foreground">
                Compliant with SOC2 Type II, HIPAA, and air-gapped VPC requirements.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer action bar */}
      <div className="p-3 bg-muted border-t border-foreground/20 flex items-center justify-between font-mono-jet text-[11px]">
        <button
          onClick={triggerMicroBurst}
          disabled={burstActive}
          className="px-3 py-1 bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <Zap size={12} className={burstActive ? 'animate-bounce' : ''} />
          <span>{burstActive ? 'Simulating 100 Reqs...' : 'Simulate 100-Req Surge'}</span>
        </button>

        <span className="text-[10px] opacity-70">
          Latency: <strong className="text-foreground">{interceptLatency}ms</strong>
        </span>
      </div>
    </div>
  );
}
