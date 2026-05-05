"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { redirect } from "next/navigation";
import { MagicLoader } from "@/components/onboarding/MagicLoader";

const MagicPage = () => {
  const { state } = useOnboarding();

  if (!state.brand) {
    redirect("/onboarding");
  }

  return <MagicLoader />;
};

export default MagicPage;
