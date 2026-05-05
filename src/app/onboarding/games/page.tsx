"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { GameGrid } from "@/components/onboarding/GameGrid";

const GamesPage = () => {
  const { state } = useOnboarding();

  if (!state.brand || !isStepInFlow(state.brand, "games")) {
    redirect("/onboarding");
  }

  return <GameGrid />;
};

export default GamesPage;
