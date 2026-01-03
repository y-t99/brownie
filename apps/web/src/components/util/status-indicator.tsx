import { cn } from "@/lib/cn";

export type TaskStatus = "succeeded" | "failed" | "pending";

const STATUS_STYLES: Record<TaskStatus, { dot: string; text: string; label: string }> = {
  succeeded: {
    dot: "bg-status-success-text",
    text: "text-status-success-text",
    label: "Succeeded",
  },
  failed: {
    dot: "bg-status-error-text",
    text: "text-status-error-text",
    label: "Failed",
  },
  pending: {
    dot: "bg-status-pending-text",
    text: "text-status-pending-text",
    label: "Pending",
  },
};

export function StatusIndicator({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const styles = STATUS_STYLES[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("h-2.5 w-2.5 rounded-full", styles.dot)} />
      <span className={cn("text-sm font-medium", styles.text)}>{styles.label}</span>
    </div>
  );
}

