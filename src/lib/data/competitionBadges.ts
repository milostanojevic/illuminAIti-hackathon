import type { LeagueKey } from "@/types/brand";

/** Key → `/competitions/<key>.png` for static badge assets in `public/competitions/`. */
export const getCompetitionBadgeUrl = (key: LeagueKey): string =>
  `/competitions/${key}.png`;
