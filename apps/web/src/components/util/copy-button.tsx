"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Tooltip open={copied} onOpenChange={(open) => setCopied(open)}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copy}
          aria-label="Copy to clipboard"
        >
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Copied</TooltipContent>
    </Tooltip>
  );
}

