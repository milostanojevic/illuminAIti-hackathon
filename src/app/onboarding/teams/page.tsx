"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { TeamGrid } from "@/components/onboarding/TeamGrid";

const TeamsPage = () => {
  const { state } = useOnboarding();

  if (!isStepInFlow(state.brand, "teams")) {
    redirect("/onboarding/hero");
  }

  return <TeamGrid />;
};

export default TeamsPage;
