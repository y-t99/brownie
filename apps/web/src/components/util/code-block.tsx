import { cn } from "@/lib/cn";

export function CodeBlock({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-2xl border border-surface-border bg-canvas-subtle/50 p-4 font-mono text-xs text-text-primary",
        className,
      )}
    >
      <code>{value}</code>
    </pre>
  );
}

