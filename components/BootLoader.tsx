'use client';

import React, { useState, useEffect } from 'react';

export function BootLoader() {
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth count-up to 100% over ~1.2s
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 350);
          return 100;
        }
        const step = Math.floor(Math.random() * 14) + 6;
        return Math.min(100, prev + step);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  if (isDone) return null;

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none transition-opacity duration-500">
      <div className="w-72 md:w-84 bg-card border border-foreground/30 shadow-lg pointer-events-auto">
        {/* Title bar */}
        <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between text-[11px] font-pixel">
          <span>Backstop v1.0.0 [In-Process]</span>
          <button
            onClick={() => setIsDone(true)}
            className="text-[10px] hover:opacity-80"
          >
            ⊠
          </button>
        </div>

        {/* Content */}
        <div className="p-3 text-card-foreground font-mono-jet text-[11px]">
          <div className="flex items-center justify-between font-bold">
            <span>Mounting Transport Guard ...</span>
            <span>{percent} %</span>
          </div>
          <div className="text-[10px] opacity-75 mt-1">
            Budget Isolator, Circuit Tripper, Backpressure Pool
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 h-3 bg-background border border-foreground/30 p-[1px]">
            <div
              className="h-full bg-primary transition-all duration-75 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
