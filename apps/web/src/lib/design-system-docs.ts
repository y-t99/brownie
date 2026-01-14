export const DESIGN_SYSTEM_GUARDRAILS = [
  "Use `@/components/ui` primitives before inventing new ones.",
  "Do not use hardcoded colors (no `bg-[#123456]`, `text-[rgb(...)]`).",
  "Prefer CSS variables + `color-mix()` for depth effects.",
  "Use motion presets and honor reduced motion.",
] as const;

export const MICRO_SKEUOMORPHISM_FORMULAS = {
  gradient: `background: linear-gradient(
  135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
);`,
  shadow: `box-shadow:
  0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), /* outer glow */
  inset 0 1px 0 rgba(255,255,255,0.2),                             /* top highlight */
  inset 0 -1px 0 rgba(0,0,0,0.1);                                  /* bottom edge */`,
} as const;

export const COMPONENT_DOCS = {
  button: {
    title: "Button",
    description: "Micro-skeuomorphic gradients + layered shadows with tactile hover scaling.",
    variants: ["default", "outline", "secondary", "ghost", "link", "destructive"] as const,
    sizes: ["default", "sm", "icon"] as const,
    snippet: (variant: string, size: string) =>
      `<Button variant="${variant}" size="${size}">Button</Button>`,
  },
  card: {
    title: "Card",
    description: "Multiple micro-skeuomorphic variants: flat, elevated, elevated-hover, inset, glass, glow.",
    variants: ["flat", "elevated", "elevated-hover", "inset", "glass", "glow"] as const,
    snippet: (variant: string) =>
      `<Card variant="${variant}">\n  <CardHeader>\n    <CardTitle>Card</CardTitle>\n    <CardDescription>Description</CardDescription>\n  </CardHeader>\n  <CardContent>...</CardContent>\n</Card>`,
  },
  input: {
    title: "Input",
    description: "Inset depth styling with smooth transitions and accessible invalid states.",
    snippet: (invalid: boolean) =>
      `<Input placeholder="Email" aria-invalid={${invalid}} />`,
  },
  badge: {
    title: "Badge",
    description: "Gradient badges with micro-skeuomorphic shadows: primary, secondary, accent, success, error, pending, outline.",
    variants: ["default", "secondary", "accent", "success", "error", "pending", "outline"] as const,
    snippet: (variant: string) =>
      `<Badge variant="${variant}">Badge</Badge>`,
  },
} as const;
