"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { LeagueGrid } from "@/components/onboarding/LeagueGrid";

const LeaguesPage = () => {
  const { state } = useOnboarding();

  if (!isStepInFlow(state.brand, "leagues")) {
    redirect("/onboarding/hero");
  }

  return <LeagueGrid />;
};

export default LeaguesPage;
