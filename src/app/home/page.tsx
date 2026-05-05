"use client";

import { OnboardingProvider } from "@/state/OnboardingContext";
import { HomeShell } from "@/components/home/HomeShell";

const HomePage = () => {
  return (
    <div className="modal">
      <OnboardingProvider>
        <HomeShell />
      </OnboardingProvider>
    </div>
  );
};

export default HomePage;
