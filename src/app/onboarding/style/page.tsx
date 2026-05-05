"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { isStepInFlow } from "@/lib/flow";
import { StyleForm } from "@/components/onboarding/StyleForm";

const StylePage = () => {
  const { state } = useOnboarding();

  if (!isStepInFlow(state.brand, "style")) {
    redirect("/onboarding/hero");
  }

  return <StyleForm />;
};

export default StylePage;
