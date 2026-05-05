"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { StyleForm } from "@/components/onboarding/StyleForm";

const StylePage = () => {
  const { state } = useOnboarding();

  if (!state.brand || !isStepInFlow(state.brand, "style")) {
    redirect("/onboarding");
  }

  return <StyleForm />;
};

export default StylePage;
