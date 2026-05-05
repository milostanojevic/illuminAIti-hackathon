"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { CasinoGrid } from "@/components/onboarding/CasinoGrid";

const CasinoPage = () => {
  const { state } = useOnboarding();

  if (!state.brand || !isStepInFlow(state.brand, "casino")) {
    redirect("/onboarding");
  }

  return <CasinoGrid />;
};

export default CasinoPage;
