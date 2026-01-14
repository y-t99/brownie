"use client";

import { Activity, ArrowUpRight, Clock, DatabaseZap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Stat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STATS: Stat[] = [
  { label: "Throughput", value: "1.2k/min", icon: Activity },
  { label: "Latency", value: "180ms", icon: Clock },
  { label: "Cost", value: "$42/day", icon: DatabaseZap },
] as const;

export function HeroConsolePreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-card border border-surface-border bg-surface/70 p-4 shadow-[var(--ms-shadow-elevated)] backdrop-blur-md",
        className,
      )}
    >
      <div className="rounded-card-sm border border-surface-border bg-[color:color-mix(in srgb,var(--card) 88%,transparent)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight text-text-primary">Console</div>
            <div className="mt-1 text-xs text-text-secondary">Transactions overview</div>
          </div>
          <Badge size="sm">Live</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                variant="glow"
                className="border-[color:color-mix(in srgb,var(--border) 55%,transparent)] bg-[color:color-mix(in srgb,var(--surface) 88%,transparent)]"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
                    <Icon className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-semibold tracking-tight text-text-primary">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-card-sm border border-surface-border">
          <div className="grid grid-cols-12 gap-0 bg-[color:color-mix(in srgb,var(--primary) 7%,transparent)] px-3 py-2 text-xs font-medium text-text-secondary">
            <div className="col-span-6">Task</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Duration</div>
          </div>
          {[
            { name: "sync-invoices", status: "success", duration: "312ms" },
            { name: "rebuild-index", status: "pending", duration: "1.8s" },
            { name: "send-webhooks", status: "error", duration: "—" },
          ].map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-12 items-center gap-0 border-t border-surface-border bg-surface px-3 py-2 text-xs"
            >
              <div className="col-span-6 truncate text-text-primary">{row.name}</div>
              <div className="col-span-3">
                <Badge size="sm" variant={row.status as "success" | "pending" | "error"}>
                  {row.status}
                </Badge>
              </div>
              <div className="col-span-3 text-right text-text-secondary">{row.duration}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline">
            Open Console <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
