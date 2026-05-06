# Mobile-First Responsive Redesign Spec

## Objective

Refactor all app pages to be mobile-first responsive with a baseline viewport of `360x800`, while preserving existing routes and core behavior. Dense sections should be simplified on small screens and progressively enhanced for tablet and desktop.

## Scope

In scope:
- Global layout and responsive foundations.
- All pages under `src/app`, including onboarding and home flows.
- Shared UI components used by these pages (headers, grids, cards, CTA regions, chips, carousels, progress areas).
- Presentation/content-density changes for small screens where needed.

Out of scope:
- Backend/API/schema changes.
- Routing changes.
- Onboarding business logic changes.

## Requirements

### 1) Mobile-First Baseline (`360x800`)
- Default (unprefixed) styles target phone viewport first.
- Avoid horizontal scrolling in all app pages.
- Ensure touch targets and controls are usable on small screens.
- Preserve readability through tighter but consistent spacing/typography.

### 2) Progressive Enhancement
- Use Tailwind responsive breakpoints (`sm`, `md`, `lg`) to scale up from mobile.
- Tablet and desktop should progressively add columns, spacing, and visual richness.
- Desktop must remain clean and usable, but optimization focus is phone and tablet first.

### 3) Dense Section Simplification
- Convert dense multi-column blocks to single-column by default.
- Reduce card padding/chrome where necessary on mobile.
- Shorten or collapse overly long text blocks on small screens.
- Re-introduce richer layouts and larger spacing at bigger breakpoints.

### 4) Functional Stability
- Keep existing route structure unchanged.
- Keep state and data flow unchanged.
- Keep onboarding progression and save behavior intact.

## Design Approach

### Global Foundation
- Establish mobile-first spacing and typography defaults in shared global styling/layout wrappers.
- Standardize container behavior so pages align to narrow-screen constraints first.
- Normalize section spacing and vertical rhythm across pages.

### Shared Component Refactor
- Refactor shared shells and common components first so improvements propagate:
  - App/layout wrappers
  - Onboarding shell and headers
  - Home shell, carousels/chips, CTA sections
  - Reusable grids/cards
- Make all common components mobile-default with explicit breakpoint-based expansion.

### Page-Level Adjustments
- Review each page and replace desktop-assumptive defaults with mobile defaults.
- Rework local dense areas that cannot be solved by shared component updates alone.
- Ensure critical CTA/action areas remain visible and reachable on phone viewport.

## Breakpoint Strategy

- `base` (mobile-first): optimized for `360x800`.
- `sm`: incremental expansion for larger phones/small tablets.
- `md`: tablet-friendly layout expansions (primary secondary target).
- `lg`: desktop refinements with balanced density.

## Validation Plan

### Viewport Checks
- `360x800`: primary acceptance viewport.
- `768x1024`: tablet acceptance viewport.
- Desktop width (>= `lg`): final expansion check.

### QA Checks
- No horizontal overflow on key pages.
- No clipped CTAs or inaccessible controls.
- Onboarding progression and navigation unchanged.
- Dense sections are simplified on mobile and legible.
- Visual consistency across shared components.

### Tooling Checks
- Run lint/test commands used by the project after refactor.
- Resolve any introduced lint errors in changed files.

## Risks and Mitigations

- Risk: responsive regressions in repeated component patterns.  
  Mitigation: refactor shared components first, then validate pages.

- Risk: over-compressing content on small screens harms clarity.  
  Mitigation: simplify layout/chrome while preserving key copy and actions.

- Risk: inconsistent breakpoints across files.  
  Mitigation: follow a single base → `sm` → `md` → `lg` progression pattern.

## Acceptance Criteria

- All pages render cleanly at `360x800` with mobile-first defaults.
- Dense sections are simplified on mobile and enhanced progressively at larger sizes.
- No route or core behavior changes.
- No introduced lint/test failures in modified areas.
