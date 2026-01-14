"use client";

import { AlertCircle, ArrowRight, Gauge, Layers, Sparkles, TriangleAlert, X } from "lucide-react";

import { FeaturesGrid } from "@/components/landing/features-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroConsolePreview } from "@/components/landing/hero-console-preview";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LogoBar, LogoPill } from "@/components/landing/logo-bar";
import { PricingCards } from "@/components/landing/pricing-cards";
import { ProblemSection } from "@/components/landing/problem-section";
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel";
import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <HeroSection
        eyebrow="Micro-skeuomorphic design system"
        title="Build and operate durable tasks with a premium developer experience."
        description="Brownie brings reliability primitives and simple observability together—without sacrificing speed."
        layout="split"
        visual={<HeroConsolePreview />}
        ctas={[
          { href: "/console", label: "Open Console", icon: ArrowRight, variant: "default" },
          { href: "/design-system", label: "View Design System", variant: "secondary" },
        ]}
      />

      <Section aria-label="Logo Bar" className="border-y border-surface-border bg-canvas flex flex-col items-center justify-center">
        <PageContainer>
          <div className="py-12 flex flex-col items-center justify-center">
            <LogoBar>
              {["Turborepo", "Next.js", "Radix UI", "Tailwind", "Framer Motion"].map((label) => (
                <LogoPill key={label}>{label}</LogoPill>
              ))}
            </LogoBar>
          </div>
        </PageContainer>
      </Section>

      <ProblemSection
        title="The problems that slow teams down"
        description="Shipping durable systems takes more than code—it takes clarity, feedback, and interfaces that guide the next step."
        problems={[
          {
            title: "Retries become guesswork",
            description: "Without clear state and observability, failures turn into trial-and-error firefights.",
            icon: AlertCircle,
          },
          {
            title: "Dashboards feel like chores",
            description: "When UI is flat and inconsistent, it takes longer to find what matters and act on it.",
            icon: TriangleAlert,
          },
          {
            title: "Design drift steals time",
            description: "If every page invents new spacing and motion, teams lose days to bikeshedding.",
            icon: X,
          },
        ]}
      />

      <FeaturesGrid
        title="Everything you need to ship and maintain"
        description="Component-first UI, motion presets, and a theme system built on semantic tokens."
        layout="bento"
        features={[
          {
            title: "Durable execution",
            description: "Predictable retries, tracing, and clear task state across services.",
            icon: Layers,
          },
          {
            title: "Console visibility",
            description: "Understand cost, latency, and throughput with status-first surfaces.",
            icon: Gauge,
          },
          {
            title: "Micro-skeuomorphism",
            description: "Subtle gradients, layered shadows, and tactile interactions—no hardcoded colors.",
            icon: Sparkles,
          },
        ]}
      />

      <HowItWorks
        title="How it works"
        description="A simple flow that keeps you moving from idea to production without losing visibility."
        steps={[
          {
            title: "Model the work",
            description: "Define tasks and retries with clear semantics and safety rails.",
          },
          {
            title: "Observe in one place",
            description: "Track throughput, cost, and status from surfaces built on semantic tokens.",
          },
          {
            title: "Ship with confidence",
            description: "Apply micro-skeuomorphic UI patterns that keep quality consistent across pages.",
          },
        ]}
      />

      <PricingCards
        title="Pricing that scales with your workload"
        description="A simple starter plan, a recommended team tier, and an enterprise path when you need it."
        plans={[
          {
            name: "Starter",
            price: "$0",
            description: "For prototypes and local development.",
            bullets: ["Local-first setup", "Durable primitives", "Design system included"],
            ctaLabel: "Get started",
            ctaHref: "/console",
          },
          {
            name: "Team",
            price: "$49",
            description: "For production workloads and shared consoles.",
            bullets: ["Usage dashboards", "Role-based access", "Priority support"],
            ctaLabel: "Open console",
            ctaHref: "/console",
            recommended: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            description: "For regulated or high-scale deployments.",
            bullets: ["SLA + SSO", "Custom retention", "Migration assistance"],
            ctaLabel: "Contact us",
            ctaHref: "/design-system",
          },
        ]}
      />

      <TestimonialCarousel
        title="Loved by engineers who ship"
        description="A small set of testimonials showcasing the micro-skeuomorphic UI and motion patterns."
        testimonials={[
          {
            name: "Ava Patel",
            title: "Staff Engineer",
            quote:
              "The micro-skeuomorphic surfaces feel premium without getting in the way—everything stays readable and fast.",
          },
          {
            name: "Jordan Kim",
            title: "Platform Lead",
            quote:
              "The component-first mandate saves hours. No one bikesheds colors or spacing anymore; the tokens do the work.",
          },
          {
            name: "Mina Alvarez",
            title: "Full-stack Developer",
            quote:
              "Motion presets make the landing page feel alive, and reduced-motion users still get clean final states.",
          },
        ]}
      />

      <FinalCta
        title="Ready to ship the premium path?"
        description="Bring durable execution, consistent UI, and measurable motion patterns into one workflow."
        cta={{ href: "/console", label: "Open Console" }}
      />
    </>
  );
}
