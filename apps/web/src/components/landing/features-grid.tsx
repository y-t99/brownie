"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { fadeInUp, reduceMotionVariants, staggerChildren } from "@/lib/motion-presets";

export type Feature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export type FeaturesGridProps = {
  title?: string;
  description?: string;
  features: Feature[];
  layout?: "grid" | "bento";
};

export function FeaturesGrid({ title, description, features, layout = "grid" }: FeaturesGridProps) {
  const reducedMotion = useReducedMotion();
  const parentVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  function getBentoSpanClass(index: number, count: number) {
    if (count <= 1) return "md:col-span-6";
    if (count === 2) return "md:col-span-3";
    if (count === 3) return index === 2 ? "md:col-span-6" : "md:col-span-3";
    if (count === 4) return "md:col-span-3";
    return index === 0 ? "md:col-span-4" : index === 1 ? "md:col-span-2" : "md:col-span-3";
  }

  return (
    <Section aria-label="Features" className="flex flex-col items-center">
      <div className="mx-auto max-w-3xl text-center">
        {title ? (
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <motion.div
        variants={parentVariants}
        initial="hidden"
        animate="show"
        className={cn(
          "mt-12 w-full grid gap-6",
          layout === "bento"
            ? "grid-cols-1 md:grid-cols-6"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const spanClass =
            layout === "bento"
              ? getBentoSpanClass(index, features.length)
              : undefined;
          return (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={cn("h-full", spanClass)}
            >
              <Card
                variant="elevated"
                className={cn(
                  "h-full overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] hover:shadow-[var(--ms-shadow-elevated-hover)]",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-card-sm bg-[color:color-mix(in srgb,var(--primary) 10%,transparent)] text-[color:var(--primary)]">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <div className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
