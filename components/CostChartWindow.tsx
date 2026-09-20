'use client';

import React, { useState } from 'react';

interface ProtectionScenario {
  name: string;
  architecture: 'In-Process' | 'Direct SDK' | 'Remote Proxy';
  unboundedCost: number;
  containedCost: number;
  unboundedDisplay: string;
  containedDisplay: string;
}

const SCENARIOS: ProtectionScenario[] = [
  {
    name: 'Recursive Agent Coder Loop',
    architecture: 'In-Process',
    unboundedCost: 3840,
    containedCost: 5.0,
    unboundedDisplay: '$3,840/hr',
    containedDisplay: '$5.00 [TRIP]',
  },
  {
    name: 'Parallel Research Agent Swarm',
    architecture: 'In-Process',
    unboundedCost: 2150,
    containedCost: 10.0,
    unboundedDisplay: '$2,150/hr',
    containedDisplay: '$10.00 [TRIP]',
  },
  {
    name: 'Autonomous Git Bot PR Review',
    architecture: 'In-Process',
    unboundedCost: 920,
    containedCost: 2.5,
    unboundedDisplay: '$920/hr',
    containedDisplay: '$2.50 [TRIP]',
  },
  {
    name: 'Customer Support Retries (429 Storm)',
    architecture: 'In-Process',
    unboundedCost: 1450,
    containedCost: 0.0,
    unboundedDisplay: '$1,450/hr',
    containedDisplay: '$0.00 [CIRCUIT SHED]',
  },
  {
    name: 'SaaS Proxy Extra Subscription Tax',
    architecture: 'Remote Proxy',
    unboundedCost: 450,
    containedCost: 0.0,
    unboundedDisplay: '$450/mo',
    containedDisplay: '$0.00 [BACKSTOP FREE]',
  },
];

export function CostChartWindow() {
  const [activeTab, setActiveTab] = useState<'contained' | 'unbounded'>('contained');

  const maxVal = 4000;

  return (
    <div className="w-full max-w-2xl bg-card border border-foreground/30 shadow-md overflow-hidden text-card-foreground">
      {/* Title bar */}
      <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[11px] font-pixel tracking-wider">
        <span>RUNAWAY AGENT BUDGET CONTAINMENT [USD]</span>
        <span className="text-[11px] cursor-pointer hover:opacity-80">⊠</span>
      </div>

      <div className="p-4 bg-card/60">
        {/* Top Controls: Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-foreground/20">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('contained')}
              className={`px-3 py-1 text-[11px] font-mono-jet border border-foreground/30 transition-colors cursor-pointer ${
                activeTab === 'contained'
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              With Backstop (Hard Isolation)
            </button>
            <button
              onClick={() => setActiveTab('unbounded')}
              className={`px-3 py-1 text-[11px] font-mono-jet border border-foreground/30 transition-colors cursor-pointer ${
                activeTab === 'unbounded'
                  ? 'bg-destructive text-destructive-foreground font-bold'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              Raw Unbounded SDK (Runaway)
            </button>
          </div>

          <div className="text-[10px] font-mono-jet opacity-75">
            IN-PROCESS LOCAL CIRCUIT ENFORCEMENT
          </div>
        </div>

        {/* Rows with bar tracks */}
        <div className="mt-4 space-y-3">
          {SCENARIOS.map((s) => {
            const rawVal = activeTab === 'contained' ? s.containedCost : s.unboundedCost;
            const percentage = Math.min(100, Math.max(2, (rawVal / maxVal) * 100));
            const isProtected = activeTab === 'contained';

            return (
              <div key={s.name} className="flex items-center gap-3 text-[12px] font-mono-jet">
                {/* Scenario Name */}
                <div className="w-52 shrink-0">
                  <div className="font-semibold text-[11px] truncate">{s.name}</div>
                  <div className="text-[9px] opacity-60">{s.architecture}</div>
                </div>

                {/* Segmented Track Bar */}
                <div className="flex-1 h-5 bg-muted border border-foreground/30 relative overflow-hidden flex items-center">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      isProtected
                        ? 'bg-primary'
                        : 'bg-destructive'
                    }`}
                    style={{
                      width: `${isProtected ? Math.min(percentage, 8) : percentage}%`,
                    }}
                  />
                  {/* Tick marks */}
                  <div className="absolute inset-0 pointer-events-none flex justify-between px-1 opacity-20">
                    {[0, 25, 50, 75, 100].map((t) => (
                      <div key={t} className="w-[1px] h-full bg-foreground" />
                    ))}
                  </div>
                </div>

                {/* Price Label */}
                <div className="w-28 text-right font-bold text-[11px]">
                  {isProtected ? (
                    <span className="text-primary font-black">
                      {s.containedDisplay}
                    </span>
                  ) : (
                    <span className="text-destructive font-black">
                      {s.unboundedDisplay}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-foreground/15 flex items-center justify-between text-[10px] font-mono-jet opacity-75">
          <span>*Calculated across OpenAI o1/o3 and Anthropic Claude 3.7 multi-turn loops</span>
          <span className="font-bold text-foreground">ZERO EGRESS // LOCAL MEMORY HOOK</span>
        </div>
      </div>
    </div>
  );
}
