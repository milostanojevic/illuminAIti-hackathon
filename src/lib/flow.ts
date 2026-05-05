import type { Brand } from "@/types/brand";

export type StepKey =
  | "hero"
  | "providers"
  | "games"
  | "leagues"
  | "teams"
  | "casino"
  | "style"
  | "magic";

export const FLOWS: Record<Brand, readonly StepKey[]> = {
  bk: ["hero", "leagues", "teams", "casino", "style", "magic"],
  ss: ["hero", "providers", "games", "leagues", "teams", "style", "magic"],
} as const;

export const STEP_ROUTES: Record<StepKey, string> = {
  hero: "/onboarding/hero",
  providers: "/onboarding/providers",
  games: "/onboarding/games",
  leagues: "/onboarding/leagues",
  teams: "/onboarding/teams",
  casino: "/onboarding/casino",
  style: "/onboarding/style",
  magic: "/onboarding/magic",
};

const NON_WIZARD_STEPS: readonly StepKey[] = ["hero"];

const isWizardStep = (step: StepKey): boolean => !NON_WIZARD_STEPS.includes(step);

export const getStepIndex = (brand: Brand, step: StepKey): number => {
  return FLOWS[brand].indexOf(step);
};

export const getStepCount = (brand: Brand): number => {
  return FLOWS[brand].length;
};

export const getWizardStepIndex = (brand: Brand, step: StepKey): number => {
  return FLOWS[brand].filter(isWizardStep).indexOf(step) + 1;
};

export const getWizardStepCount = (brand: Brand): number => {
  return FLOWS[brand].filter(isWizardStep).length;
};

export const getNextStep = (brand: Brand, currentStep: StepKey): StepKey | null => {
  const flow = FLOWS[brand];
  const idx = flow.indexOf(currentStep);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
};

export const getPreviousStep = (brand: Brand, currentStep: StepKey): StepKey | null => {
  const flow = FLOWS[brand];
  const idx = flow.indexOf(currentStep);
  if (idx <= 0) return null;
  return flow[idx - 1];
};

export const isStepInFlow = (brand: Brand, step: StepKey): boolean => {
  return FLOWS[brand].includes(step);
};
