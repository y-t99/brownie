"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { fadeInUp, reduceMotionVariants, staggerChildren } from "@/lib/motion-presets";

export type PricingPlan = {
  name: string;
  price: string;
  description?: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  recommended?: boolean;
};

export type PricingCardsProps = {
  title?: string;
  description?: string;
  plans: PricingPlan[];
};

export function PricingCards({ title, description, plans }: PricingCardsProps) {
  const reducedMotion = useReducedMotion();
  const parentVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  return (
    <Section aria-label="Pricing" className="flex flex-col items-center">
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
        className="mt-12 w-full grid gap-8 md:grid-cols-3 items-stretch"
      >
        {plans.map((plan) => (
          <motion.div key={plan.name} variants={itemVariants} className="h-full">
            <Card
              variant="elevated"
              className={cn(
                "relative h-full overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 ease-out",
                plan.recommended &&
                  "scale-105 shadow-xl ring-2 ring-primary z-10",
              )}
            >
              {plan.recommended ? (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Badge size="sm">Most Popular</Badge>
                </div>
              ) : null}

              <CardHeader className={cn("pb-3", plan.recommended && "pt-6")}>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
                  {plan.price}
                </div>
                {plan.description ? (
                  <div className="mt-2 text-sm text-text-secondary">{plan.description}</div>
                ) : null}
              </CardHeader>

              <CardContent className={cn("flex flex-col flex-1", plan.recommended && "space-y-5")}>
                <ul className="space-y-2 text-sm text-text-secondary flex-1">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-[color:var(--primary)]" />
                      <span className="min-w-0">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.recommended ? "default" : "outline"}>
                  <a href={plan.ctaHref}>{plan.ctaLabel}</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
