import type { LeagueKey } from "@/types/brand";

/** Key → `/flags/<key>.png` for static country/region flag assets in `public/flags/`. */
export const getLeagueFlagUrl = (key: LeagueKey): string => `/flags/${key}.png`;
