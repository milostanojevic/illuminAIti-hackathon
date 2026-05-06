import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { HomeCTA } from "@/components/home/HomeCTA";
import { HomeShell } from "@/components/home/HomeShell";
import { LeagueChips } from "@/components/home/LeagueChips";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { renderWithOnboarding } from "@/test-utils/renderWithOnboarding";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
}));

const cards = [
  {
    chip: "Hot",
    icon: "Goal",
    name: "Derby night",
    desc: "Top markets are moving now.",
    cta: "View markets",
    bg: "linear-gradient(135deg, #1a2db8, #0d1580)",
  },
];

describe("home mobile-first density", () => {
  it("uses compact CTA spacing before expanding at sm", () => {
    render(
      <HomeCTA
        icon="Wallet"
        title="Deposit now"
        subtitle="Top up your account"
        buttonLabel="Deposit"
        bg="#00d8c8"
      />
    );

    const cta = screen.getByRole("button", { name: "Deposit" }).parentElement;

    expect(cta).toHaveClass("px-3", "py-2.5", "sm:px-4", "sm:py-3.5");
  });

  it("keeps league chips overflow-safe on narrow screens", () => {
    render(<LeagueChips leagues={["psl", "epl", "ll", "bl", "ucl", "wc"]} />);

    const chips = screen.getByText("SA Premiership").parentElement?.parentElement;

    expect(chips).toHaveClass("flex-nowrap", "overflow-x-auto");
    expect(chips).not.toHaveClass("overflow-hidden");
  });

  it("sizes trending cards progressively from mobile to md", () => {
    render(<TrendingCarousel cards={cards} />);

    const card = screen.getByText("Derby night").closest(".trending-card-item");

    expect(card).toHaveClass("w-[176px]", "sm:w-[210px]", "md:w-[230px]");
  });

  it("uses tighter home shell spacing with progressive expansion", () => {
    renderWithOnboarding(<HomeShell />);

    const header = screen.getByText("SuperSportBET").closest("div")?.parentElement?.parentElement
      ?.parentElement;
    const content = screen.getByRole("button", { name: "Deposit" }).parentElement?.parentElement;

    expect(header).toHaveClass("px-3", "pt-3", "pb-2.5", "sm:px-4", "sm:pt-4", "sm:pb-3.5");
    expect(content).toHaveClass("gap-2", "p-2.5", "sm:gap-3", "sm:p-3.5", "md:p-4");
  });
});
