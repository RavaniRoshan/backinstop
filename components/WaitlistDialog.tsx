'use client';

import React, { useState } from 'react';
import { CubeLogo } from './CubeLogo';

interface WaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'waitlist' | 'discord' | 'signin' | 'news';
}

export function WaitlistDialog({
  isOpen,
  onClose,
  defaultMode = 'waitlist',
}: WaitlistDialogProps) {
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('Multi-Agent Swarm Reliability');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setTicketNumber(Math.floor(100000 + Math.random() * 900000));
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="w-full max-w-md bg-card border border-foreground/30 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-card-foreground">
        {/* Title bar */}
        <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[11px] font-pixel tracking-wider">
          <div className="flex items-center gap-2">
            <span>
              {defaultMode === 'waitlist'
                ? 'Backstop ▪ In-Process SDK Access'
                : defaultMode === 'discord'
                ? 'Backstop ▪ Developer Community'
                : defaultMode === 'signin'
                ? 'Backstop ▪ Telemetry Console'
                : 'Backstop ▪ Release Notes'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-primary-foreground/20 px-1 text-[11px] text-primary-foreground cursor-pointer"
          >
            ⊠
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-5 font-mono-jet">
          {defaultMode === 'news' ? (
            <div className="space-y-3 text-[12px]">
              <div className="font-bold text-[14px]">
                Release notes
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="font-bold">0.6.0 — published</div>
                  <p className="leading-relaxed opacity-90">
                    On PyPI as <span className="font-mono-jet">backstop-ai</span>, as
                    the <span className="font-mono-jet">v0.6.0</span> GitHub Release,
                    and on npm. MIT licensed. The default branch now carries
                    unreleased work past that tag, so a source install tracks{' '}
                    <span className="font-mono-jet">main</span> rather than the
                    release.
                  </p>
                </div>
                <div>
                  <div className="font-bold">New on main — the spend ledger</div>
                  <p className="leading-relaxed opacity-90">
                    Opt-in and off by default. One config field turns it on and
                    every completed provider request appends a priced, attributed
                    record: 18 fields, 13 attribution dimensions, money as{' '}
                    <span className="font-mono-jet">Decimal</span> end to end and a
                    string on the wire. Run{' '}
                    <span className="font-mono-jet">backstop ledger demo</span> — no
                    API key, no network, deterministic to the dollar — for a
                    chargeback grouped by team and feature, a loss report, and a
                    revenue join. It costs real latency and we publish the number.
                    Detection is report-only: it cannot block, cancel or kill.
                  </p>
                </div>
                <div>
                  <div className="font-bold">Also on npm — read this before you use it</div>
                  <p className="leading-relaxed opacity-90">
                    The npm package of the same name is a{' '}
                    <span className="font-bold">partial TypeScript port</span>, not
                    the Python distribution: OpenAI only, it patches the client
                    rather than injecting a transport, it has five priorities
                    against Python&apos;s three, and it has no metrics, OpenTelemetry,
                    Redis, hierarchical budgets, audit sinks or ledger. Use the
                    Python package for the full feature set or for Anthropic.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <a
                  href="https://github.com/RavaniRoshan/backstop/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline text-xs font-bold"
                >
                  Full changelog ↗
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <CubeLogo size={48} strokeColor="currentColor" />
              </div>
              <div className="font-bold text-[14px]">
                REQUEST LOGGED: TICKET #{ticketNumber || 849102}
              </div>
              <p className="text-[12px] opacity-80">
                You have been registered for Backstop SDK early updates and private enterprise preview builds.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-colors"
                >
                  Star On GitHub ↗
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 border border-foreground/30 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-[12px]">
              <div className="flex items-center gap-2 pb-2 border-b border-foreground/20">
                <CubeLogo size={24} strokeColor="currentColor" />
                <span className="font-bold">Protect Your AI SDK Workflows</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold opacity-75 mb-1">
                  Developer Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-foreground/30 text-[12px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold opacity-75 mb-1">
                  Primary Reliability Challenge
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-2 py-1.5 bg-background border border-foreground/30 text-[12px] text-foreground outline-none cursor-pointer"
                >
                  <option>Autonomous Agent Loops &amp; Runaway Spend</option>
                  <option>Upstream 429 Provider Throttling &amp; Cascades</option>
                  <option>Replacing Costly 3rd-Party Gateway Latency</option>
                  <option>Zero-Cloud-Egress Security &amp; Compliance</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="https://github.com/RavaniRoshan/backstop"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] opacity-75 hover:text-primary underline"
                >
                  github.com/RavaniRoshan/backstop ↗
                </a>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1 bg-transparent border border-foreground/30 text-xs hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-colors cursor-pointer"
                  >
                    Join Program
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
