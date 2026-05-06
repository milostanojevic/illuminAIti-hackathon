import type { OnboardingState } from "@/types/preferences";
import type { Brand, LeagueKey, PromoKey, ProviderKey, RiskLevel, SessionStyle } from "@/types/brand";

export const STORAGE_KEY = "kingmakers_user_preferences";

const LEAGUES: LeagueKey[] = ["psl", "epl", "ll", "bl", "ucl", "wc"];
const LEAGUES_SET = new Set<string>(LEAGUES);

const PROVIDERS: ProviderKey[] = ["habanero", "spribe", "pragmatic", "netent", "betgames", "evolution"];
const PROVIDERS_SET = new Set<string>(PROVIDERS);

const PROMOS_SET = new Set<string>(["freebets", "freespins", "cashback", "odds"]);

export const createDefaultOnboardingState = (): OnboardingState => ({
  brand: "ss",
  leagues: [],
  teams: [],
  casinoGames: [],
  providers: [],
  ssGames: [],
  ssGameThumbs: {},
  style: {
    risk: null,
    session: null,
    promos: [],
  },
});

export const isEffectivelyDefault = (state: OnboardingState): boolean =>
  state.leagues.length === 0 &&
  state.teams.length === 0 &&
  state.casinoGames.length === 0 &&
  state.providers.length === 0 &&
  state.ssGames.length === 0 &&
  Object.keys(state.ssGameThumbs ?? {}).length === 0 &&
  state.style.promos.length === 0 &&
  state.style.risk === null &&
  state.style.session === null;

const parseBrand = (raw: unknown): Brand => (raw === "bk" ? "bk" : "ss");

const parseStringArray = (raw: unknown): string[] =>
  Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];

export const sanitizeOnboardingState = (raw: unknown): OnboardingState | null => {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const leagues = parseStringArray(obj.leagues).filter((k): k is LeagueKey => LEAGUES_SET.has(k));

  const rawProviders = parseStringArray(obj.providers).map((k) => (k === "lw" ? "netent" : k));
  const providers = rawProviders.filter((k): k is ProviderKey => PROVIDERS_SET.has(k));

  const ssGames = parseStringArray(obj.ssGames);

  let ssGameThumbs: Record<string, string> = {};
  const thumbsRaw = obj.ssGameThumbs;
  if (thumbsRaw && typeof thumbsRaw === "object" && !Array.isArray(thumbsRaw)) {
    for (const name of ssGames) {
      const v = (thumbsRaw as Record<string, unknown>)[name];
      if (typeof v === "string") ssGameThumbs[name] = v;
    }
  }

  const base = createDefaultOnboardingState();
  const styleObj =
    typeof obj.style === "object" && obj.style !== null
      ? (obj.style as Record<string, unknown>)
      : {};

  const promosFiltered = parseStringArray(styleObj.promos).filter((k): k is PromoKey =>
    PROMOS_SET.has(k)
  );

  const riskRaw = styleObj.risk;
  const risk: RiskLevel | null =
    riskRaw === "low" || riskRaw === "high" ? riskRaw : riskRaw === null ? null : base.style.risk;

  const sessionRaw = styleObj.session;
  const session: SessionStyle | null =
    sessionRaw === "quick" || sessionRaw === "long"
      ? sessionRaw
      : sessionRaw === null
        ? null
        : base.style.session;

  return {
    brand: parseBrand(obj.brand),
    leagues,
    teams: parseStringArray(obj.teams),
    casinoGames: parseStringArray(obj.casinoGames),
    providers,
    ssGames,
    ssGameThumbs,
    style: {
      risk,
      session,
      promos: promosFiltered,
    },
  };
};

export function readStoredPreferences(): OnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsedJson: unknown = JSON.parse(raw);
    return sanitizeOnboardingState(parsedJson);
  } catch {
    return null;
  }
}

export function writeStoredPreferences(state: OnboardingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // POC: quota / privacy mode — ignore
  }
}
