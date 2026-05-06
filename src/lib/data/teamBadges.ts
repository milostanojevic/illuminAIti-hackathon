/** Slug → `/teams/<slug>.svg` for static crest assets in `public/teams/`. */

const SLUG_OVERRIDES: Record<string, string> = {
  "Man City": "man-city",
  "Man Utd": "man-utd",
  "SuperSport Utd": "supersport-utd",
  "Chippa Utd": "chippa-utd",
};

export const slugifyTeamName = (name: string): string => {
  const o = SLUG_OVERRIDES[name];
  if (o) return o;
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getTeamBadgeUrl = (name: string): string => `/teams/${slugifyTeamName(name)}.svg`;
