"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const focusedStyle = isFocused
      ? {
          boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 2px var(--ring)",
        }
      : {
          boxShadow: "var(--ms-shadow-inset)",
        };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-card-sm px-3 py-2 text-sm text-text-primary ring-1 ring-[color:color-mix(in srgb,var(--border) 45%,transparent)] transition-all duration-200 ease-[var(--ms-ease-out-expo)] placeholder:text-text-secondary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-status-error-bg",
          className,
        )}
        style={{
          background: "color-mix(in srgb, var(--card) 96%, black)",
          ...focusedStyle,
        }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
