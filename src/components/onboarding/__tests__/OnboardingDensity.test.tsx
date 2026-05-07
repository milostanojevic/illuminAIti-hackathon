import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { LeagueGrid } from "@/components/onboarding/LeagueGrid";
import { MagicLoader } from "@/components/onboarding/MagicLoader";
import { OnboardingStepShell } from "@/components/onboarding/OnboardingStepShell";
import { ScreenHeader } from "@/components/onboarding/ScreenHeader";
import { renderWithOnboarding } from "@/test-utils/renderWithOnboarding";

vi.mock("next/navigation", () => ({
  usePathname: () => "/onboarding/leagues",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("onboarding mobile-first density", () => {
  it("uses mobile-first shell content spacing while retaining safe-area bottom padding", () => {
    renderWithOnboarding(
      <OnboardingStepShell header={<div>Shell header</div>}>
        <div>Shell content</div>
      </OnboardingStepShell>
    );

    const contentRegion = screen.getByText("Shell content").parentElement;

    expect(contentRegion).toHaveClass("p-3", "sm:p-4", "md:p-5");
    expect(contentRegion?.className).toContain(
      "pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
    );
  });

  it("uses denser mobile header spacing with progressive expansion", () => {
    renderWithOnboarding(
      <ScreenHeader
        brand="ss"
        currentStep="leagues"
        title="Choose leagues"
        subtitle="Pick the competitions you follow most."
        stepLabel="Leagues"
      />
    );

    const header = screen.getByText("Personalise your experience").parentElement;
    const title = screen.getByText("Choose leagues");

    expect(header).toHaveClass("px-3", "sm:px-4", "md:px-5");
    expect(header).toHaveClass("pt-3", "sm:pt-4", "md:pt-5");
    expect(title).toHaveClass("text-base", "sm:text-[17px]", "md:text-lg");
  });

  it("uses two mobile columns and grows wider tiles before expanding", () => {
    renderWithOnboarding(<LeagueGrid />);

    const leagueGrid = screen.getByText("SA Premiership").closest("button")?.parentElement;

    expect(leagueGrid).toHaveClass("grid-cols-2", "sm:grid-cols-2", "md:grid-cols-3");
  });

  it("uses compact MagicLoader title text with progressive expansion", () => {
    vi.useFakeTimers();

    const { unmount } = renderWithOnboarding(<MagicLoader />);

    const title = screen.getByText((_, element) =>
      element?.textContent === "Building yourpersonal experience"
    );

    expect(title).toHaveClass("text-lg", "sm:text-xl", "md:text-2xl");

    unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
