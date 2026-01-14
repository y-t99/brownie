import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-[12px] font-medium shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--ms-gradient-primary)] text-[color:var(--primary-foreground)]",
        success: "bg-status-success-bg text-status-success-text",
        error: "bg-status-error-bg text-status-error-text",
        pending: "bg-status-pending-bg text-status-pending-text",
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

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}
