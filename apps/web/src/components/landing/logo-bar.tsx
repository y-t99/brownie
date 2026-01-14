import * as React from "react";

import { cn } from "@/lib/cn";

export function LogoBar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 items-center justify-items-center gap-8 text-sm text-text-secondary md:grid-cols-4 md:gap-12 lg:grid-cols-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LogoPill({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-full border border-surface-border bg-surface px-4 py-2 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100",
        className,
      )}
      {...props}
    />
  );
}
