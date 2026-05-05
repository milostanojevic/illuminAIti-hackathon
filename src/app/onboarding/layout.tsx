"use client";

import { OnboardingProvider } from "@/state/OnboardingContext";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OnboardingProvider>
      <div className="modal">{children}</div>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
