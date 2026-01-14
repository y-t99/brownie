import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const BADGE_STYLES = {
  default: {
    background: "var(--ms-gradient-primary)",
    boxShadow: "0 2px 6px color-mix(in srgb, var(--primary) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  secondary: {
    background: "var(--ms-gradient-secondary)",
    boxShadow: "0 2px 6px color-mix(in srgb, var(--secondary) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  accent: {
    background: "var(--ms-gradient-accent)",
    boxShadow: "0 2px 6px color-mix(in srgb, var(--accent) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  success: {
    background: "linear-gradient(135deg, rgb(var(--status-success-bg)) 0%, color-mix(in srgb, rgb(var(--status-success-bg)) 85%, black) 100%)",
    boxShadow: "0 2px 6px color-mix(in srgb, rgb(var(--status-success-bg)) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  error: {
    background: "linear-gradient(135deg, rgb(var(--status-error-bg)) 0%, color-mix(in srgb, rgb(var(--status-error-bg)) 85%, black) 100%)",
    boxShadow: "0 2px 6px color-mix(in srgb, rgb(var(--status-error-bg)) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  pending: {
    background: "linear-gradient(135deg, rgb(var(--status-pending-bg)) 0%, color-mix(in srgb, rgb(var(--status-pending-bg)) 85%, black) 100%)",
    boxShadow: "0 2px 6px color-mix(in srgb, rgb(var(--status-pending-bg)) 25%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },
  outline: {},
} as const;

const badgeVariants = cva(
  "inline-flex items-center rounded-[12px] font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-[color:var(--primary-foreground)]",
        secondary: "text-[color:var(--secondary-foreground)]",
        accent: "text-[color:var(--accent-foreground)]",
        success: "text-status-success-text",
        error: "text-status-error-text",
        pending: "text-status-pending-text",
        outline: "border border-border bg-transparent text-text-primary",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant = "default", size, style, ...props }: BadgeProps) {
  const styleConfig = variant && variant !== "outline" ? BADGE_STYLES[variant] : undefined;

  return (
    <div
      className={cn(badgeVariants({ variant, size, className }))}
      style={styleConfig ? { ...styleConfig, ...style } : style}
      {...props}
    />
  );
}
