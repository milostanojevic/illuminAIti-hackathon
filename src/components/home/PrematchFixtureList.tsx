"use client";

import { useEffect, useMemo, useState } from "react";
import type { Brand, LeagueKey } from "@/types/brand";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { competitionIdsFromLeagues, COMPETITION_ID_BY_LEAGUE } from "@/lib/competitionIds";
import type { PrematchFixtureUi } from "@/lib/offerPrematch";

type CompetitionBlock = {
  competitionId: number;
  leagueKey: LeagueKey;
  leagueLabel: string;
  ok: boolean;
  status: number;
  fixtures: PrematchFixtureUi[];
  error?: string;
};

type FlatFixture = { block: CompetitionBlock; fx: PrematchFixtureUi };

/** Client-side pagination: max events (fixtures) per page; headers are not counted. */
const PAGE_SIZE = 5;

const DATE_UNKNOWN = "__unknown";

function compareEventStart(a: PrematchFixtureUi, b: PrematchFixtureUi): number {
  if (!a.eventStart && !b.eventStart) return 0;
  if (!a.eventStart) return 1;
  if (!b.eventStart) return -1;
  return a.eventStart.localeCompare(b.eventStart);
}

function calendarDateKey(fx: PrematchFixtureUi): string {
  if (!fx.eventStart) return DATE_UNKNOWN;
  return fx.eventStart.slice(0, 10);
}

/** e.g. "Saturday, 24 August" */
function dateHeaderLabel(dateKey: string): string {
  if (dateKey === DATE_UNKNOWN) return "Date TBD";
  const d = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "Date TBD";
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const dayMonth = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return `${weekday}, ${dayMonth}`;
}

function groupFixturesByCalendarDate(
  fixtures: PrematchFixtureUi[]
): { dateKey: string; items: PrematchFixtureUi[] }[] {
  const sorted = [...fixtures].sort(compareEventStart);
  const byKey = new Map<string, PrematchFixtureUi[]>();
  const keyOrder: string[] = [];
  const seen = new Set<string>();

  for (const fx of sorted) {
    const k = calendarDateKey(fx);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(fx);
    if (!seen.has(k)) {
      seen.add(k);
      keyOrder.push(k);
    }
  }

  return keyOrder.map((dateKey) => ({ dateKey, items: byKey.get(dateKey) ?? [] }));
}

/** Date header row — vertically centers single-line label with ghost odds headers */
const ROW_FLEX_HEADER = "flex flex-row flex-nowrap items-center gap-x-1.5 px-2 py-2.5";
/** Fixture rows — top-align so multi-line team names are not clipped by vertical centering */
const ROW_FLEX_FIXTURE = "flex flex-row flex-nowrap items-start gap-x-1.5 px-2 py-2.5";
const LEFT_COL = "min-w-0 flex-1 pr-1";
const ODDS_CLUSTER = "flex shrink-0 items-center gap-x-1.5";

/** Fixed columns so header + rows share one odds block width (flex-1 left col stays consistent) */
const ODDS_SLOT = "flex w-[3.5rem] shrink-0 items-center justify-center min-w-0";

/** Mirrors real odds pill box model (no shadow — avoids optical drift vs ghost headers) */
const GHOST_ODDS_SHELL =
  "rounded-full shrink-0 px-1.5 py-1 flex items-center justify-center border border-transparent min-w-0";

const BoostBolt = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
  </svg>
);

export const PrematchFixtureList = ({
  leagueKeys,
  brand,
}: {
  leagueKeys: LeagueKey[];
  brand: Brand;
}) => {
  const isBk = brand === "bk";
  const accentBg = isBk ? "#1a2b6b" : "#1a2db8";
  const accentSoft = isBk ? "#00d8c8" : "#FFCD00";
  const textDeep = isBk ? "#003030" : "#0d1580";
  const pillBg = "#dbeafe";
  const dateBarBg = "#ede9fe";
  const dateBarText = "#312e81";

  const sectionKeys = useMemo(
    () => leagueKeys.filter((k, i) => leagueKeys.indexOf(k) === i),
    [leagueKeys]
  );

  const competitionIds = useMemo(() => competitionIdsFromLeagues(sectionKeys), [sectionKeys]);
  const fetchKey = useMemo(() => `${sectionKeys.join("|")}`, [sectionKeys]);

  const [blocks, setBlocks] = useState<CompetitionBlock[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadError(null);
      setPage(1);
      setBlocks(null);
      if (competitionIds.length === 0) {
        setBlocks([]);
        return;
      }

      try {
        const qs = encodeURIComponent(competitionIds.join(","));
        const res = await fetch(`/api/offer/prematch?competitionIds=${qs}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const payload: unknown = await res.json().catch(() => null);

        if (!res.ok) {
          const errMsg =
            typeof payload === "object" && payload !== null && "error" in payload
              ? String((payload as { error: unknown }).error)
              : res.statusText;
          if (!cancelled) setLoadError(errMsg || `Request failed (${res.status})`);
          return;
        }

        if (!payload || typeof payload !== "object" || !("results" in payload)) {
          if (!cancelled) setLoadError("Unexpected response");
          return;
        }

        const rawResults = (payload as { results: unknown }).results;
        if (!Array.isArray(rawResults)) {
          if (!cancelled) setLoadError("Unexpected response shape");
          return;
        }

        const byCompetition = new Map<
          number,
          { ok: boolean; status: number; fixtures: PrematchFixtureUi[]; error?: string }
        >();

        for (const row of rawResults) {
          if (typeof row !== "object" || row === null) continue;
          const r = row as Record<string, unknown>;
          const cid = Number(r.competitionId);
          if (!Number.isFinite(cid)) continue;
          const fixtures = Array.isArray(r.fixtures) ? (r.fixtures as PrematchFixtureUi[]) : [];
          byCompetition.set(cid, {
            ok: Boolean(r.ok),
            status: typeof r.status === "number" ? r.status : 0,
            fixtures,
            error: typeof r.error === "string" ? r.error : undefined,
          });
        }

        const next: CompetitionBlock[] = sectionKeys.map((leagueKey) => {
          const competitionId = COMPETITION_ID_BY_LEAGUE[leagueKey];
          const hit = byCompetition.get(competitionId);

          return {
            competitionId,
            leagueKey,
            leagueLabel: LEAGUE_NAMES[leagueKey],
            ok: hit?.ok ?? false,
            status: hit?.status ?? 0,
            fixtures: hit?.fixtures ?? [],
            error: hit?.error,
          };
        });

        if (!cancelled) setBlocks(next);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Network error");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by leagues selection only
  }, [fetchKey]);

  const flatFixtures = useMemo<FlatFixture[]>(() => {
    if (!blocks) return [];
    return blocks
      .flatMap((b) => b.fixtures.map((fx) => ({ block: b, fx })))
      .sort((a, b) => compareEventStart(a.fx, b.fx));
  }, [blocks]);

  const totalPages = Math.max(1, Math.ceil(flatFixtures.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = useMemo(
    () => flatFixtures.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [flatFixtures, safePage]
  );

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  if (sectionKeys.length === 0) return null;

  return (
    <div className="shrink-0 rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
      <div
        className="px-4 py-3 flex items-center gap-2 border-b border-black/5"
        style={{ background: `linear-gradient(135deg, ${accentBg}, ${isBk ? "#0d1a3a" : "#0d1580"})` }}
      >
        <span className="text-[15px] leading-none">⚽</span>
        <div>
          <div className="text-[12px] font-extrabold text-white">Your competitions</div>
          <div className="text-[9px] text-white/70 mt-0.5">Prematch — 1X2</div>
        </div>
      </div>

      <div className="py-3 space-y-4 px-0">
        {loadError && (
          <div className="text-[11px] text-red-700 bg-red-50 rounded-lg mx-3 px-3 py-2 border border-red-100">
            Could not load fixtures: {loadError}
          </div>
        )}

        {!loadError && blocks === null && (
          <div className="text-[11px] text-gray-500 px-3 py-2 animate-pulse">Loading events…</div>
        )}

        {blocks?.map((block) => {
          const pageFixtures = pageSlice
            .filter((row) => row.block.competitionId === block.competitionId)
            .map((row) => row.fx);

          if (pageFixtures.length > 0) {
            const dateGroups = groupFixturesByCalendarDate(pageFixtures);

            return (
              <section key={`${block.leagueKey}-${block.competitionId}`} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-2 px-3">
                  <h3 className="text-[12px] font-extrabold text-[#1a1a2e] truncate">{block.leagueLabel}</h3>
                  {!block.ok && (
                    <span className="text-[9px] text-amber-700 font-semibold whitespace-nowrap">
                      API {block.status || "—"}
                    </span>
                  )}
                </div>

                {!block.ok && block.error && (
                  <div className="text-[10px] text-amber-900/90 bg-amber-50 border border-amber-100 rounded-lg mx-3 px-3 py-1.5 mb-2 leading-snug break-words">
                    {block.error}
                  </div>
                )}

                <div className="divide-y divide-gray-100 border-y border-gray-100/90">
                  {dateGroups.map(({ dateKey, items }) => (
                    <div key={`${block.competitionId}-${dateKey}`}>
                      <div className={ROW_FLEX_HEADER} style={{ backgroundColor: dateBarBg }}>
                        <div
                          className={`${LEFT_COL} text-[11px] font-extrabold tracking-tight leading-tight whitespace-normal break-words`}
                          style={{ color: dateBarText }}
                        >
                          {dateHeaderLabel(dateKey)}
                        </div>
                        <div className={ODDS_CLUSTER}>
                          {(["1", "X", "2"] as const).map((h) => (
                            <div key={h} className={ODDS_SLOT}>
                              <div
                                className={`${GHOST_ODDS_SHELL} text-[10px] font-extrabold tabular-nums`}
                                style={{ color: dateBarText }}
                              >
                                {h}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <ul className="divide-y divide-gray-100 bg-white">
                        {items.map((fx) => (
                          <li key={`${block.competitionId}-${fx.fixtureKey}`} className={`${ROW_FLEX_FIXTURE} bg-white`}>
                            <div className={LEFT_COL}>
                              <div className="text-[11px] font-bold text-[#1a1a2e] leading-snug break-words">
                                {fx.homeTeam}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600 leading-snug break-words">
                                {fx.awayTeam}
                              </div>
                            </div>

                            {fx.oneXtwo ? (
                              <div className={ODDS_CLUSTER}>
                                {(
                                  [
                                    {
                                      price: fx.oneXtwo.priceHome,
                                      boosted: Boolean(fx.oneXtwo.boostHome),
                                    },
                                    {
                                      price: fx.oneXtwo.priceDraw,
                                      boosted: Boolean(fx.oneXtwo.boostDraw),
                                    },
                                    {
                                      price: fx.oneXtwo.priceAway,
                                      boosted: Boolean(fx.oneXtwo.boostAway),
                                    },
                                  ] as const
                                ).map((col, idx) => (
                                  <div key={idx} className={ODDS_SLOT}>
                                    <div
                                      title={col.boosted ? "Boosted odds" : undefined}
                                      className="rounded-full max-w-full shrink-0 px-1.5 py-1 text-center flex items-center justify-center gap-0.5 min-w-0 shadow-sm border border-sky-200/60"
                                      style={{ backgroundColor: pillBg }}
                                    >
                                      {col.boosted && <BoostBolt className="shrink-0 text-amber-500" />}
                                      <span
                                        className="text-[11px] font-extrabold tabular-nums truncate min-w-0"
                                        style={{ color: textDeep }}
                                      >
                                        {col.price}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="ml-auto shrink-0 py-1 text-right text-[9px] text-gray-500">
                                1X2 not available
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (safePage === 1 && block.fixtures.length === 0 && block.ok) {
            return (
              <section key={`${block.leagueKey}-${block.competitionId}`} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-2 px-3">
                  <h3 className="text-[12px] font-extrabold text-[#1a1a2e] truncate">{block.leagueLabel}</h3>
                </div>
                <div className="text-[10px] text-gray-500 italic px-3">No events returned for this league.</div>
              </section>
            );
          }

          if (safePage === 1 && !block.ok) {
            return (
              <section key={`${block.leagueKey}-${block.competitionId}`} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-2 px-3">
                  <h3 className="text-[12px] font-extrabold text-[#1a1a2e] truncate">{block.leagueLabel}</h3>
                  <span className="text-[9px] text-amber-700 font-semibold whitespace-nowrap">
                    API {block.status || "—"}
                  </span>
                </div>
                {block.error && (
                  <div className="text-[10px] text-amber-900/90 bg-amber-50 border border-amber-100 rounded-lg mx-3 px-3 py-1.5 mb-2 leading-snug break-words">
                    {block.error}
                  </div>
                )}
              </section>
            );
          }

          return null;
        })}
      </div>

      {!loadError && blocks !== null && totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-1 border-t border-gray-100">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-200 bg-white disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-[10px] font-semibold text-slate-600 tabular-nums">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-200 bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <div
        className="h-1 w-full opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentSoft}, transparent)` }}
      />
    </div>
  );
};
