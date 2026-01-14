"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment, useMemo, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { COMPONENT_DOCS, DESIGN_SYSTEM_GUARDRAILS, MICRO_SKEUOMORPHISM_FORMULAS } from "@/lib/design-system-docs";
import { fadeInUp, reduceMotionVariants } from "@/lib/motion-presets";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-card border border-surface-border bg-canvas-subtle p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-text-secondary">Copy-paste</div>
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="mt-3 overflow-auto text-xs leading-relaxed text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DesignSystemPage() {
  const reducedMotion = useReducedMotion();
  const fadeVariants = useMemo(
    () => (reducedMotion ? reduceMotionVariants(fadeInUp) : fadeInUp),
    [reducedMotion],
  );

  const [buttonVariant, setButtonVariant] = useState<(typeof COMPONENT_DOCS.button.variants)[number]>(
    "default",
  );
  const [buttonSize, setButtonSize] = useState<(typeof COMPONENT_DOCS.button.sizes)[number]>(
    "default",
  );
  const [cardVariant, setCardVariant] = useState<(typeof COMPONENT_DOCS.card.variants)[number]>(
    "elevated",
  );
  const [invalidInput, setInvalidInput] = useState(false);

  return (
    <TooltipProvider>
      <PageContainer>
        <div className="py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Design System
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Shadcn/ui primitives with micro-skeuomorphic depth formulas (gradients + layered
              shadows). Use semantic tokens rather than hardcoded colors.
            </p>
          </div>

          <Tabs defaultValue="components" className="mt-10">
            <TabsList>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="motion">Motion</TabsTrigger>
              <TabsTrigger value="skeuomorphism">Skeuomorphism</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="mt-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>{COMPONENT_DOCS.button.title}</CardTitle>
                    <CardDescription>{COMPONENT_DOCS.button.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Variant</Label>
                        <Select value={buttonVariant} onValueChange={(value) => setButtonVariant(value as typeof buttonVariant)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPONENT_DOCS.button.variants.map((variant) => (
                              <SelectItem key={variant} value={variant}>
                                {variant}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select value={buttonSize} onValueChange={(value) => setButtonSize(value as typeof buttonSize)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPONENT_DOCS.button.sizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant={buttonVariant} size={buttonSize}>
                        Button
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="secondary">Hover me</Button>
                        </TooltipTrigger>
                        <TooltipContent>Tooltip content</TooltipContent>
                      </Tooltip>
                    </div>
                    <CodeBlock code={COMPONENT_DOCS.button.snippet(buttonVariant, buttonSize)} />
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>{COMPONENT_DOCS.card.title}</CardTitle>
                    <CardDescription>{COMPONENT_DOCS.card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Variant</Label>
                      <Select value={cardVariant} onValueChange={(value) => setCardVariant(value as typeof cardVariant)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPONENT_DOCS.card.variants.map((variant) => (
                            <SelectItem key={variant} value={variant}>
                              {variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Card variant={cardVariant}>
                      <CardHeader>
                        <CardTitle>Card</CardTitle>
                        <CardDescription>Micro-skeuomorphic surface example.</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-text-secondary">
                        Cards support flat, elevated, glass, and glow variants.
                      </CardContent>
                    </Card>

                    <CodeBlock code={COMPONENT_DOCS.card.snippet(cardVariant)} />
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>{COMPONENT_DOCS.input.title}</CardTitle>
                    <CardDescription>{COMPONENT_DOCS.input.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Invalid state</Label>
                      <Switch checked={invalidInput} onCheckedChange={setInvalidInput} />
                    </div>
                    <Input placeholder="Email address" aria-invalid={invalidInput} />
                    <CodeBlock code={COMPONENT_DOCS.input.snippet(invalidInput)} />
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Badges + Sheet</CardTitle>
                    <CardDescription>Quick examples for status tokens and overlays.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="pending">Pending</Badge>
                      <Badge variant="error">Error</Badge>
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="secondary">Open sheet</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Sheet title</SheetTitle>
                          <SheetDescription>
                            Overlays use the same tokens and elevation formulas.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-3 text-sm text-text-secondary">
                          {DESIGN_SYSTEM_GUARDRAILS.map((text) => (
                            <Fragment key={text}>
                              <div className="rounded-card-sm border border-surface-border bg-canvas-subtle p-3">
                                {text}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tokens" className="mt-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Micro-skeuomorphism formulas</CardTitle>
                    <CardDescription>Use CSS variables + color-mix, not hardcoded colors.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock code={MICRO_SKEUOMORPHISM_FORMULAS.gradient} />
                    <CodeBlock code={MICRO_SKEUOMORPHISM_FORMULAS.shadow} />
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Guardrails</CardTitle>
                    <CardDescription>Keep the UI consistent and maintainable.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-text-secondary">
                    <ul className="space-y-2">
                      {DESIGN_SYSTEM_GUARDRAILS.map((text) => (
                        <li key={text} className="rounded-card-sm border border-surface-border bg-canvas-subtle p-3">
                          {text}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="motion" className="mt-8">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>FadeInUp</CardTitle>
                    <CardDescription>Entrance motion with easing [0.22, 1, 0.36, 1].</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      variants={fadeVariants}
                      initial="hidden"
                      animate="show"
                      className="rounded-card border border-surface-border bg-surface p-6 text-sm text-text-secondary"
                    >
                      This block animates from y:20, opacity:0 to y:0, opacity:1 (unless reduced motion is enabled).
                    </motion.div>
                    <CodeBlock
                      code={`import { motion, useReducedMotion } from "framer-motion";\nimport { fadeInUp, reduceMotionVariants } from "@/lib/motion-presets";\n\nconst reduced = useReducedMotion();\nconst variants = reduced ? reduceMotionVariants(fadeInUp) : fadeInUp;\n\n<motion.div variants={variants} initial="hidden" animate="show" />;`}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skeuomorphism" className="mt-8">
              <div className="space-y-10">
                {/* Card Variants Section */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Card Variants</h3>
                    <p className="text-sm text-text-secondary">微拟物卡片变体：flat / elevated / elevated-hover / inset / glass / glow</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card variant="flat" className="p-4">
                      <div className="text-sm text-text-secondary">Flat - 基本平面效果</div>
                    </Card>
                    <Card variant="elevated" className="p-4">
                      <div className="text-sm text-text-secondary">Elevated - 凸起立体效果</div>
                    </Card>
                    <Card variant="elevated-hover" className="p-4">
                      <div className="text-sm text-text-secondary">Elevated Hover - 悬停增强</div>
                    </Card>
                    <Card variant="inset" className="p-4">
                      <div className="text-sm text-text-secondary">Inset - 内凹效果</div>
                    </Card>
                    <Card variant="glass" className="p-4">
                      <div className="text-sm text-text-secondary">Glass - 毛玻璃效果</div>
                    </Card>
                    <Card variant="glow" className="p-4">
                      <div className="text-sm text-text-secondary">Glow - 发光悬停</div>
                    </Card>
                  </div>
                  <div className="mt-4">
                    <CodeBlock
                      code={`<Card variant="elevated">...</Card>
<Card variant="inset">...</Card>
<Card variant="glass">...</Card>`}
                    />
                  </div>
                </section>

                {/* Input Section */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Input</h3>
                    <p className="text-sm text-text-secondary">内凹输入框：focus 时显示 ring 光环</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card variant="elevated" className="p-4 space-y-2">
                      <Label htmlFor="demo-email">Email Address</Label>
                      <Input id="demo-email" placeholder="you@example.com" />
                    </Card>
                    <Card variant="elevated" className="p-4 space-y-2">
                      <Label htmlFor="demo-invalid">Invalid State</Label>
                      <Input id="demo-invalid" placeholder="Invalid input" aria-invalid={true} />
                    </Card>
                  </div>
                  <div className="mt-4">
                    <CodeBlock code={`<Input placeholder="Email" />`} />
                  </div>
                </section>

                {/* Badge Variants Section */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Badge Variants</h3>
                    <p className="text-sm text-text-secondary">渐变徽章：primary / secondary / accent / success / error / pending / outline</p>
                  </div>
                  <Card variant="elevated" className="p-6">
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="default">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="accent">Accent</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="pending">Pending</Badge>
                      <Badge variant="error">Error</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </Card>
                  <div className="mt-4">
                    <CodeBlock code={`<Badge variant="success">Success</Badge>`} />
                  </div>
                </section>

                {/* Design Formulas Section */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Formulas</h3>
                    <p className="text-sm text-text-secondary">核心设计公式：渐变 + 阴影</p>
                  </div>
                  <Card variant="elevated" className="p-6 space-y-6">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-text-primary">三段式渐变</h4>
                      <CodeBlock
                        code={`background: linear-gradient(
  135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
);`}
                      />
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-text-primary">三层立体阴影</h4>
                      <CodeBlock
                        code={`box-shadow:
  0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.2),
  inset 0 -1px 0 rgba(0,0,0,0.1);`}
                      />
                    </div>
                  </Card>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </TooltipProvider>
  );
}
