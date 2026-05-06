"use client";

import { AppPhoneFrame } from "@/components/layout/AppPhoneFrame";
import { OnboardingProvider } from "@/state/OnboardingContext";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OnboardingProvider>
      <AppPhoneFrame>{children}</AppPhoneFrame>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
