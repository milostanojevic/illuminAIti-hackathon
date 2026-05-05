"use client";

import { redirect } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { BrandHero } from "@/components/onboarding/BrandHero";

const HeroPage = () => {
  const { state } = useOnboarding();

  if (!state.brand) {
    redirect("/onboarding");
  }

  return <BrandHero />;
};

export default HeroPage;
