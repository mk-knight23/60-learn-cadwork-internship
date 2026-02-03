# Cadwork Design System v3.0 - Glassmorphism Edition

> Modern, bright, and confident UI system using the UI-UX Pro Max recommendations.

---

## Design Philosophy

We chose **Glassmorphism with modern SaaS aesthetics** for v3.0 because:

1. **Modern & Bright**: Frosted glass effects with vibrant colors create visual energy
2. **Professional Yet Approachable**: Glassmorphism signals innovation while maintaining credibility
3. **High Clarity**: Excellent contrast ratios and clear visual hierarchy

---

## Color Palette

### Primary Colors (Vibrant Indigo Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-primary` | `#4F46E5` | Primary actions, links, active states (vibrant indigo) |
| `--cad-primary-dark` | `#4338CA` | Hover states |
| `--cad-primary-light` | `#6366F1` | Focus rings, accents |

### Secondary & Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-secondary` | `#818CF8` | Secondary elements, highlights (bright cyan) |
| `--cad-cta` | `#22C55E` | Call-to-action buttons (vibrant green) |

### Neutral Colors (Warmed Grayscale)

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-gray-50` | `#EEF2FF` | Backgrounds (light blue-white) |
| `--cad-gray-100` | `#E0E7FF` | Hover backgrounds |
| `--cad-gray-200` | `#C7D2FE` | Borders, dividers |
| `--cad-gray-300` | `#A5B4FC` | Disabled states |
| `--cad-gray-400` | `#818CF8` | Secondary text |
| `--cad-gray-500` | `#6366F1` | Placeholder text |
| `--cad-gray-600` | `#4F46E5` | Body text (primary) |
| `--cad-gray-700` | `#312E81` | Headings (deep indigo) |
| `--cad-gray-800` | `#1E1B4B` | Dark backgrounds |
| `--cad-gray-900` | `0F172A` | Deepest backgrounds |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-success` | `#22C55E` | Completed states, success messages |
| `--cad-success-light` | `#86EFAC` | Success backgrounds |
| `--cad-warning` | `#F59E0B` | In-progress, warnings |
| `--cad-warning-light` | `#FCD34D` | Warning backgrounds |
| `--cad-error` | `#EF4444` | Errors, critical alerts |
| `--cad-error-light` | `#FCA5A5` | Error backgrounds |
| `--cad-info` | `#0EA5E9` | Informational content |
| `--cad-info-light` | `#38BDF8` | Info backgrounds |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-bg` | `#EEF2FF` | Main background (light blue-white) |
| `--cad-bg-dark` | `#0F172A` | Dark mode background |
| `--cad-surface` | `#FFFFFF` | Cards, surfaces (with opacity) |

---

## Typography

### Font Stack

```css
--font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
--font-display: 'Plus Jakarta Sans', sans-serif;
```

**Why Plus Jakarta Sans?**
- Modern, friendly, and professional
- Excellent readability at all sizes
- Great for SaaS and learning platforms
- 8 font weights (200-800) for flexible hierarchy

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| Display | 2.5rem (40px) | 800 | 1.1 | -0.02em |
| H1 | 2rem (32px) | 700 | 1.2 | -0.01em |
| H2 | 1.5rem (24px) | 600 | 1.3 | 0 |
| H3 | 1.25rem (20px) | 600 | 1.4 | 0 |
| H4 | 1.125rem (18px) | 600 | 1.5 | 0 |
| Body | 1rem (16px) | 400 | 1.6 | 0 |
| Body Small | 0.875rem (14px) | 400 | 1.5 | 0 |
| Caption | 0.75rem (12px) | 500 | 1.4 | 0.01em |
| Overline | 0.625rem (10px) | 700 | 1.2 | 0.1em |

---

## Layout System

### Grid & Spacing

We use an **8px base grid** with the following spacing scale:

```
0.5  →  4px   (micro adjustments)
1    →  8px   (tight spacing)
2    →  16px  (default padding)
3    →  24px  (section gaps)
4    →  32px  (large sections)
5    →  40px  (page sections)
6    →  48px  (major breaks)
8    →  64px  (hero spacing)
```

---

## Glassmorphism Effects

### Glass Card Style

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 6px -1px rgba(79, 70, 229, 0.1),
    0 2px 4px -1px rgba(79, 70, 229, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
```

**Usage**: Primary content containers, cards, modals

### Glass Navigation

```css
.glass-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
```

**Usage**: Header, sidebar, floating elements

---

## Component Patterns

### Cards

```css
.cad-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cad-card:hover {
  box-shadow:
    0 8px 12px -2px rgba(79, 70, 229, 0.15),
    0 4px 6px -2px rgba(79, 70, 229, 0.1);
  transform: translateY(-2px);
}
```

### Buttons

| Variant | Background | Text | Border | Shadow |
|---------|------------|------|--------|--------|
| Primary | `--cad-primary` | white | none | Glass glow |
| Secondary | `rgba(79, 70, 229, 0.1)` | `--cad-primary` | `--cad-primary` | Subtle |
| CTA | `--cad-cta` | white | none | Vibrant glow |

**Button Sizes:**
- Small: 32px height, 12px horizontal padding
- Medium: 40px height, 16px horizontal padding (default)
- Large: 48px height, 24px horizontal padding

### Data Tables

```css
.cad-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  overflow: hidden;
}

.cad-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cad-gray-700);
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(79, 70, 229, 0.1);
}

.cad-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(79, 70, 229, 0.08);
}

.cad-table tr:last-child td {
  border-bottom: none;
}
```

---

## Animation & Motion

### Principles

1. **Purposeful**: Every animation serves a function
2. **Subtle**: Never draw attention to the animation itself
3. **Fast**: Most transitions are 200-300ms
4. **Respectful**: Honor `prefers-reduced-motion`

### Standard Transitions

| Pattern | Duration | Easing |
|---------|----------|--------|
| Color changes | 150ms | ease |
| Transform/scale | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Hover effects | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Modal/dialog | 250ms | cubic-bezier(0, 0, 0.2, 1) |
| Page transitions | 200ms | ease-in-out |

---

## Accessibility Standards

### Minimum Requirements

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Focus Indicators**: 2px solid offset outline with primary color
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Reduced Motion**: Disable animations when `prefers-reduced-motion` is set

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--cad-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## Icons

We use **Lucide Angular** via @angular/icons.

| Size | Usage |
|------|-------|
| 16px | Inline text, small buttons |
| 20px | Navigation items |
| 24px | Cards, content icons |
| 32px | Feature highlights |
| 48px | Empty states |

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| mobile | 375px | Mobile phones |
| tablet | 768px | Tablets |
| desktop | 1024px | Small laptops |
| desktop | 1440px | Desktops |

---

## Dark Mode

Dark mode uses deep navy background with adjusted contrast:

```
Light Mode                    Dark Mode
─────────────────────────────────────────
--cad-bg       →  --cad-bg-dark
--cad-gray-50  →  --cad-gray-900
--cad-gray-100 →  --cad-gray-800
--cad-gray-200 →  --cad-gray-700
--cad-gray-600 →  --cad-gray-300
--cad-gray-700 →  --cad-gray-200
--cad-gray-800 →  --cad-gray-100
--cad-gray-900 →  --cad-gray-50
```

**Note**: Dark mode is optional but available. Light mode with bright colors is the primary focus.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-02-04 | Glassmorphism redesign with vibrant colors |
| 2.0 | 2026-01-29 | Complete redesign for learning portal |
| 1.0 | 2025-12-15 | Initial dashboard design |

---

*Updated using UI-UX Pro Max Skill v2.0*
