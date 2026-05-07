import type { Brand } from "@/types/brand";
import type { OnboardingState } from "@/types/preferences";

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

/** Loader / transition after preferences — not shown in “Step X of Y” or progress pips. */
const NON_NUMBERED_WIZARD_STEPS: readonly StepKey[] = ["hero", "magic"];

const isNumberedWizardStep = (step: StepKey): boolean =>
  !NON_NUMBERED_WIZARD_STEPS.includes(step);

export const getStepIndex = (brand: Brand, step: StepKey): number => {
  return FLOWS[brand].indexOf(step);
};

export const getStepCount = (brand: Brand): number => {
  return FLOWS[brand].length;
};

export const getWizardStepIndex = (brand: Brand, step: StepKey): number => {
  return FLOWS[brand].filter(isNumberedWizardStep).indexOf(step) + 1;
};

export const getWizardStepCount = (brand: Brand): number => {
  return FLOWS[brand].filter(isNumberedWizardStep).length;
};

export const getNextStep = (brand: Brand, currentStep: StepKey): StepKey | null => {
  const flow = FLOWS[brand];
  const idx = flow.indexOf(currentStep);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
};

/** Destination for Ghost / “Skip for now” — skips linked dependency steps where applicable. */
export const getGhostSkipDestination = (brand: Brand, currentStep: StepKey): StepKey | null => {
  if (brand === "ss" && currentStep === "providers") return "leagues";
  if (currentStep === "leagues") return brand === "bk" ? "casino" : "style";
  return getNextStep(brand, currentStep);
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

const isStepFilled = (step: StepKey, state: OnboardingState): boolean => {
  switch (step) {
    case "providers":
      return state.providers.length > 0;
    case "games":
      return state.ssGames.length > 0;
    case "leagues":
      return state.leagues.length > 0;
    case "teams":
      return state.teams.length > 0;
    case "casino":
      return state.casinoGames.length > 0;
    case "style":
      return (
        state.style.risk !== null ||
        state.style.session !== null ||
        state.style.promos.length > 0
      );
    case "hero":
    case "magic":
    default:
      return true;
  }
};

type SmartBackGroup = { brand: Brand; on: StepKey; through: readonly StepKey[] };

const SMART_BACK_GROUPS: readonly SmartBackGroup[] = [
  { brand: "ss", on: "leagues", through: ["providers", "games"] },
  { brand: "ss", on: "style", through: ["leagues", "teams"] },
  { brand: "bk", on: "casino", through: ["leagues", "teams"] },
];

export const getSmartPreviousStep = (
  brand: Brand,
  currentStep: StepKey,
  state: OnboardingState,
): StepKey | null => {
  const group = SMART_BACK_GROUPS.find((g) => g.brand === brand && g.on === currentStep);
  if (!group) return getPreviousStep(brand, currentStep);
  for (const step of group.through) {
    if (!isStepFilled(step, state)) return step;
  }
  return group.through[group.through.length - 1] ?? getPreviousStep(brand, currentStep);
};
