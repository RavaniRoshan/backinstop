'use client';

import React from 'react';

export function PatentCollage() {
  return (
    <div className="relative w-full h-[260px] md:h-[300px] border border-foreground/30 bg-card/70 overflow-hidden flex items-center justify-center select-none shadow-md">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:16px_16px] opacity-5" />

      {/* Patent Diagram SVG Schematic */}
      <svg
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-4 relative z-10 opacity-95 text-foreground"
      >
        {/* Patent header markings */}
        <text x="20" y="25" fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          FIG. 1A — BACKSTOP IN-PROCESS TRANSPORT INTERCEPTOR
        </text>
        <text x="345" y="25" fill="currentColor" opacity="0.8" fontSize="9" fontFamily="'JetBrains Mono', monospace">
          SPEC: IN-PROCESS ADAPTER
        </text>

        {/* Agent Runtime Caller */}
        <rect x="25" y="60" width="95" height="52" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
        <text x="32" y="83" fill="currentColor" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          102: Agent Loop
        </text>
        <text x="32" y="98" fill="currentColor" opacity="0.75" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          (SDK Call Invocation)
        </text>

        {/* Connecting bus line */}
        <path d="M 120 86 L 155 86" stroke="currentColor" strokeWidth="1.5" />

        {/* Backstop Transport Guard Kernel */}
        <rect x="155" y="48" width="170" height="126" stroke="currentColor" strokeWidth="2" fill="var(--background)" />
        <rect x="161" y="54" width="158" height="114" stroke="var(--primary)" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
        <text x="170" y="74" fill="var(--primary)" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          104: BACKSTOP CORE HOOK
        </text>
        <line x1="165" y1="84" x2="315" y2="84" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Internal logic gates */}
        <rect x="170" y="94" width="60" height="26" stroke="currentColor" strokeWidth="1.2" fill="var(--card)" />
        <text x="175" y="110" fill="currentColor" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          TokenBucket
        </text>

        <rect x="245" y="94" width="68" height="26" stroke="currentColor" strokeWidth="1.2" fill="var(--card)" />
        <text x="250" y="110" fill="currentColor" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          BudgetLimit
        </text>

        <path d="M 230 107 L 245 107" stroke="currentColor" strokeWidth="1.2" />

        <text x="170" y="145" fill="currentColor" opacity="0.8" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          State: CLOSED (Pass) / TRIP
        </text>

        {/* Output branch 1: Direct Provider TLS */}
        <path d="M 325 86 L 375 86" stroke="currentColor" strokeWidth="1.5" />
        <rect x="375" y="60" width="105" height="52" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
        <text x="383" y="82" fill="currentColor" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          106: Provider API
        </text>
        <text x="383" y="96" fill="currentColor" opacity="0.7" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          (Direct TLS / No Proxy)
        </text>

        {/* Output branch 2: Circuit Shed / Fallback */}
        <path d="M 325 136 L 375 136" stroke="currentColor" strokeWidth="1.5" />
        <rect x="375" y="118" width="105" height="46" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
        <text x="383" y="137" fill="var(--primary)" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          108: Fail-Closed
        </text>
        <text x="383" y="151" fill="currentColor" opacity="0.7" fontSize="8" fontFamily="'JetBrains Mono', monospace">
          Budget/429 Fallback
        </text>

        {/* Punch-card strip at bottom */}
        <g opacity="0.9">
          <rect x="25" y="210" width="455" height="60" stroke="currentColor" strokeWidth="1.2" fill="var(--muted)" />
          <text x="35" y="226" fill="currentColor" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            BACKSTOP IN-PROCESS ADAPTER REGISTER // ZERO NETWORK HOPS
          </text>
          {/* Punch holes */}
          {[40, 65, 85, 110, 140, 165, 185, 210, 235, 270, 295, 320, 350, 380, 410, 440].map((x, i) => (
            <React.Fragment key={x}>
              <rect x={x} y={236 + ((i * 7) % 20)} width="6" height="7" fill="currentColor" />
              <rect x={x + 12} y={244 - ((i * 5) % 14)} width="6" height="7" fill="var(--primary)" />
            </React.Fragment>
          ))}
        </g>
      </svg>

      {/* Watermark stamp */}
      <div className="absolute bottom-2 right-3 font-mono-jet text-[9px] text-primary tracking-widest uppercase font-bold bg-background/90 px-1.5 py-0.5 border border-primary/40">
        FIG. 1A / SPEC: BACKSTOP-TRANSPORT
      </div>
    </div>
  );
}
