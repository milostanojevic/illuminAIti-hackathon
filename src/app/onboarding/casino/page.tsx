"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { CasinoGrid } from "@/components/onboarding/CasinoGrid";

const CasinoPage = () => {
  const { state } = useOnboarding();

  if (!isStepInFlow(state.brand, "casino")) {
    redirect("/onboarding/hero");
  }

  return <CasinoGrid />;
};

export default CasinoPage;
