import type { LeagueKey } from "@/types/brand";

export const LEAGUE_NAMES: Record<LeagueKey, string> = {
  psl: "SA Premiership",
  epl: "Premier League",
  ll: "La Liga",
  bl: "Bundesliga",
  ucl: "Champions League",
  wc: "World Cup",
} as const;

export const LEAGUE_FLAGS: Record<LeagueKey, string> = {
  psl: "linear-gradient(#007A4D 33%,#FFB81C 33%,#FFB81C 66%,#007A4D 66%)",
  epl: "linear-gradient(#012169 33%,#fff 33%,#fff 66%,#C8102E 66%)",
  ll: "linear-gradient(#c60b1e 25%,#ffc400 25%,#ffc400 75%,#c60b1e 75%)",
  bl: "linear-gradient(#000 33%,#D00 33%,#D00 66%,#FFCE00 66%)",
  ucl: "linear-gradient(#001489 33%,#fff 33%,#fff 66%,#001489 66%)",
  wc: "linear-gradient(#006AA7 33%,#fff 33%,#fff 66%,#006AA7 66%)",
} as const;
