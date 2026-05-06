"use client";

import { OnboardingProvider } from "@/state/OnboardingContext";
import { HomePreferencesHydrate } from "@/components/home/HomePreferencesHydrate";
import { HomeShell } from "@/components/home/HomeShell";

const HomePage = () => {
  return (
    <div className="modal">
      <OnboardingProvider>
        <HomePreferencesHydrate>
          <HomeShell />
        </HomePreferencesHydrate>
      </OnboardingProvider>
    </div>
  );
};

export default HomePage;
