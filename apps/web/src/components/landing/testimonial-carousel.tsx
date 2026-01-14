"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { fadeInUp, reduceMotionVariants, staggerChildren } from "@/lib/motion-presets";

export type Testimonial = {
  name: string;
  title?: string;
  quote: string;
  avatarSrc?: string;
};

export type TestimonialCarouselProps = {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
};

export function TestimonialCarousel({
  title,
  description,
  testimonials,
}: TestimonialCarouselProps) {
  const reducedMotion = useReducedMotion();
  const parentVariants = reducedMotion ? reduceMotionVariants(staggerChildren) : staggerChildren;
  const itemVariants = reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp;

  return (
    <Section aria-label="Testimonials" className="flex flex-col items-center">
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
        className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.name} variants={itemVariants}>
            <Card
              variant="glass"
              className={cn(
                "relative overflow-hidden transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--ms-shadow-elevated-hover)]",
              )}
            >
              <div className="pointer-events-none absolute right-6 top-6 text-6xl leading-none text-[color:color-mix(in srgb,var(--primary) 18%,transparent)]">
                “
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-surface-border bg-canvas-subtle">
                    {testimonial.avatarSrc ? (
                      <Image
                        src={testimonial.avatarSrc}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text-primary">
                      {testimonial.name}
                    </div>
                    {testimonial.title ? (
                      <div className="truncate text-sm text-text-secondary">{testimonial.title}</div>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-text-secondary">{testimonial.quote}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
