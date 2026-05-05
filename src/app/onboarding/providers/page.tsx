"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { ProviderGrid } from "@/components/onboarding/ProviderGrid";

const ProvidersPage = () => {
  const { state } = useOnboarding();

  if (!isStepInFlow(state.brand, "providers")) {
    redirect("/onboarding/hero");
  }

  return <ProviderGrid />;
};

export default ProvidersPage;
