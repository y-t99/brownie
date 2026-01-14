"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import {
  fadeInUp,
  reduceMotionVariants,
  STAGGER_DELAY,
  staggerChildren,
} from "@/lib/motion-presets";

export type HeroCta = {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: React.ComponentProps<typeof Button>["variant"];
};

export type HeroSectionProps = {
  eyebrow?: string;
  /**
   * Hero headline. Keep to 12 words max to preserve the F-pattern scan.
   */
  title: string;
  description?: string;
  ctas?: HeroCta[];
  layout?: "split" | "centered";
  visual?: React.ReactNode;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
  };
};

export function HeroSection({
  eyebrow,
  title,
  description,
  ctas = [],
  layout = "split",
  visual,
  image,
}: HeroSectionProps) {
  const reducedMotion = useReducedMotion();
  const containerVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  if (process.env.NODE_ENV !== "production") {
    const wordCount = title.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 12) {
      // eslint-disable-next-line no-console
      console.warn(
        `[HeroSection] title should be ≤ 12 words (got ${wordCount}): "${title}"`,
      );
    }
  }

  return (
    <Section
      aria-label="Hero"
      className="relative flex min-h-[90vh] flex-col justify-center py-16 md:py-24 lg:py-28 items-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: [
            "radial-gradient(900px 420px at 8% 18%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 60%)",
            "radial-gradient(760px 360px at 88% 28%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)",
          ].join(","),
        }}
      />
      <div
        className={
          layout === "centered"
            ? "mx-auto flex max-w-3xl flex-col items-center text-center"
            : "grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14"
        }
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {eyebrow ? (
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="rounded-full border border-surface-border bg-[color:color-mix(in srgb,var(--primary) 8%,transparent)] px-3 py-1 text-xs font-medium text-text-secondary">
                {eyebrow}
              </div>
            </motion.div>
          ) : null}

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-balance text-5xl font-semibold tracking-tight text-text-primary md:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          {description ? (
            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {description}
            </motion.p>
          ) : null}

          {ctas.length ? (
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
              {ctas.map(({ href, label, icon: Icon, variant }) => (
                <Button key={href} asChild variant={variant}>
                  <Link href={href}>
                    {label}
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                  </Link>
                </Button>
              ))}
            </motion.div>
          ) : null}
        </motion.div>

        {layout === "split" && (visual || image) ? (
          <motion.div
            className="relative w-full lg:self-center"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: STAGGER_DELAY * 3 }
            }
          >
            {visual ? (
              <div className="w-full">{visual}</div>
            ) : image ? (
              <div className="rounded-card border border-surface-border bg-[image:var(--ms-gradient-secondary)] p-4 shadow-[var(--ms-shadow-elevated)]">
                <div className="overflow-hidden rounded-[14px] bg-[color:color-mix(in srgb,var(--secondary) 35%,transparent)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    priority={image.priority ?? true}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </Section>
  );
}
