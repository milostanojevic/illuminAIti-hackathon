"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { ProviderGrid } from "@/components/onboarding/ProviderGrid";

const ProvidersPage = () => {
  const { state } = useOnboarding();

  if (!state.brand || !isStepInFlow(state.brand, "providers")) {
    redirect("/onboarding");
  }

  return <ProviderGrid />;
};

export default ProvidersPage;
