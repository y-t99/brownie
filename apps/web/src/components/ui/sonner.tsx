"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-surface-border bg-surface text-text-primary shadow-lg",
          title: "text-sm font-medium",
          description: "text-sm text-text-secondary",
          actionButton: "bg-text-primary text-canvas",
          cancelButton: "bg-canvas-subtle text-text-primary",
        },
      }}
      {...props}
    />
  );
}

