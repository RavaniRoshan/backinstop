'use client';

import {
  Activity,
  Bot,
  Cpu,
  FileCode,
  Gauge,
  Layers,
  Lock,
  type LucideIcon,
  Shield,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavItem {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

const primitivesList: NavItem[] = [
  {
    title: "Priority Backpressure",
    href: "#primitives",
    description: "Adaptive queue that sheds background jobs to guarantee sub-second latency for live users.",
    icon: Zap,
  },
  {
    title: "Hard Budget Isolation",
    href: "#primitives",
    description: "Deterministic token and dollar spend ceilings per session, tenant, or agent loop.",
    icon: Shield,
  },
  {
    title: "Circuit Breakers",
    href: "#primitives",
    description: "Tri-state trip logic that prevents provider retry storms and executes instant fallbacks.",
    icon: Activity,
  },
  {
    title: "Zero Egress Security",
    href: "#primitives",
    description: "In-process transport hook ensuring API keys and prompt payloads never leave your process.",
    icon: Lock,
  },
  {
    title: "In-Process Latency Engine",
    href: "#architecture",
    description: "Sub-millisecond decisions with zero extra network hops or hosted proxy overhead.",
    icon: Gauge,
  },
  {
    title: "Multi-Tenant Control",
    href: "#primitives",
    description: "Granular rate limits and quotas isolated per customer organization or worker thread.",
    icon: Users,
  },
];

const architectureFeatures: NavItem[] = [
  {
    title: "System Benchmarks",
    href: "#benchmarks",
    description: "0.10ms p99 overhead compared to 85ms+ on centralized proxy networks.",
    icon: TrendingUp,
  },
  {
    title: "Architecture & Runtime",
    href: "#architecture",
    description: "Seamless SDK wrapper for OpenAI and Anthropic clients.",
    icon: Terminal,
  },
  {
    title: "Python SDKs",
    href: "#sdk",
    description: "Zero-dependency idiomatic packages installable in under 5 seconds.",
    icon: FileCode,
  },
];

const solutionsList: NavItem[] = [
  {
    title: "Autonomous Agent Swarms",
    href: "#primitives",
    description: "Tame recursive multi-agent loops and tool-call explosions before bills escalate.",
    icon: Bot,
  },
  {
    title: "Production RAG Pipelines",
    href: "#primitives",
    description: "Prevent vector search and context-stuffing concurrency bottlenecks.",
    icon: Layers,
  },
  {
    title: "Multi-Tenant SaaS Apps",
    href: "#architecture",
    description: "Enforce strict noisy-neighbor isolation and fair-share throughput across customers.",
    icon: Cpu,
  },
  {
    title: "Mission-Critical Chat",
    href: "#benchmarks",
    description: "Guarantee responsive streaming UI even during upstream provider partial outages.",
    icon: Sparkles,
  },
];

export default function RichNavigationMenu() {
  return (
    <NavigationMenu className="z-20">
      <NavigationMenuList className="gap-1.5">
        {/* Products Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-mono-jet text-xs font-bold tracking-wider uppercase">
            Primitives
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0 border-retro-card">
            <div className="grid w-[min(860px,calc(100vw-3rem))] grid-cols-1 md:grid-cols-3 gap-3 divide-y md:divide-y-0 md:divide-x divide-foreground/20 p-5 bg-card text-foreground max-h-[80vh] overflow-y-auto">
              <div className="col-span-1 md:col-span-2 pe-0 md:pe-3">
                <div className="flex items-center gap-2 pl-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-primary inline-block" />
                  <h6 className="font-mono-jet font-bold text-foreground text-xs uppercase tracking-wider">
                    Core Traffic Primitives
                  </h6>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {primitivesList.map((component) => (
                    <ListItem
                      href={component.href}
                      icon={component.icon}
                      key={component.title}
                      title={component.title}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>

              <div className="pt-3 md:pt-0 md:pl-4">
                <div className="flex items-center gap-2 pl-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-foreground/60 inline-block" />
                  <h6 className="font-mono-jet font-bold text-foreground text-xs uppercase tracking-wider">
                    Architecture
                  </h6>
                </div>
                <ul className="grid gap-2">
                  {architectureFeatures.map((feature) => (
                    <ListItem
                      href={feature.href}
                      icon={feature.icon}
                      key={feature.title}
                      title={feature.title}
                    >
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Solutions Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-mono-jet text-xs font-bold tracking-wider uppercase">
            Workloads
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0 border-retro-card">
            <div className="w-[min(580px,calc(100vw-3rem))] p-5 bg-card text-foreground max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 pl-2 mb-3">
                <span className="w-1.5 h-1.5 bg-primary inline-block" />
                <h6 className="font-mono-jet font-bold text-foreground text-xs uppercase tracking-wider">
                  Supported Workload Types
                </h6>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {solutionsList.map((sol) => (
                  <ListItem
                    href={sol.href}
                    icon={sol.icon}
                    key={sol.title}
                    title={sol.title}
                  >
                    {sol.description}
                  </ListItem>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Benchmarks Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#benchmarks" className="font-mono-jet text-xs font-bold tracking-wider uppercase">
              Benchmarks
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Architecture Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#architecture" className="font-mono-jet text-xs font-bold tracking-wider uppercase">
              Architecture
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: LucideIcon }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "group block select-none rounded-sm p-2.5 leading-none no-underline outline-hidden transition-colors hover:bg-muted focus:bg-muted border border-transparent hover:border-foreground/20 cursor-pointer",
            className,
          )}
          ref={ref}
          {...props}
        >
          <div className="flex items-center gap-2 font-sans font-bold text-xs tracking-tight text-foreground group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
            <span>{title}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-foreground/80 font-mono-jet text-[11px] leading-snug group-hover:text-foreground transition-colors">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
