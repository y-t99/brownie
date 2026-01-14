"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

export type FinalCtaProps = {
  title: string;
  description?: string;
  cta: {
    href: string;
    label: string;
  };
  texture?: boolean;
};

export function FinalCta({ title, description, cta, texture = true }: FinalCtaProps) {
  return (
    <Section aria-label="Final Call To Action" className="flex flex-col items-center">
      <div
        className={cn(
          "relative overflow-hidden rounded-card-xl border border-surface-border bg-surface p-10 shadow-[var(--ms-shadow-elevated)] md:p-14",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: [
              "radial-gradient(900px 420px at 15% 20%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 60%)",
              "radial-gradient(800px 380px at 80% 25%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%)",
              "radial-gradient(900px 520px at 60% 90%, color-mix(in srgb, var(--secondary) 16%, transparent), transparent 60%)",
            ].join(","),
          }}
        />

        {texture ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(2px 2px at 15% 25%, rgb(var(--foreground) / 0.35), transparent 60%), radial-gradient(2px 2px at 65% 35%, rgb(var(--foreground) / 0.25), transparent 60%), radial-gradient(2px 2px at 80% 75%, rgb(var(--foreground) / 0.3), transparent 60%)",
            }}
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[color:color-mix(in srgb,var(--primary) 22%,transparent)] blur-2xl animate-float"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
              {description}
            </p>
          ) : null}

          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
