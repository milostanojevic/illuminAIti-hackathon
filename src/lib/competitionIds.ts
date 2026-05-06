import type { LeagueKey } from "@/types/brand";

/** Internal Kingmakers CompetitionId per onboarding league (prematch feeds). */
export const COMPETITION_ID_BY_LEAGUE: Record<LeagueKey, number> = {
  epl: 841,
  ll: 1108,
  bl: 1007,
  psl: 1522545,
  ucl: 15099,
  wc: 25273903,
};

/** Distinct competition ids in the order of first appearance of each league key. */
export function competitionIdsFromLeagues(leagueKeys: LeagueKey[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const key of leagueKeys) {
    const id = COMPETITION_ID_BY_LEAGUE[key];
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
