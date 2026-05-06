import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractPrematchFixtures, type PrematchFixtureUi } from "@/lib/offerPrematch";

const querySchema = z.object({
  competitionIds: z
    .string()
    .min(1)
    .transform((s) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => Number.parseInt(x, 10))
    )
    .refine((ids) => ids.length > 0 && ids.every((id) => Number.isFinite(id) && id > 0), {
      message: "Invalid competition IDs",
    }),
});

const DEFAULT_BASE =
  "https://st-feeds-offer-api-int.int.kingmakers.tech/api/offer-api/v1/fixtures/prematch";

function upstreamUrlForCompetition(competitionId: number): string {
  const base = (process.env.OFFER_API_PREMATCH_BASE_URL ?? DEFAULT_BASE).trim().replace(/\/$/, "");
  const areaId = process.env.OFFER_API_AREA_ID ?? "1572";
  const params = new URLSearchParams({
    SportId: "1",
    DateFilterType: "2",
    DateFilterRange: "30",
    PageSize: "400",
    PageNumber: "1",
    CompetitionIds: String(competitionId),
    AreaId: areaId,
  });
  return `${base}?${params.toString()}`;
}

export type PrematchCompetitionResult = {
  competitionId: number;
  ok: boolean;
  status: number;
  fixtures: PrematchFixtureUi[];
  error?: string;
};

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("competitionIds");
  const parsed = querySchema.safeParse({ competitionIds: raw ?? "" });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "competitionIds query param required (comma-separated positive integers)" },
      { status: 400 }
    );
  }

  const ids = parsed.data.competitionIds;
  const auth = process.env.OFFER_API_AUTHORIZATION;

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (auth) {
    headers.Authorization =
      auth.startsWith("Bearer ") || auth.startsWith("Basic ") ? auth : `Bearer ${auth}`;
  }

  const settled = await Promise.allSettled(
    ids.map(async (competitionId): Promise<PrematchCompetitionResult> => {
      const url = upstreamUrlForCompetition(competitionId);
      const res = await fetch(url, { headers, cache: "no-store" });
      const text = await res.text();
      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      const fixtures = json ? extractPrematchFixtures(json) : [];

      if (!res.ok) {
        return {
          competitionId,
          ok: false,
          status: res.status,
          fixtures,
          error: text.slice(0, 280) || res.statusText,
        };
      }

      return {
        competitionId,
        ok: true,
        status: res.status,
        fixtures,
      };
    })
  );

  const results: PrematchCompetitionResult[] = settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      competitionId: ids[i],
      ok: false,
      status: 0,
      fixtures: [],
      error: String(r.reason ?? "Request failed"),
    };
  });

  return NextResponse.json({ results });
}
