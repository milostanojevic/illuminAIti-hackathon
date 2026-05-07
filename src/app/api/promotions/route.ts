import { NextRequest, NextResponse } from "next/server";

const SOURCE =
  "https://www.supersportbet.com/en-zm/promotions/all?_data=routes%2F%28%24locale%29.promotions.%28%24categorySlug%29._index";

/** Some hosts block default `fetch` user agents; mirror a normal browser for server-side calls. */
const UPSTREAM_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Accept-Language": "en-GB,en;q=0.9",
  Referer: "https://www.supersportbet.com/en-zm/promotions/all",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export type PromoCategoryKey = "freebets" | "freespins" | "cashback";

export type PromotionUi = {
  id: string;
  category: PromoCategoryKey;
  title: string;
  bannerImageUrl: string;
  shortDescription: string | null;
  ctaButtonText: string | null;
  ctaButtonLink: string | null;
};

export type PromotionsResponse = {
  freebets: PromotionUi[];
  freespins: PromotionUi[];
  cashback: PromotionUi[];
};

type RawBanner = {
  id?: number;
  slug?: string;
  title?: string;
  category?: string;
  bannerImageUrl?: string;
  shortDescription?: string | null;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
};

type RawPocket = { activePromotions?: RawBanner[]; availablePromotions?: RawBanner[] };

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const toUi = (raw: RawBanner, category: PromoCategoryKey): PromotionUi | null => {
  const title = (raw.title ?? "").trim();
  const banner = (raw.bannerImageUrl ?? "").trim();
  if (!title || !banner) return null;
  const idBase = raw.slug || (raw.id != null ? String(raw.id) : title);
  return {
    id: `${category}-${idBase}`,
    category,
    title,
    bannerImageUrl: banner,
    shortDescription: raw.shortDescription?.trim() || null,
    ctaButtonText: raw.ctaButtonText?.trim() || null,
    ctaButtonLink: raw.ctaButtonLink?.trim() || null,
  };
};

const flattenPocket = (p: RawPocket | undefined, category: PromoCategoryKey): PromotionUi[] => {
  if (!p) return [];
  const all = [...(p.activePromotions ?? []), ...(p.availablePromotions ?? [])];
  const seen = new Set<string>();
  const out: PromotionUi[] = [];
  for (const r of all) {
    const ui = toUi(r, category);
    if (!ui) continue;
    if (seen.has(ui.id)) continue;
    seen.add(ui.id);
    out.push(ui);
  }
  return out;
};

/** Pocket promos first, then extras; dedupe by `PromotionUi.id`. */
const mergeUniqueById = (a: PromotionUi[], b: PromotionUi[]): PromotionUi[] => {
  const seen = new Set<string>();
  const out: PromotionUi[] = [];
  for (const ui of [...a, ...b]) {
    if (seen.has(ui.id)) continue;
    seen.add(ui.id);
    out.push(ui);
  }
  return out;
};

export async function GET(req: NextRequest) {
  const noCache = req.nextUrl.searchParams.get("refresh") === "1";
  try {
    const res = await fetch(SOURCE, {
      headers: UPSTREAM_HEADERS,
      ...(noCache ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const json: unknown = await res.json();
    if (!isRecord(json)) {
      return NextResponse.json({ error: "Bad shape" }, { status: 502 });
    }

    const basics = Array.isArray(json.basicPromotions) ? (json.basicPromotions as RawBanner[]) : [];
    const sportsBasics = basics.filter((p) => (p.category ?? "").toLowerCase() === "sports");
    const gamesBasics = basics.filter((p) => (p.category ?? "").toLowerCase() === "games");

    const freespinPocket = isRecord(json.freespinPromotions)
      ? (json.freespinPromotions as RawPocket)
      : undefined;
    const betAndGetPocket = isRecord(json.betAndGetPromotions)
      ? (json.betAndGetPromotions as RawPocket)
      : undefined;

    const fromFreespinPocket = flattenPocket(freespinPocket, "freespins");
    const fromGames = gamesBasics
      .map((r) => toUi(r, "freespins"))
      .filter((x): x is PromotionUi => x !== null);

    const data: PromotionsResponse = {
      freebets: sportsBasics.map((r) => toUi(r, "freebets")).filter((x): x is PromotionUi => x !== null),
      freespins: mergeUniqueById(fromFreespinPocket, fromGames),
      cashback: flattenPocket(betAndGetPocket, "cashback"),
    };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Network error" }, { status: 502 });
  }
}
