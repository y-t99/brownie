"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { fadeInUp, reduceMotionVariants, staggerChildren } from "@/lib/motion-presets";

export type ProblemItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export type ProblemSectionProps = {
  title?: string;
  description?: string;
  problems: ProblemItem[];
};

export function ProblemSection({ title, description, problems }: ProblemSectionProps) {
  const reducedMotion = useReducedMotion();
  const parentVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  return (
    <Section aria-label="Problem" className="flex flex-col items-center">
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
        className={cn("mt-12 grid gap-4", problems.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3")}
      >
        {problems.map((problem) => {
          const Icon = problem.icon ?? AlertCircle;
          return (
            <motion.div key={problem.title} variants={itemVariants} className="h-full">
              <Card
                variant="elevated"
                className={cn(
                  "h-full transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] hover:shadow-[var(--ms-shadow-elevated-hover)]",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-card-sm bg-[color:color-mix(in srgb,var(--destructive) 12%,transparent)] text-destructive">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{problem.title}</CardTitle>
                      <div className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {problem.description}
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
