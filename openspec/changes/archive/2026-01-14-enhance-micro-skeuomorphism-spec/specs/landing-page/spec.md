# Landing Page Architecture Specification

## ADDED Requirements

### Requirement: Hero Section Standard

The Hero Section MUST be the primary visual entry point of the landing page.

**Layout Requirements:**
- Height: `min-h-screen` or `min-h-[90vh]`
- Layout pattern: F-pattern (left text, right visual) or Z-pattern (centered)
- Maximum title length: 12 words

**Visual Structure:**
```
+--------------------------------------------------+
|  [H1 Title - max 12 words]                       |
|  [Subtitle - 2-3 lines, value proposition]       |
|  [CTA Button - high contrast]                    |
|                                                  |
|  [Visual: 3D/Video/Demo - priority loading]      |
+--------------------------------------------------+
```

**Performance Requirements:**
- Hero image must have `priority` loading attribute
- LCP target: <2.5 seconds
- Use `next/image` component with `priority={true}`

**Animation Requirements:**
- Elements fade in sequentially (title → subtitle → CTA → visual)
- Total entrance duration: 600ms
- Stagger delay: 0.1s between elements

#### Scenario: Implementing a hero section
Given a landing page that needs a hero section,
When implementing the component,
Then it should use `min-h-[90vh]`, have a 12-word max title, and set `priority={true}` on the main image.

#### Scenario: Hero section fails performance check
Given a hero section without priority loading,
When the page is analyzed with Lighthouse,
Then LCP should fail the audit (<2.5s target).

### Requirement: Logo Bar Standard

The Logo Bar MUST display partner/client logos as social proof.

**Styling Requirements:**
- Default state: `grayscale opacity-60`
- Hover state: `grayscale-0 opacity-100` (full color)
- Transition: 300ms ease-out

**Layout Requirements:**
- Responsive grid: `grid-cols-2 md:grid-cols-4 lg:grid-cols-6`
- Gap: `gap-8` or `gap-12`
- Vertical padding: `py-8`

**Implementation:**
```tsx
<div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
  <Logo />
</div>
```

#### Scenario: Styling a partner logo
Given a partner logo in the logo bar,
When implementing the visual style,
Then it should be grayscale at 60% opacity by default and restore full color on hover.

#### Scenario: Logo bar fails visual check
Given a logo bar with full-color logos,
When the design is reviewed,
Then it should be flagged for not meeting logo bar grayscale standard.

### Requirement: Problem Section Standard

The Problem Section MUST highlight user pain points to create urgency.

**Visual Requirements:**
- Icon style: Destructive color (red) icons
- Icon examples: `X`, `AlertCircle`, `TriangleAlert`
- Animation: Fade-up when entering viewport

**Content Structure:**
- Problem statement: Clear, empathetic description
- Impact: Quantified or emotional consequence
- Transition: Subtle fade to solution

**Animation:**
```ts
const problemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO }
  }
};
```

#### Scenario: Implementing a problem section
Given a problem section highlighting user pain points,
When implementing the visual style,
Then it should use destructive color icons with fade-up animations.

### Requirement: Features Section Standard

The Features Section MUST display product capabilities in a grid layout.

**Layout Options:**
1. **Bento Grid**: Irregular grid cells of varying sizes
2. **3-Column Grid**: Equal-width columns (`grid-cols-1 md:grid-cols-3`)

**Card Requirements:**
- Border-radius: `rounded-card` (20px)
- Hover effect: `hover:shadow-lg + scale-[1.02]`
- Icon size: 40-48px
- Icon color: `--primary` color

**Spacing:**
- Section padding: `py-20 md:py-28 lg:py-32`
- Grid gap: `gap-6` or `gap-8`
- Card padding: `p-6` or `p-8`

#### Scenario: Implementing a features grid
Given a features section with 6 product capabilities,
When implementing the grid layout,
Then it should use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `hover:shadow-lg` cards.

#### Scenario: Bento grid feature layout
Given a features section that needs irregular cell sizes,
When implementing the layout,
Then it should use `col-span-2` or `row-span-2` classes for prominent features.

### Requirement: How It Works Section Standard

The How It Works Section MUST explain the user flow or process.

**Visual Elements:**
- Step indicators: Numbered circular badges (1, 2, 3...)
- Connection lines: Dotted or gradient line between steps
- Content: Title + description for each step

**Animation Options:**
1. **Path Drawing**: SVG path animates along with content reveal
2. **Sequential Reveal**: Steps fade in one at a time

**Implementation:**
```tsx
<div className="relative">
  {/* Connection line */}
  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />

  {/* Step indicator */}
  <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center z-10">
    1
  </div>
</div>
```

#### Scenario: Implementing a how-it-works section
Given a 3-step process explanation,
When implementing the visual layout,
Then it should use numbered badges with connecting lines and sequential reveal animations.

### Requirement: Pricing Section Standard

The Pricing Section MUST display pricing plans with a highlighted recommendation.

**Layout Requirements:**
- Grid layout: `grid-cols-1 md:grid-cols-3`
- Recommended plan: `scale-105` and `ring-2 ring-primary`

**Highlighted Plan Requirements:**
- Scale: `scale-105` (5% larger)
- Ring: `ring-2 ring-primary`
- Badge: "Most Popular" badge at top
- Shadow: Enhanced `shadow-xl`

**Content Structure:**
- Plan name
- Price (large font)
- Feature list with checkmarks
- CTA button

#### Scenario: Implementing pricing cards
Given a pricing section with 3 plans,
When highlighting the recommended plan,
Then it should use `scale-105`, `ring-2 ring-primary`, and have a "Most Popular" badge.

### Requirement: Final CTA Section Standard

The Final CTA Section MUST be the conversion endpoint of the landing page.

**Background Requirements:**
- Gradient mesh or patterned background
- Uses `--primary` color family
- May include subtle texture or pattern overlay

**Animation Requirements:**
- Floating effect: `animate-bounce-slow` or custom `@keyframes float`
- Subtle movement only (2-4px amplitude)

**CSS Keyframes:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

**Content:**
- Headline: Clear value proposition
- Subtitle: Optional supporting text
- CTA: Primary action button(s)

#### Scenario: Implementing a final CTA section
Given a landing page that needs a bottom conversion section,
When implementing the visual style,
Then it should use a gradient mesh background with subtle floating animation.

### Requirement: Accessibility Requirements for Landing Pages

All landing page sections MUST meet accessibility standards:

**Semantic HTML:**
```tsx
<main>
  <section id="hero" aria-label="Hero">
    <h1>Main Title</h1>
  </section>

  <section id="features" aria-label="Features">
    <h2>Features</h2>
  </section>

  <section id="pricing" aria-label="Pricing">
    <h2>Pricing</h2>
  </section>

  <footer>...</footer>
</main>
```

**Contrast Ratios:**
- Body text: ≥4.5:1
- Headings: ≥3:1
- Large text (18px+): ≥3:1
- UI components: ≥3:1

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Focus Indicators:**
```css
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

#### Scenario: Landing page accessibility audit
Given a landing page implemented with the design system,
When audited for accessibility,
Then it should pass WCAG AA with semantic HTML, proper contrast, and reduced-motion support.

## CROSS-REFERENCE

- **Related to Design Language**: All sections use DL-002 (gradients), DL-003 (shadows), DL-005 (rounded corners)
- **Related to Design Tokens**: Typography (DT-001), Spacing (DT-002), Motion (DT-003) apply to all sections
- **Related to Accessibility**: LP-008 specifies requirements from accessibility guidelines
