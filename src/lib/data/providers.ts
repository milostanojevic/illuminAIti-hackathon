import type { ProviderKey } from "@/types/brand";

export const PROVIDER_LABELS: Record<ProviderKey, string> = {
  habanero: "Habanero",
  spribe: "Spribe",
  pragmatic: "Pragmatic Play",
  lw: "L&W",
  betgames: "Bet Games",
  evolution: "Evolution",
} as const;
