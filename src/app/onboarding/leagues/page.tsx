"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { LeagueGrid } from "@/components/onboarding/LeagueGrid";

const LeaguesPage = () => {
  const { state } = useOnboarding();

  if (!state.brand || !isStepInFlow(state.brand, "leagues")) {
    redirect("/onboarding");
  }

  return <LeagueGrid />;
};

export default LeaguesPage;
