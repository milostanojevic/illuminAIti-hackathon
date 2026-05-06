# Mobile-First Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every onboarding and home page mobile-first at `360x800`, simplify dense small-screen sections, and progressively enhance for tablet and desktop without changing app flow logic.

**Architecture:** Keep all existing route/state/data behavior intact and focus only on presentation. Apply responsive defaults from shared shells and reusable components first, then make targeted page-level density fixes. Verify behavior with component-level responsive tests and full lint/typecheck/test passes.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vitest + Testing Library (added in this plan).

---

## File Structure (Create/Modify Map)

- Create: `vitest.config.ts` (unit test runner config)
- Create: `vitest.setup.ts` (jsdom/testing-library setup)
- Create: `src/test-utils/renderWithOnboarding.tsx` (provider wrapper for UI tests)
- Create: `src/components/layout/AppPhoneFrame.tsx` (single mobile-first frame wrapper)
- Create: `src/components/layout/AppPhoneFrame.test.tsx` (frame responsive test)
- Create: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx` (grid/card density tests)
- Create: `src/components/home/__tests__/HomeDensity.test.tsx` (home density and carousel tests)
- Modify: `package.json` (test scripts + dev deps)
- Modify: `src/app/layout.tsx` (viewport/body mobile-first shell refinements)
- Modify: `src/app/globals.css` (shared responsive utility classes + safe overflow protections)
- Modify: `src/app/onboarding/layout.tsx` (use shared app frame)
- Modify: `src/app/home/page.tsx` (use shared app frame)
- Modify: `src/components/onboarding/OnboardingStepShell.tsx` (mobile spacing + tablet/desktop expansion)
- Modify: `src/components/onboarding/ScreenHeader.tsx` (header density and text scaling)
- Modify: `src/components/onboarding/LeagueGrid.tsx` (single-column-first behavior and card simplification)
- Modify: `src/components/onboarding/TeamGrid.tsx` (team card density simplification + responsive columns)
- Modify: `src/components/onboarding/StyleForm.tsx` (single-column mobile cards, 2-column at `md+`)
- Modify: `src/components/onboarding/CasinoGrid.tsx` (mobile card height/spacing and progressive columns)
- Modify: `src/components/onboarding/ProviderGrid.tsx` (mobile stacking, spacing, and reduced card chrome)
- Modify: `src/components/onboarding/GameGrid.tsx` (mobile-first section flow and card sizing)
- Modify: `src/components/onboarding/MagicLoader.tsx` (mobile-safe text/spacing and progress area)
- Modify: `src/components/home/HomeShell.tsx` (mobile-first top bar/content spacing and dense section simplification)
- Modify: `src/components/home/HomeCTA.tsx` (compact CTA mobile style, richer desktop style)
- Modify: `src/components/home/LeagueChips.tsx` (overflow-safe chip wrapping/scroll behavior)
- Modify: `src/components/home/TrendingCarousel.tsx` (mobile card width and controls by breakpoint)

---

### Task 1: Test Harness (TDD Foundation)

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json`
- Test: `src/components/layout/AppPhoneFrame.test.tsx` (scaffold failing import test first)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { AppPhoneFrame } from "./AppPhoneFrame";

describe("AppPhoneFrame", () => {
  it("exports a component symbol", () => {
    expect(AppPhoneFrame).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/layout/AppPhoneFrame.test.tsx`
Expected: FAIL with script-not-found and/or module resolution errors.

- [ ] **Step 3: Write minimal implementation**

```ts
// package.json scripts/devDependencies (minimal)
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/layout/AppPhoneFrame.test.tsx`
Expected: PASS (or FAIL with missing `AppPhoneFrame` file, which is addressed in Task 2).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "test: add vitest harness for responsive UI refactor"
```

---

### Task 2: Shared App Frame + Root Mobile Baseline

**Files:**
- Create: `src/components/layout/AppPhoneFrame.tsx`
- Create: `src/components/layout/AppPhoneFrame.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/onboarding/layout.tsx`
- Modify: `src/app/home/page.tsx`
- Test: `src/components/layout/AppPhoneFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { AppPhoneFrame } from "./AppPhoneFrame";

describe("AppPhoneFrame", () => {
  it("applies mobile-first wrapper classes", () => {
    render(<AppPhoneFrame><div>inner</div></AppPhoneFrame>);
    const frame = screen.getByTestId("app-phone-frame");
    expect(frame).toHaveClass("w-full");
    expect(frame).toHaveClass("max-w-[360px]");
    expect(frame).toHaveClass("md:max-w-[420px]");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/layout/AppPhoneFrame.test.tsx`
Expected: FAIL because `AppPhoneFrame` does not yet exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/layout/AppPhoneFrame.tsx
import type { ReactNode } from "react";

type AppPhoneFrameProps = { children: ReactNode };

export const AppPhoneFrame = ({ children }: AppPhoneFrameProps) => {
  return (
    <div
      data-testid="app-phone-frame"
      className="modal w-full max-w-[360px] sm:max-w-[390px] md:max-w-[420px] lg:max-w-[460px]"
    >
      {children}
    </div>
  );
};
```

```tsx
// use AppPhoneFrame in onboarding/home layouts
<AppPhoneFrame>{children}</AppPhoneFrame>
```

```css
/* globals.css mobile-safe baseline */
html, body {
  width: 100%;
  overflow-x: hidden;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/layout/AppPhoneFrame.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppPhoneFrame.tsx src/components/layout/AppPhoneFrame.test.tsx src/app/layout.tsx src/app/globals.css src/app/onboarding/layout.tsx src/app/home/page.tsx
git commit -m "feat: add shared mobile-first app frame and root responsive baseline"
```

---

### Task 3: Onboarding Shell/Header Density Refactor

**Files:**
- Modify: `src/components/onboarding/OnboardingStepShell.tsx`
- Modify: `src/components/onboarding/ScreenHeader.tsx`
- Modify: `src/components/onboarding/StepProgress.tsx`
- Create: `src/test-utils/renderWithOnboarding.tsx`
- Create: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
- Test: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { OnboardingStepShell } from "../OnboardingStepShell";

describe("OnboardingStepShell mobile density", () => {
  it("uses compact mobile spacing with progressive breakpoints", () => {
    render(
      <OnboardingStepShell header={<div>header</div>}>
        <div>content</div>
      </OnboardingStepShell>
    );
    const region = screen.getByText("content").parentElement;
    expect(region).toHaveClass("p-3");
    expect(region).toHaveClass("sm:p-4");
    expect(region).toHaveClass("md:p-5");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: FAIL because current shell uses larger fixed spacing classes.

- [ ] **Step 3: Write minimal implementation**

```tsx
// OnboardingStepShell
<div className="scroll-touch flex flex-1 flex-col min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white p-3 sm:p-4 md:p-5 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
  {children}
</div>
```

```tsx
// ScreenHeader
<div className="relative w-full min-w-0 flex-shrink-0 px-3 pt-3 pb-0 sm:px-4 sm:pt-4">
  {/* compact mobile typography, expand at sm/md */}
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/onboarding/OnboardingStepShell.tsx src/components/onboarding/ScreenHeader.tsx src/components/onboarding/StepProgress.tsx src/test-utils/renderWithOnboarding.tsx src/components/onboarding/__tests__/OnboardingDensity.test.tsx
git commit -m "refactor: make onboarding shell and header mobile-density first"
```

---

### Task 4: Preference Grids Mobile-First Simplification

**Files:**
- Modify: `src/components/onboarding/LeagueGrid.tsx`
- Modify: `src/components/onboarding/TeamGrid.tsx`
- Modify: `src/components/onboarding/StyleForm.tsx`
- Modify: `src/components/onboarding/CasinoGrid.tsx`
- Modify: `src/components/onboarding/ProviderGrid.tsx`
- Modify: `src/components/onboarding/GameGrid.tsx`
- Modify: `src/components/onboarding/ContinueButton.tsx`
- Test: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { StyleForm } from "../StyleForm";

describe("StyleForm responsive layout", () => {
  it("is single-column by default and expands at md", () => {
    render(<StyleForm />);
    const groupGrid = screen.getAllByRole("button")[0].parentElement;
    expect(groupGrid).toHaveClass("grid-cols-1");
    expect(groupGrid).toHaveClass("md:grid-cols-2");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: FAIL because grids are currently multi-column by default.

- [ ] **Step 3: Write minimal implementation**

```tsx
// examples of required responsive pattern updates
className="grid grid-cols-1 gap-2 sm:grid-cols-2"
className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:gap-2"
className="h-[64px] sm:h-[72px] md:h-[80px]"
className="rounded-lg sm:rounded-xl"
```

```tsx
// ContinueButton mobile density
className="w-full py-3 sm:py-3.5 rounded-2xl sm:rounded-[30px] ..."
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/onboarding/LeagueGrid.tsx src/components/onboarding/TeamGrid.tsx src/components/onboarding/StyleForm.tsx src/components/onboarding/CasinoGrid.tsx src/components/onboarding/ProviderGrid.tsx src/components/onboarding/GameGrid.tsx src/components/onboarding/ContinueButton.tsx src/components/onboarding/__tests__/OnboardingDensity.test.tsx
git commit -m "feat: simplify onboarding preference grids for mobile-first layout"
```

---

### Task 5: Hero + Magic Screen Phone Optimization

**Files:**
- Modify: `src/components/onboarding/BrandHero.tsx`
- Modify: `src/components/onboarding/MagicLoader.tsx`
- Test: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MagicLoader } from "../MagicLoader";

describe("MagicLoader mobile viewport safety", () => {
  it("keeps compact vertical spacing classes for 360x800", () => {
    render(<MagicLoader />);
    const title = screen.getByText(/Building your/i);
    expect(title).toHaveClass("text-lg");
    expect(title).toHaveClass("sm:text-xl");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: FAIL because existing loader uses larger fixed typography/spacing.

- [ ] **Step 3: Write minimal implementation**

```tsx
// MagicLoader
className="flex flex-1 flex-col items-center justify-center min-h-0 px-4 py-5 sm:px-6 sm:py-7 ..."
className="text-[38px] sm:text-[44px]"
className="text-lg sm:text-xl md:text-2xl"
```

```tsx
// BrandHero
className="... px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:px-5 sm:pt-5"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/onboarding/BrandHero.tsx src/components/onboarding/MagicLoader.tsx src/components/onboarding/__tests__/OnboardingDensity.test.tsx
git commit -m "refactor: optimize hero and magic onboarding screens for 360x800 baseline"
```

---

### Task 6: Home Screen Mobile-First + Progressive Expansion

**Files:**
- Modify: `src/components/home/HomeShell.tsx`
- Modify: `src/components/home/HomeCTA.tsx`
- Modify: `src/components/home/LeagueChips.tsx`
- Modify: `src/components/home/TrendingCarousel.tsx`
- Create: `src/components/home/__tests__/HomeDensity.test.tsx`
- Test: `src/components/home/__tests__/HomeDensity.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { HomeCTA } from "../HomeCTA";

describe("HomeCTA mobile density", () => {
  it("uses compact phone spacing and scales up at sm", () => {
    render(
      <HomeCTA
        icon="⚽"
        title="Sports"
        subtitle="Matches"
        buttonLabel="Bet"
        bg="#1a2b6b"
      />
    );
    const card = screen.getByText("Sports").closest("div");
    expect(card).toHaveClass("px-3");
    expect(card).toHaveClass("sm:px-4");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/home/__tests__/HomeDensity.test.tsx`
Expected: FAIL because CTA currently uses larger fixed spacing.

- [ ] **Step 3: Write minimal implementation**

```tsx
// HomeCTA
className="rounded-xl px-3 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2"
```

```tsx
// TrendingCarousel
className="trending-card-item flex-none w-[178px] sm:w-[210px] md:w-[230px] ..."
```

```tsx
// LeagueChips
className="flex gap-1.5 overflow-x-auto overflow-y-hidden scroll-touch pb-0.5"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/home/__tests__/HomeDensity.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeShell.tsx src/components/home/HomeCTA.tsx src/components/home/LeagueChips.tsx src/components/home/TrendingCarousel.tsx src/components/home/__tests__/HomeDensity.test.tsx
git commit -m "feat: make home screen mobile-first with responsive density scaling"
```

---

### Task 7: Final Verification and Regression Guardrails

**Files:**
- Modify (if needed after verification): any files from Tasks 1-6
- Test: `src/components/layout/AppPhoneFrame.test.tsx`
- Test: `src/components/onboarding/__tests__/OnboardingDensity.test.tsx`
- Test: `src/components/home/__tests__/HomeDensity.test.tsx`

- [ ] **Step 1: Write one failing regression test for overflow guard**

```tsx
import { render } from "@testing-library/react";
import { AppPhoneFrame } from "@/components/layout/AppPhoneFrame";

describe("No horizontal overflow contract", () => {
  it("keeps frame overflow-x hidden", () => {
    const { getByTestId } = render(<AppPhoneFrame><div>content</div></AppPhoneFrame>);
    expect(getByTestId("app-phone-frame")).toHaveClass("overflow-hidden");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/layout/AppPhoneFrame.test.tsx`
Expected: FAIL until class contract is added.

- [ ] **Step 3: Write minimal implementation**

```tsx
// AppPhoneFrame.tsx class list includes:
className="modal ... overflow-hidden"
```

- [ ] **Step 4: Run full verification**

Run: `npm run test`
Expected: PASS (all responsive tests green).

Run: `npm run lint`
Expected: PASS (no new lint errors).

Run: `npm run typecheck`
Expected: PASS (no type errors).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppPhoneFrame.tsx src/components/layout/AppPhoneFrame.test.tsx src/components/onboarding/__tests__/OnboardingDensity.test.tsx src/components/home/__tests__/HomeDensity.test.tsx
git commit -m "test: add responsive overflow regression guard and verify mobile-first refactor"
```
