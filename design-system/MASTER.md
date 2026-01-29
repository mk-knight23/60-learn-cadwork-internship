# Cadwork Design System v2.0

> Internal documentation for the Cadwork Internship Learning Portal.
> This document explains the design decisions made and serves as the single source of truth for all UI/UX patterns.

---

## Design Philosophy

We chose a **professional enterprise aesthetic** over a "flashy" portfolio style because:

1. **Authenticity**: This documents a real internship experience
2. **Usability**: Information density matters more than visual wow-factor
3. **Professional Growth**: Demonstrates understanding of enterprise UI patterns

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-primary` | `#2563EB` | Primary actions, links, active states |
| `--cad-primary-dark` | `#1D4ED8` | Hover states |
| `--cad-primary-light` | `#3B82F6` | Focus rings, accents |

### Neutral Colors (Grayscale)

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-gray-50` | `#F8FAFC` | Backgrounds, cards |
| `--cad-gray-100` | `#F1F5F9` | Hover backgrounds |
| `--cad-gray-200` | `#E2E8F0` | Borders, dividers |
| `--cad-gray-300` | `#CBD5E1` | Disabled states |
| `--cad-gray-400` | `#94A3B8` | Secondary text |
| `--cad-gray-500` | `#64748B` | Placeholder text |
| `--cad-gray-600` | `#475569` | Body text |
| `--cad-gray-700` | `#334155` | Headings |
| `--cad-gray-800` | `#1E293B` | Dark backgrounds |
| `--cad-gray-900` | `#0F172A` | Sidebar, deep backgrounds |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--cad-success` | `#10B981` | Completed states, success messages |
| `--cad-warning` | `#F59E0B` | In-progress, warnings |
| `--cad-error` | `#EF4444` | Errors, critical alerts |
| `--cad-info` | `#0EA5E9` | Informational content |

### Dark Mode Mapping

```
Light Mode                    Dark Mode
─────────────────────────────────────────
--cad-gray-50  →  --cad-gray-900
--cad-gray-100 →  --cad-gray-800
--cad-gray-200 →  --cad-gray-700
--cad-gray-600 →  --cad-gray-300
--cad-gray-700 →  --cad-gray-200
--cad-gray-800 →  --cad-gray-100
--cad-gray-900 →  --cad-gray-50
```

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
--font-display: 'Inter', sans-serif; /* For headings only */
```

**Why Inter?**
- Excellent readability at small sizes
- Built-in optimization for UI elements
- Professional, neutral appearance
- Comprehensive weight range (300-800)

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

### Typography Patterns

- **Headings**: Use `font-display` with tight tracking for impact
- **Body**: Standard `font-sans` for readability
- **Code/Mono**: `font-mono` for code snippets, file paths, and technical data
- **Overlines**: All caps, wide tracking for labels and section headers

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

### Layout Patterns

#### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR (260px)  │  MAIN CONTENT (flex: 1)             │
│                   │  ┌───────────────────────────────┐  │
│  ┌─────────┐      │  │         Header (72px)         │  │
│  │  Logo   │      │  └───────────────────────────────┘  │
│  └─────────┘      │  ┌───────────────────────────────┐  │
│                   │  │                               │  │
│  Navigation       │  │       Scrollable Content      │  │
│  - Dashboard      │  │                               │  │
│  - Projects       │  │                               │  │
│  - Lessons        │  │                               │  │
│  - Skills         │  │                               │  │
│                   │  │                               │  │
│  ┌─────────┐      │  └───────────────────────────────┘  │
│  │ Storage │      │                                     │
│  └─────────┘      │                                     │
└───────────────────┴─────────────────────────────────────┘
```

**Intentional Quirk: Asymmetrical Sidebar Spacing**

The sidebar uses slightly asymmetrical padding:
- Left padding: 24px
- Right padding: 20px (slightly less)

**Why?** This creates a subtle visual "inward lean" that draws attention to the navigation items. It's barely perceptible but adds character. We kept this from the original design because it felt right during testing, even though symmetrical spacing is the "correct" approach.

---

## Component Patterns

### Cards

Cards are our primary content container. They use:

```css
.cad-card {
  background: var(--cad-gray-50);
  border: 1px solid var(--cad-gray-200);
  border-radius: 12px;
  padding: 24px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.cad-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

**Why 12px border-radius?**
- 8px felt too sharp for a learning platform
- 16px felt too "friendly"/casual
- 12px strikes the right balance between professional and approachable

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | `--cad-primary` | white | none | Main CTAs |
| Secondary | transparent | `--cad-gray-700` | `--cad-gray-200` | Secondary actions |
| Tertiary | transparent | `--cad-primary` | none | Subtle actions |
| Ghost | transparent | `--cad-gray-600` | none | Icon buttons |

**Button Sizes:**
- Small: 32px height, 12px horizontal padding
- Medium: 40px height, 16px horizontal padding (default)
- Large: 48px height, 24px horizontal padding

### Data Tables

For lessons and project listings:

```css
.cad-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.cad-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cad-gray-500);
  border-bottom: 1px solid var(--cad-gray-200);
}

.cad-table td {
  padding: 16px;
  border-bottom: 1px solid var(--cad-gray-200);
}
```

### Progress Indicators

For project completion and lesson progress:

```
Linear: 4px height, rounded-full, primary color fill
Circular: 40px diameter, 4px stroke, primary color
```

---

## Navigation Patterns

### Sidebar Navigation

- Items have 12px vertical padding, 16px horizontal
- Active state uses left border accent (3px, primary color)
- Icon + label layout with 12px gap
- Hover: background color change only (no transform)

**Why left border for active state?**
- More accessible than color alone
- Doesn't shift content (unlike background fill changes)
- Common enterprise pattern users recognize

### Breadcrumbs

Used for lesson detail pages:

```
Lessons / Angular Fundamentals / Component Lifecycle
```

Style: Small text (14px), gray color, chevron separator

---

## Icons

We use **Material Icons** via Angular Material. Icon sizing:

| Size | Usage |
|------|-------|
| 16px | Inline text, small buttons |
| 20px | Navigation items |
| 24px | Cards, standalone icons |
| 32px | Feature highlights |
| 48px | Empty states |

---

## Animation & Motion

### Principles

1. **Purposeful**: Every animation serves a function
2. **Subtle**: Never draw attention to the animation itself
3. **Fast**: Most transitions are 200ms or less
4. **Respectful**: Honor `prefers-reduced-motion`

### Standard Transitions

| Pattern | Duration | Easing |
|---------|----------|--------|
| Color changes | 150ms | ease |
| Transform/scale | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Height/width | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Page transitions | 200ms | ease-in-out |
| Modal/dialog | 250ms | cubic-bezier(0, 0, 0.2, 1) |

---

## Accessibility Standards

### Minimum Requirements

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px solid outline, offset by 2px
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Reduced Motion**: Disable animations when `prefers-reduced-motion` is set

### ARIA Patterns

- Navigation: `role="navigation"` with `aria-label`
- Cards: No special ARIA, ensure proper heading hierarchy
- Progress bars: `role="progressbar"` with `aria-valuenow`
- Tabs: Follow WAI-ARIA tabs pattern

---

## Tradeoffs & Decisions

### 1. We Chose Card-Based Layout Over Data Tables

**Context**: Displaying lessons and projects

**Decision**: Use cards for the main view, tables only for admin/reporting

**Why**:
- Cards better handle variable content length
- More scannable on mobile
- Allows richer content (tags, progress bars, avatars)

**Tradeoff**: Less information density, harder to compare across items quickly

---

### 2. We Chose Fixed Sidebar Over Collapsible

**Context**: Navigation on desktop

**Decision**: Keep sidebar always visible on desktop (lg breakpoint+)

**Why**:
- Users need to switch between sections frequently
- Content is never wide enough to need the extra space
- Reduces cognitive load (navigation always visible)

**Tradeoff**: Reduced horizontal space for content on smaller desktops

---

### 3. We Chose Angular Material Over Custom Components

**Context**: UI component library

**Decision**: Use Angular Material as the foundation

**Why**:
- Battle-tested accessibility
- Consistent with enterprise standards
- Faster development (focus on content, not components)

**Tradeoff**: Less unique visual identity, harder to customize

---

## File Organization

```
design-system/
├── MASTER.md              # This file - overview and principles
├── tokens/
│   ├── colors.scss        # Color variables
│   ├── typography.scss    # Font settings
│   └── spacing.scss       # Spacing scale
└── patterns/
    ├── cards.md           # Card component specs
    ├── navigation.md      # Navigation patterns
    └── tables.md          # Table patterns
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-29 | Complete redesign for learning portal |
| 1.0 | 2025-12-15 | Initial dashboard design |

---

*Document maintained by the Cadwork Internship Project.*
*Questions? See the ADRs in `/docs/decisions/` for detailed rationale.*
