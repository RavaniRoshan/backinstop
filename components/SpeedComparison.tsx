'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export function SpeedComparison() {
  const [isRunning, setIsRunning] = useState(true);
  const [backstopDone, setBackstopDone] = useState(false);
  const [proxyProgress, setProxyProgress] = useState(0);
  const [proxyLog, setProxyLog] = useState('');

  const fullProxyLog =
    "Connecting to proxy gateway...\nDNS resolved (8.2ms)\nTLS handshake to remote gateway (18.4ms)\nProxy payload validation & auth token check (6.1ms)\nForwarding egress request to upstream provider (14.2ms)\nAwaiting upstream response & streaming back (48.6ms total overhead)";

  const startTest = () => {
    setBackstopDone(false);
    setProxyProgress(0);
    setProxyLog('');
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (!isRunning) return;

    const backstopTimer = setTimeout(() => {
      setBackstopDone(true);
    }, 114);

    let charIndex = 0;
    const streamInterval = setInterval(() => {
      charIndex += 4;
      if (charIndex >= fullProxyLog.length) {
        setProxyLog(fullProxyLog);
        setProxyProgress(100);
        clearInterval(streamInterval);
      } else {
        setProxyLog(fullProxyLog.slice(0, charIndex));
        setProxyProgress(Math.floor((charIndex / fullProxyLog.length) * 100));
      }
    }, 35);

    return () => {
      clearTimeout(backstopTimer);
      clearInterval(streamInterval);
    };
  }, [isRunning]);

  return (
    <div className="border border-foreground/30 bg-card p-4 md:p-6 shadow-md text-card-foreground">
      <div className="flex items-center justify-between border-b border-foreground/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
          <span className="font-mono-jet text-[12px] font-bold tracking-wider">
            BENCHMARK: IN-PROCESS RELIABILITY VS REMOTE GATEWAYS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={startTest}
            className="flex items-center gap-1 text-[11px] font-mono-jet px-2.5 py-1 border border-foreground/30 hover:bg-foreground hover:text-background transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Re-run Comparison</span>
          </button>
          <a
            href="https://github.com/RavaniRoshan/backstop"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono-jet underline hover:text-primary"
          >
            View Repo ↗
          </a>
        </div>
      </div>

      {/* Side-by-side terminal windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Backstop In-Process */}
        <div className="border border-foreground/30 bg-background flex flex-col justify-between">
          <div className="bg-primary text-primary-foreground px-3 py-1 text-[11px] font-pixel flex items-center justify-between">
            <span>Backstop (In-Process Transport Adapter)</span>
            <span className="font-bold text-[10px] bg-background/20 px-1">0.11 ms OVERHEAD</span>
          </div>

          <div className="p-3 font-mono-jet text-[12px] min-h-[150px] flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-[10px] opacity-70">{`// Local Memory Hook (Transport Layer):`}</div>
              <pre className="text-foreground font-semibold text-[11px] leading-tight bg-muted p-2 border border-foreground/20 overflow-x-auto">
                {`{
  "layer": "in_process",
  "budget_check": "PASS ($0.042 / $5.00 limit)",
  "backpressure": "ADMITTED (tier 1)",
  "circuit_breaker": "CLOSED (healthy)",
  "proxy_hop_latency_ms": 0.00
}`}
              </pre>
            </div>

            <div className="mt-3 pt-2 border-t border-foreground/20 flex items-center justify-between text-[11px]">
              <div>
                <span className="opacity-70">Security: </span>
                <span className="font-bold text-primary">0 Bytes 3rd-Party Egress</span>
              </div>
              <div>
                <span className="opacity-70">Interceptor Delay: </span>
                <span className="font-bold">{backstopDone ? '0.114 ms' : '0.000 ms'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Remote Hosted Proxy */}
        <div className="border border-foreground/30 bg-background flex flex-col justify-between">
          <div className="bg-foreground text-background px-3 py-1 text-[11px] font-pixel flex items-center justify-between">
            <span>Remote Hosted AI Gateway (SaaS Proxy)</span>
            <span className="text-destructive font-bold text-[10px]">+48.6 ms EXTRA HOP</span>
          </div>

          <div className="p-3 font-mono-jet text-[12px] min-h-[150px] flex flex-col justify-between">
            <div className="space-y-1 overflow-hidden">
              <div className="text-[10px] opacity-70">{`// External Network Roundtrip:`}</div>
              <div className="bg-muted p-2 border border-foreground/20 text-[11px] h-[85px] overflow-y-auto leading-relaxed opacity-90 whitespace-pre-line">
                {proxyLog}
                {proxyProgress < 100 && (
                  <span className="inline-block w-2 h-3 bg-foreground ml-0.5 animate-blink" />
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-foreground/20 flex items-center justify-between text-[11px]">
              <div>
                <span className="opacity-70">Security: </span>
                <span className="font-bold text-destructive">Prompts Relayed to 3rd Party</span>
              </div>
              <div>
                <span className="opacity-70">Hop Delay: </span>
                <span className="font-bold text-destructive">48.600 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
