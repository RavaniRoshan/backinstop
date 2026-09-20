'use client';

import React from 'react';

export function WorkflowChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Chart 1: 429 Throttling Storm & Cascade Protection */}
      <div className="border border-foreground/30 bg-card p-5 shadow-md text-card-foreground">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-primary text-primary-foreground text-[10px] font-mono-jet px-2 py-0.5 tracking-wider uppercase font-bold">
            Cascade Failure Prevention
          </span>
          <span className="font-mono-jet text-[10px] opacity-70">CHART 01 // CIRCUIT BREAKING</span>
        </div>

        <h3 className="font-sans-dm font-semibold text-xl text-foreground">
          Autonomous Circuit Breakers
        </h3>
        <p className="text-[14px] opacity-85 mt-1 mb-4 leading-normal">
          When AI providers return 429s or 503s, raw SDKs trigger retry storms that amplify the outage. Backstop trips in-process, immediately shedding background work while protecting user-critical prompts.
        </p>

        {/* Visual Chart Canvas / SVG */}
        <div className="h-44 bg-background border border-foreground/30 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono-jet opacity-70">
            <span>Provider 429 Spike Impact</span>
            <span>Cascade Risk %</span>
          </div>

          <div className="relative w-full h-24 flex items-end justify-around">
            {/* Direct SDK */}
            <div className="flex flex-col items-center">
              <div className="h-22 w-14 bg-destructive border border-foreground/30 relative flex items-center justify-center">
                <span className="text-destructive-foreground text-[10px] font-mono-jet font-bold">88.4%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 opacity-80">Raw SDK Storm</span>
            </div>

            {/* Simple Exponential Backoff */}
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 bg-foreground/40 border border-foreground/30 relative flex items-center justify-center">
                <span className="text-background text-[10px] font-mono-jet font-bold">42.1%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 opacity-80">Basic Retries</span>
            </div>

            {/* Backstop */}
            <div className="flex flex-col items-center">
              <div className="h-2 w-14 bg-primary border border-foreground/30 relative flex items-center justify-center">
                <span className="absolute -top-5 text-primary text-[10px] font-mono-jet font-black">0.0%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 font-bold text-foreground">Backstop Guard</span>
            </div>
          </div>

          <div className="text-right text-[9px] font-mono-jet text-primary font-bold">
            ▲ ZERO RETRY CASCADE AMPLIFICATION
          </div>
        </div>
      </div>

      {/* Chart 2: Hard Budget Isolation */}
      <div className="border border-foreground/30 bg-card p-5 shadow-md text-card-foreground">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-primary text-primary-foreground text-[10px] font-mono-jet px-2 py-0.5 tracking-wider uppercase font-bold">
            Spend Overrun Protection
          </span>
          <span className="font-mono-jet text-[10px] opacity-70">CHART 02 // HARD CEILINGS</span>
        </div>

        <h3 className="font-sans-dm font-semibold text-xl text-foreground">
          Deterministic Budget Isolation
        </h3>
        <p className="text-[14px] opacity-85 mt-1 mb-4 leading-normal">
          Every agentic session and background loop is bounded by a hard local token and cost ceiling. Backstop fails closed in-process, preventing unexpected five-figure API invoices.
        </p>

        {/* Visual Chart Canvas / SVG */}
        <div className="h-44 bg-background border border-foreground/30 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono-jet opacity-70">
            <span>Budget Exceedance Rate</span>
            <span>Ceiling Adherence: 100%</span>
          </div>

          <div className="relative w-full h-24 flex items-end justify-around">
            {/* Standard Agent Loop */}
            <div className="flex flex-col items-center">
              <div className="h-20 w-14 bg-destructive/80 border border-foreground/30 relative flex items-center justify-center">
                <span className="text-destructive-foreground text-[10px] font-mono-jet font-bold">+340%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 opacity-80">Unbounded Loop</span>
            </div>

            {/* Cloud Provider Alerts (Delayed) */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-14 bg-secondary/80 border border-foreground/30 relative flex items-center justify-center">
                <span className="text-secondary-foreground text-[10px] font-mono-jet font-bold">+85%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 opacity-80">Billing Alerts</span>
            </div>

            {/* Backstop Hard Isolation */}
            <div className="flex flex-col items-center">
              <div className="h-1 w-14 bg-primary border border-foreground/30 relative flex items-center justify-center">
                <span className="absolute -top-5 text-primary text-[10px] font-mono-jet font-black">0.00%</span>
              </div>
              <span className="text-[10px] font-mono-jet mt-1 font-bold text-foreground">Backstop Isolated</span>
            </div>
          </div>

          <div className="text-right text-[9px] font-mono-jet opacity-70">
            FAIL-CLOSED PRECISE SPEND ENFORCEMENT
          </div>
        </div>
      </div>
    </div>
  );
}
