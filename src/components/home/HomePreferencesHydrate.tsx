"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useOnboarding } from "@/state/OnboardingContext";
import { createDefaultOnboardingState, readStoredPreferences } from "@/lib/storedPreferences";

type HomePreferencesHydrateProps = {
  children: ReactNode;
};

/** Apply localStorage snapshot once on mount so /home survives a fresh OnboardingProvider. */
export const HomePreferencesHydrate = ({ children }: HomePreferencesHydrateProps) => {
  const { hydrate } = useOnboarding();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    hydrate(readStoredPreferences() ?? createDefaultOnboardingState());
  }, [hydrate]);

  return <>{children}</>;
};
