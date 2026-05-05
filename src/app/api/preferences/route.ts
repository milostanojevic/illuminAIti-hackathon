import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const preferencesSchema = z.object({
  user_id: z.string().optional(),
  brand: z.enum(["bk", "ss"]),
  leagues: z.array(z.string()),
  teams: z.array(z.string()),
  casinoGames: z.array(z.string()),
  providers: z.array(z.string()),
  ssGames: z.array(z.string()),
  risk: z.enum(["low", "high"]).nullable(),
  session: z.enum(["quick", "long"]).nullable(),
  promos: z.array(z.string()),
});

type SelectionKind = "league" | "team" | "casino_game" | "provider" | "ss_game" | "promo";

const arrayToRows = (
  preferenceId: string,
  kind: SelectionKind,
  keys: string[]
) =>
  keys.map((key, i) => ({
    preference_id: preferenceId,
    kind,
    key,
    rank: i,
  }));

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = preferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const userId = data.user_id ?? crypto.randomUUID();
  const supabase = await createClient();

  const { data: pref, error: upsertError } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: userId,
        brand: data.brand,
        risk: data.risk,
        session: data.session,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (upsertError || !pref) {
    return NextResponse.json(
      { error: upsertError?.message ?? "upsert failed" },
      { status: 500 }
    );
  }

  const preferenceId = pref.id as string;

  const { error: deleteError } = await supabase
    .from("user_preference_selections")
    .delete()
    .eq("preference_id", preferenceId);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  const rows = [
    ...arrayToRows(preferenceId, "league", data.leagues),
    ...arrayToRows(preferenceId, "team", data.teams),
    ...arrayToRows(preferenceId, "casino_game", data.casinoGames),
    ...arrayToRows(preferenceId, "provider", data.providers),
    ...arrayToRows(preferenceId, "ss_game", data.ssGames),
    ...arrayToRows(preferenceId, "promo", data.promos),
  ];

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("user_preference_selections")
      .insert(rows);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    userId,
    preferenceId,
  });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "user_id query param required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: pref, error: prefError } = await supabase
    .from("user_preferences")
    .select("*, user_preference_selections(*)")
    .eq("user_id", userId)
    .single();

  if (prefError || !pref) {
    return NextResponse.json(
      { error: prefError?.message ?? "not found" },
      { status: 404 }
    );
  }

  const selections = (pref.user_preference_selections ?? []) as {
    kind: string;
    key: string;
    rank: number | null;
  }[];

  const grouped = selections.reduce<Record<string, string[]>>(
    (acc, s) => {
      (acc[s.kind] ??= []).push(s.key);
      return acc;
    },
    {}
  );

  return NextResponse.json({
    userId: pref.user_id,
    brand: pref.brand,
    leagues: grouped["league"] ?? [],
    teams: grouped["team"] ?? [],
    casinoGames: grouped["casino_game"] ?? [],
    providers: grouped["provider"] ?? [],
    ssGames: grouped["ss_game"] ?? [],
    risk: pref.risk,
    session: pref.session,
    promos: grouped["promo"] ?? [],
  });
}
