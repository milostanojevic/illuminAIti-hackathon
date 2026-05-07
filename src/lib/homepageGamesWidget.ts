/** Shapes from SuperSportBet `widgetType=games` homepage widget (Strapi-style). */

export type HomepageGameCard = {
  id: number;
  gameName: string;
  imageUrl: string;
  href: string;
};

const ORIGIN = "https://www.supersportbet.com";

export const toSupersportAbsoluteUrl = (pathOrUrl: string): string => {
  const t = pathOrUrl.trim();
  if (!t) return ORIGIN;
  if (/^https?:\/\//i.test(t)) return t;
  return `${ORIGIN}${t.startsWith("/") ? "" : "/"}${t}`;
};

const pickImageUrl = (attrs: unknown): string | null => {
  if (!attrs || typeof attrs !== "object") return null;
  const a = attrs as Record<string, unknown>;
  const formats = a.formats;
  if (formats && typeof formats === "object") {
    const thumb = (formats as Record<string, unknown>).thumbnail;
    if (thumb && typeof thumb === "object") {
      const u = (thumb as Record<string, unknown>).url;
      if (typeof u === "string" && u.length > 0) return u;
    }
  }
  if (typeof a.url === "string" && a.url.length > 0) return a.url;
  return null;
};

export const parseHomepageGamesWidget = (raw: unknown): HomepageGameCard[] => {
  if (!raw || typeof raw !== "object") return [];
  const widget = (raw as { homepageGamesWidget?: { enabled?: boolean; games?: unknown } }).homepageGamesWidget;
  if (!widget || widget.enabled === false) return [];
  const games = widget.games;
  if (!Array.isArray(games)) return [];

  const out: HomepageGameCard[] = [];

  for (const g of games) {
    if (!g || typeof g !== "object") continue;
    const row = g as Record<string, unknown>;
    if (row.enabled === false) continue;

    const imgAttrs = (row.gameImage as { data?: { attributes?: unknown } } | undefined)?.data?.attributes;
    const imageUrl = pickImageUrl(imgAttrs);
    if (!imageUrl) continue;

    const gameName = typeof row.gameName === "string" ? row.gameName : "Game";
    const id = typeof row.id === "number" ? row.id : out.length;
    const redirect = typeof row.redirectUrl === "string" ? row.redirectUrl : "";
    const href = redirect ? toSupersportAbsoluteUrl(redirect) : ORIGIN;

    out.push({ id, gameName, imageUrl, href });
  }

  return out;
};
