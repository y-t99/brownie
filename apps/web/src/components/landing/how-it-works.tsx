"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { fadeInUp, reduceMotionVariants, staggerChildren } from "@/lib/motion-presets";

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type HowItWorksProps = {
  title?: string;
  description?: string;
  steps: HowItWorksStep[];
};

export function HowItWorks({ title, description, steps }: HowItWorksProps) {
  const reducedMotion = useReducedMotion();
  const parentVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  return (
    <Section aria-label="How It Works" className="flex flex-col items-center">
      <div className="mx-auto max-w-3xl text-center flex flex-col items-center justify-center">
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
        className="relative mt-12"
      >
        <div className="pointer-events-none absolute left-12 right-12 top-6 hidden h-px bg-gradient-to-r from-primary via-primary to-transparent opacity-20 md:block" />
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={itemVariants} className="relative">
              <div className="flex flex-col gap-4">
                <div className="relative flex items-center justify-center gap-4 md:flex-col md:items-center md:gap-3">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--ms-shadow-elevated)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col items-center justify-center">
                    <div className="text-base font-semibold text-text-primary">{step.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-text-secondary text-center">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
