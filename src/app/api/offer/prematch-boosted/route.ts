import { NextResponse } from "next/server";
import { extractBoostedFixtures, type BoostedFixtureUi } from "@/lib/offerPrematch";

const DEFAULT_BASE =
  "https://st-feeds-offer-api-int.kingmakers.tech/api/offer-api/v1/fixtures/prematch/boosted";

function upstreamBoostedUrl(): string {
  const base = (process.env.OFFER_API_PREMATCH_BOOSTED_BASE_URL ?? DEFAULT_BASE).trim().replace(/\/$/, "");
  const areaId = process.env.OFFER_API_AREA_ID ?? "1572";
  const params = new URLSearchParams({
    SportId: "1",
    DateFilterType: "2",
    DateFilterRange: "14",
    PageSize: "50",
    PageNumber: "1",
    SortByPopularity: "true",
    AreaId: areaId,
  });
  return `${base}?${params.toString()}`;
}

export type PrematchBoostedResult = {
  ok: boolean;
  status: number;
  fixtures: BoostedFixtureUi[];
  error?: string;
};

export async function GET() {
  const url = upstreamBoostedUrl();
  const auth = process.env.OFFER_API_AUTHORIZATION;

  const headers: HeadersInit = { Accept: "application/json" };
  if (auth) {
    headers.Authorization =
      auth.startsWith("Bearer ") || auth.startsWith("Basic ") ? auth : `Bearer ${auth}`;
  }

  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    const fixtures = json ? extractBoostedFixtures(json) : [];

    if (!res.ok) {
      const body: PrematchBoostedResult = {
        ok: false,
        status: res.status,
        fixtures,
        error: text.slice(0, 280) || res.statusText,
      };
      return NextResponse.json(body, { status: 200 });
    }

    return NextResponse.json({
      ok: true,
      status: res.status,
      fixtures,
    } satisfies PrematchBoostedResult);
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        status: 0,
        fixtures: [],
        error: e instanceof Error ? e.message : "Request failed",
      } satisfies PrematchBoostedResult,
      { status: 200 }
    );
  }
}
