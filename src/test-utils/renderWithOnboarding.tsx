import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import React, { type ReactElement, type ReactNode } from "react";

import { OnboardingProvider } from "@/state/OnboardingContext";

type GlobalWithReact = typeof globalThis & { React: typeof React };
type RenderWithOnboardingOptions = Omit<RenderOptions, "wrapper">;

// Vitest renders client TSX outside Next's runtime, while imported app components use legacy JSX output.
(globalThis as GlobalWithReact).React = React;

const OnboardingTestProvider = ({ children }: { children: ReactNode }) => {
  return <OnboardingProvider>{children}</OnboardingProvider>;
};

export const renderWithOnboarding = (
  ui: ReactElement,
  options?: RenderWithOnboardingOptions
): RenderResult => {
  return render(ui, { ...options, wrapper: OnboardingTestProvider });
};
