"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const CARD_STYLES = {
  flat: {},
  elevated: {
    boxShadow: "var(--ms-shadow-elevated)",
    background: "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 98%, black) 100%)",
  },
  "elevated-hover": {
    default: {
      boxShadow: "var(--ms-shadow-elevated)",
      background: "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 98%, black) 100%)",
    },
    hover: {
      boxShadow: "var(--ms-shadow-elevated-hover)",
    },
  },
  inset: {
    boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.08)",
    background: "color-mix(in srgb, var(--card) 96%, black)",
  },
  glass: {
    border: "1px solid color-mix(in srgb, var(--border) 45%, transparent)",
    background: "color-mix(in srgb, var(--card) 85%, transparent)",
  },
  glow: {
    default: {
      boxShadow: "var(--ms-shadow-elevated)",
      background: "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 98%, black) 100%)",
    },
    hover: {
      boxShadow: "var(--ms-shadow-glow)",
    },
  },
} as const;

const cardVariants = cva("rounded-card border border-surface-border bg-surface transition-all duration-300 ease-[var(--ms-ease-out-expo)]", {
  variants: {
    variant: {
      flat: "",
      elevated: "",
      "elevated-hover": "",
      inset: "",
      glass: "backdrop-blur-md",
      glow: "hover:scale-[1.02]",
    },
  },
  defaultVariants: {
    variant: "flat",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, style, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const styleConfig = variant && variant !== "flat" ? CARD_STYLES[variant] : null;
    const needsHoverState = variant === "elevated-hover" || variant === "glow";

    let combinedStyle = style;
    if (styleConfig) {
      if (needsHoverState && "default" in styleConfig) {
        combinedStyle = {
          ...styleConfig.default,
          ...(isHovered && "hover" in styleConfig ? styleConfig.hover : {}),
          ...style,
        };
      } else {
        combinedStyle = {
          ...styleConfig,
          ...style,
        };
      }
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        style={combinedStyle}
        onMouseEnter={needsHoverState ? (e) => { setIsHovered(true); props.onMouseEnter?.(e); } : props.onMouseEnter}
        onMouseLeave={needsHoverState ? (e) => { setIsHovered(false); props.onMouseLeave?.(e); } : props.onMouseLeave}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-semibold leading-none", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-text-secondary", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center px-6 pb-6", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
