"use client";

import { AppPhoneFrame } from "@/components/layout/AppPhoneFrame";
import { OnboardingProvider } from "@/state/OnboardingContext";
import { HomePreferencesHydrate } from "@/components/home/HomePreferencesHydrate";
import { HomeShell } from "@/components/home/HomeShell";

const HomePage = () => {
  return (
    <AppPhoneFrame>
      <OnboardingProvider>
        <HomePreferencesHydrate>
          <HomeShell />
        </HomePreferencesHydrate>
      </OnboardingProvider>
    </AppPhoneFrame>
  );
};

export default HomePage;
