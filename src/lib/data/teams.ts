import type { LeagueKey } from "@/types/brand";

export const TEAMS: Record<LeagueKey, { name: string }[]> = {
  psl: [
    { name: "Mamelodi Sundowns" },
    { name: "Orlando Pirates" },
    { name: "Kaizer Chiefs" },
    { name: "Stellenbosch" },
    { name: "AmaZulu" },
    { name: "Sekhukhune" },
    { name: "Richards Bay" },
    { name: "Chippa Utd" },
  ],
  epl: [
    { name: "Arsenal" },
    { name: "Man City" },
    { name: "Liverpool" },
    { name: "Chelsea" },
    { name: "Tottenham" },
    { name: "Man Utd" },
    { name: "Newcastle" },
    { name: "Aston Villa" },
    { name: "West Ham" },
    { name: "Wolves" },
  ],
  ll: [
    { name: "Real Madrid" },
    { name: "Barcelona" },
    { name: "Atletico" },
    { name: "Sevilla" },
    { name: "Real Betis" },
    { name: "Valencia" },
    { name: "Villarreal" },
    { name: "Athletic" },
    { name: "Sociedad" },
    { name: "Osasuna" },
  ],
  bl: [
    { name: "Bayern" },
    { name: "Dortmund" },
    { name: "Leverkusen" },
    { name: "Leipzig" },
    { name: "Frankfurt" },
    { name: "Wolfsburg" },
    { name: "Gladbach" },
    { name: "Freiburg" },
    { name: "Hoffenheim" },
    { name: "Mainz" },
  ],
  ucl: [
    { name: "Real Madrid" },
    { name: "Man City" },
    { name: "Bayern" },
    { name: "Barcelona" },
    { name: "PSG" },
    { name: "Liverpool" },
    { name: "Dortmund" },
    { name: "Arsenal" },
    { name: "Inter" },
    { name: "Atletico" },
  ],
  wc: [
    { name: "Brazil" },
    { name: "France" },
    { name: "Argentina" },
    { name: "England" },
    { name: "Germany" },
    { name: "Spain" },
    { name: "Portugal" },
    { name: "Netherlands" },
    { name: "South Africa" },
    { name: "Morocco" },
  ],
} as const;

export const buildTeamPool = (keys: LeagueKey[]): string[] => {
  if (keys.length === 0) return [];

  const pool: string[] = [];

  if (keys.length === 1) {
    TEAMS[keys[0]].forEach((t) => pool.push(t.name));
  } else {
    const per = Math.ceil(10 / keys.length);
    keys.forEach((k) => {
      TEAMS[k].slice(0, per).forEach((t) => pool.push(t.name));
    });
  }

  return pool.slice(0, 10);
};
