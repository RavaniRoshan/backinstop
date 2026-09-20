'use client';

import React from 'react';

interface BenchmarkRow {
  name: string;
  category: string;
  latency: string;
  riskProfile: string;
  progress: number;
  highlight?: boolean;
}

const BENCHMARK_DATA: BenchmarkRow[] = [
  {
    name: 'Backstop [In-Process]',
    category: 'Local Transport Guard',
    latency: '+0.12 ms',
    riskProfile: 'Zero Egress / Hard Trip',
    progress: 98,
    highlight: true,
  },
  {
    name: 'Raw AI SDK (Direct)',
    category: 'No Reliability Layer',
    latency: '0.00 ms',
    riskProfile: 'Runaway Loop Threat',
    progress: 15,
  },
  {
    name: 'Cloudflare AI Gateway',
    category: 'Remote Reverse Proxy',
    latency: '+38.40 ms',
    riskProfile: 'Cloud Egress + DNS Hop',
    progress: 48,
  },
  {
    name: 'Portkey Gateway',
    category: 'Hosted SaaS Proxy',
    latency: '+51.20 ms',
    riskProfile: 'Prompts Stored Offsite',
    progress: 38,
  },
  {
    name: 'LiteLLM Proxy Instance',
    category: 'Self-Hosted Bridge',
    latency: '+46.80 ms',
    riskProfile: 'Container Ops Overhead',
    progress: 42,
  },
];

export function BenchmarkWindow() {
  return (
    <div className="w-full h-full bg-card border border-foreground/30 shadow-md select-none flex flex-col justify-between">
      {/* Title bar */}
      <div>
        <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between text-[11px] font-pixel tracking-wider">
          <span>ARCHITECTURAL LATENCY BENCHMARK</span>
          <span className="text-[10px]">p99 emp. data</span>
        </div>

        {/* Body */}
        <div className="p-3.5 font-mono-jet text-[11px] text-card-foreground">
          {/* Table header */}
          <div className="grid grid-cols-12 pb-2 mb-2 border-b border-foreground/20 font-bold text-[10px] uppercase opacity-80">
            <span className="col-span-5">Reliability Architecture</span>
            <span className="col-span-3 text-center">Net Latency</span>
            <span className="col-span-4 text-right">Security & Containment</span>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {BENCHMARK_DATA.map((row) => (
              <div key={row.name} className="space-y-1">
                <div className="grid grid-cols-12 items-center text-[11px]">
                  <span
                    className={`col-span-5 truncate ${
                      row.highlight
                        ? 'font-bold text-foreground'
                        : 'opacity-90'
                    }`}
                  >
                    {row.name}
                  </span>
                  <span
                    className={`col-span-3 text-center font-bold ${
                      row.highlight ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {row.latency}
                  </span>
                  <span className="col-span-4 text-right font-medium text-[10px] opacity-80">
                    {row.riskProfile}
                  </span>
                </div>

                {/* Slider Track with square knob */}
                <div className="relative w-full h-3 bg-muted border border-foreground/30 flex items-center">
                  <div
                    className={`h-full ${
                      row.highlight ? 'bg-primary' : 'bg-foreground/50'
                    }`}
                    style={{ width: `${row.progress}%` }}
                  />
                  {/* Square knob */}
                  <div
                    className="absolute w-2.5 h-4 bg-background border border-foreground shadow-xs cursor-pointer -translate-x-1/2"
                    style={{ left: `${row.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dither Bar Strip at bottom */}
      <div className="p-3 border-t border-foreground/20 bg-muted/50 flex items-center justify-between font-mono-jet text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary inline-block" />
          <span className="font-bold text-foreground">
            IN-PROCESS TRANSPORT ADAPTER
          </span>
        </div>
        <span className="opacity-70">
          Source: Apache Bench 10,000 reqs/sec
        </span>
      </div>
    </div>
  );
}
