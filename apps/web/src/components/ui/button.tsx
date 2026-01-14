import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[transform,box-shadow,background-color,background-image] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in srgb,var(--primary) 35%,transparent)] disabled:pointer-events-none disabled:opacity-60 hover:scale-[1.02] active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--ms-gradient-primary)] text-[color:var(--primary-foreground)] shadow-[var(--ms-shadow-elevated)] hover:shadow-[var(--ms-shadow-elevated-hover)]",
        outline:
          "border border-[color:color-mix(in srgb,var(--primary) 35%,transparent)] bg-transparent text-[color:var(--primary)] hover:bg-[color:color-mix(in srgb,var(--primary) 12%,transparent)]",
        secondary:
          "bg-[color:color-mix(in srgb,var(--secondary) 65%,transparent)] text-text-primary shadow-sm hover:bg-[color:color-mix(in srgb,var(--secondary) 55%,transparent)]",
        ghost:
          "bg-transparent text-[color:var(--primary)] hover:bg-[color:color-mix(in srgb,var(--primary) 10%,transparent)]",
        link:
          "bg-transparent text-[color:var(--primary)] underline-offset-4 hover:underline shadow-none hover:shadow-none hover:scale-100 active:scale-100",
        destructive:
          "bg-status-error-bg text-status-error-text shadow-sm hover:bg-status-error-bg/90",
      },
      size: {
        default: "h-11 rounded-card px-4",
        sm: "h-9 rounded-card-sm px-3",
        icon: "h-11 w-11 rounded-card",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
