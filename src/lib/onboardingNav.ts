import type { Brand } from "@/types/brand";
import type { StepKey } from "@/lib/flow";
import { getGhostSkipDestination, STEP_ROUTES } from "@/lib/flow";

type RouterPush = { push: (href: string) => void };

/** Advance without requiring Continue (Ghost / Skip for now); may skip linked dependency steps. */
export const goToNextPreferenceStep = (router: RouterPush, brand: Brand, currentStep: StepKey): void => {
  const next = getGhostSkipDestination(brand, currentStep);
  if (next) router.push(STEP_ROUTES[next]);
};
