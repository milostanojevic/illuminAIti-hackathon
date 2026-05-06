import type { ProviderKey } from "@/types/brand";

export const PROVIDER_LABELS: Record<ProviderKey, string> = {
  habanero: "Habanero",
  spribe: "Spribe",
  pragmatic: "PragmaticPlay",
  netent: "Netent",
  betgames: "BetGames",
  evolution: "Evolution",
} as const;

/** Slug for Kingmakers CMS `filters[providerName]=` query. */
export const PROVIDER_API_SLUG: Record<ProviderKey, string> = {
  habanero: "habanero",
  spribe: "spribe",
  pragmatic: "pragmaticplay",
  netent: "netent",
  betgames: "betGames",
  evolution: "evolution",
} as const;
