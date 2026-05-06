import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PROVIDER_API_SLUG } from "@/lib/data/providers";
import type { ProviderKey } from "@/types/brand";

const PROVIDER_KEYS = Object.keys(PROVIDER_API_SLUG) as ProviderKey[];

const querySchema = z.object({
  providers: z
    .string()
    .min(1)
    .transform((s) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter((x): x is ProviderKey => (PROVIDER_KEYS as readonly string[]).includes(x))
    )
    .refine((arr) => arr.length > 0, { message: "providers required" }),
});

const BASE = "https://betking-cms-prod.kingmakers.tech/api/casino-games";

export type CasinoGame = {
  name: string;
  slug: string;
  thumbnailUrl: string;
  providerKey: ProviderKey;
  providerName: string;
};

export type CasinoGamesProviderResult = {
  providerKey: ProviderKey;
  ok: boolean;
  status: number;
  games: CasinoGame[];
  error?: string;
};

function extractGames(json: unknown, key: ProviderKey): CasinoGame[] {
  if (!json || typeof json !== "object" || !("data" in (json as Record<string, unknown>))) return [];
  const data = (json as { data: unknown }).data;
  if (!Array.isArray(data)) return [];
  const out: CasinoGame[] = [];
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const a = (row as { attributes?: Record<string, unknown> }).attributes;
    if (!a) continue;
    const name = typeof a.name === "string" ? a.name : "";
    const thumb = typeof a.thumbnailUrl === "string" ? a.thumbnailUrl : "";
    const slug = typeof a.slug === "string" ? a.slug : name;
    const providerName = typeof a.providerName === "string" ? a.providerName : PROVIDER_API_SLUG[key];
    if (!name) continue;
    out.push({ name, slug, thumbnailUrl: thumb, providerKey: key, providerName });
  }
  return out;
}

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    providers: request.nextUrl.searchParams.get("providers") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "providers query param required (comma-separated provider keys)" },
      { status: 400 }
    );
  }

  const providers = Array.from(new Set(parsed.data.providers));

  const settled = await Promise.allSettled(
    providers.map(async (key): Promise<CasinoGamesProviderResult> => {
      const slug = PROVIDER_API_SLUG[key];
      const url = `${BASE}?filters[providerName]=${encodeURIComponent(slug)}&pagination[pageSize]=100&pagination[page]=1`;
      const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
      const text = await res.text();
      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }
      const games = extractGames(json, key);
      if (!res.ok) {
        return {
          providerKey: key,
          ok: false,
          status: res.status,
          games: [],
          error: text.slice(0, 280) || res.statusText,
        };
      }
      return { providerKey: key, ok: true, status: res.status, games };
    })
  );

  const results: CasinoGamesProviderResult[] = settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      providerKey: providers[i],
      ok: false,
      status: 0,
      games: [],
      error: String(r.reason ?? "Request failed"),
    };
  });

  return NextResponse.json({ results });
}
