"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CodeBlock } from "@/components/util/code-block";
import { CopyButton } from "@/components/util/copy-button";
import { StatusIndicator, TaskStatus } from "@/components/util/status-indicator";
import { cn } from "@/lib/cn";

type Transaction = {
  id: string;
  status: TaskStatus;
  model: string;
  costYuan: number;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

function formatYuan(amount: number) {
  return `¥${amount.toFixed(2)}`;
}

function relativeTime(iso: string) {
  const deltaMs = Date.now() - new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor(deltaMs / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimestampMs(iso: string) {
  const d = new Date(iso);
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function badgeVariantForStatus(status: TaskStatus) {
  if (status === "succeeded") return "success";
  if (status === "failed") return "error";
  return "pending";
}

function shortId(id: string) {
  return id.slice(-8);
}

function generateMockTransactions(): Transaction[] {
  const now = Date.now();
  const hourMs = 60 * 60_000;
  return [
    {
      id: "b7b8fbcc-8e4b-4e1c-8c1e-6f7b1a9a2c31",
      status: "succeeded",
      model: "gemini-2.0-flash-image",
      costYuan: 0.42,
      createdAt: new Date(now - 12_000).toISOString(),
      updatedAt: new Date(now - 10_250).toISOString(),
      payload: {
        prompt: "Zen minimalist poster, high contrast, typographic",
        size: "1024x1024",
      },
    },
    {
      id: "0c4c1f1b-0f71-4ef8-9d0e-2e5a01b0d2b9",
      status: "pending",
      model: "gemini-2.0-flash-image",
      costYuan: 0,
      createdAt: new Date(now - 2 * 60_000).toISOString(),
      updatedAt: new Date(now - 40_000).toISOString(),
      payload: {
        prompt: "Isometric kawaii brownie mascot, soft lighting",
        size: "1024x1024",
      },
    },
    {
      id: "d4d733b5-20c3-48f2-a267-8e2a0e2a4c12",
      status: "failed",
      model: "gemini-2.0-flash-image",
      costYuan: 0,
      createdAt: new Date(now - 4 * hourMs).toISOString(),
      updatedAt: new Date(now - 4 * hourMs + 2500).toISOString(),
      payload: {
        prompt: "Photoreal macro shot, extreme detail, shallow depth of field",
        size: "1024x1024",
        seed: 1337,
      },
    },
    {
      id: "9b5c4f87-3f5a-4b6e-a9e7-0f5dbd8d3d77",
      status: "succeeded",
      model: "gemini-2.0-flash-image",
      costYuan: 1.23,
      createdAt: new Date(now - 2 * 24 * hourMs).toISOString(),
      updatedAt: new Date(now - 2 * 24 * hourMs + 12_500).toISOString(),
      payload: {
        prompt: "Studio product photo, brownie dessert, clean white backdrop",
        size: "2048x2048",
      },
    },
  ];
}

export function TransactionsTable() {
  const transactions = useMemo(() => generateMockTransactions(), []);
  const [selectedId, setSelectedId] = useState(transactions[0]?.id ?? null);
  const selected = transactions.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="rounded-2xl border border-surface-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Status</TableHead>
            <TableHead className="w-[180px]">Task ID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="w-[140px]">Cost</TableHead>
            <TableHead className="w-[140px]">Time</TableHead>
            <TableHead className="w-[120px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <StatusIndicator status={t.status} />
              </TableCell>
              <TableCell className="font-mono text-sm text-text-primary">
                {shortId(t.id)}
              </TableCell>
              <TableCell className="text-sm text-text-primary">
                {t.model}
              </TableCell>
              <TableCell
                className={cn(
                  "font-mono text-sm",
                  t.status === "failed"
                    ? "text-text-secondary line-through"
                    : "text-text-primary",
                )}
              >
                {t.status === "failed" ? "¥0.00" : formatYuan(t.costYuan)}
              </TableCell>
              <TableCell className="text-sm text-text-secondary">
                {relativeTime(t.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedId(t.id)}
                    >
                      Inspect
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    {selected ? (
                      <div className="space-y-6">
                        <SheetHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <SheetTitle className="font-mono text-base">
                                {selected.id}
                              </SheetTitle>
                              <SheetDescription>
                                Task detail (mocked)
                              </SheetDescription>
                            </div>
                            <Badge variant={badgeVariantForStatus(selected.status)}>
                              {selected.status}
                            </Badge>
                          </div>
                        </SheetHeader>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-text-primary">
                              Task ID
                            </div>
                            <CopyButton value={selected.id} label="Copy" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-xs text-text-secondary">
                                Created
                              </div>
                              <div className="font-mono text-xs text-text-primary">
                                {formatTimestampMs(selected.createdAt)}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-text-secondary">
                                Updated
                              </div>
                              <div className="font-mono text-xs text-text-primary">
                                {formatTimestampMs(selected.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-text-primary">
                            Payload
                          </div>
                          <CodeBlock
                            value={JSON.stringify(selected.payload, null, 2)}
                          />
                        </div>

                        <div className="flex justify-end">
                          <SheetClose asChild>
                            <Button type="button" variant="ghost" size="sm">
                              Close
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    ) : null}
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
