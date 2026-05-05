import type { Brand, LeagueKey, ProviderKey, PromoKey, RiskLevel, SessionStyle } from "./brand";

export type BettingStyle = {
  risk: RiskLevel | null;
  session: SessionStyle | null;
  promos: PromoKey[];
};

export type OnboardingState = {
  brand: Brand | null;
  leagues: LeagueKey[];
  teams: string[];
  casinoGames: string[];
  providers: ProviderKey[];
  ssGames: string[];
  style: BettingStyle;
};
