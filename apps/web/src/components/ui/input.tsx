import * as React from "react";

import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-card-sm bg-surface px-3 py-2 text-sm text-text-primary shadow-[var(--ms-shadow-inset)] ring-1 ring-[color:color-mix(in srgb,var(--border) 45%,transparent)] transition-shadow duration-200 ease-out placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-status-error-bg",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
