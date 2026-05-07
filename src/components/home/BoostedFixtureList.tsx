"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { Brand } from "@/types/brand";
import type { BoostedFixtureUi } from "@/lib/offerPrematch";
import { fetchBoostedPrematch, PrematchBoostedClientError } from "@/lib/offerPrematchBoostedClient";

const PAGE_SIZE = 5;

/** Same row model as Featured Matches ([PrematchFixtureList.tsx](PrematchFixtureList.tsx)) */
const ROW_FLEX_HEADER = "flex flex-row flex-nowrap items-center gap-x-1.5 px-2 py-2.5";
const ROW_FLEX_FIXTURE = "flex flex-row flex-nowrap items-start gap-x-1.5 px-2 py-2.5";
const LEFT_COL = "min-w-0 flex-1 pr-1";
const ODDS_CLUSTER = "flex shrink-0 items-center gap-x-1.5";
const ODDS_SLOT = "flex w-[3.5rem] shrink-0 items-center justify-center min-w-0";
const GHOST_ODDS_SHELL =
  "rounded-full shrink-0 px-1.5 py-1 flex items-center justify-center border border-transparent min-w-0";

const DATE_UNKNOWN = "__unknown";

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

function splitFixtureName(s: string): [string, string] | null {
  const m = s.match(/^(.+?)\s+-\s+(.+)$/);
  return m ? [m[1].trim(), m[2].trim()] : null;
}

function calendarDateKey(fx: BoostedFixtureUi): string {
  if (!fx.eventStart) return DATE_UNKNOWN;
  return fx.eventStart.slice(0, 10);
}

function dateHeaderLabel(dateKey: string): string {
  if (dateKey === DATE_UNKNOWN) return "Date TBD";
  const d = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "Date TBD";
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const dayMonth = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return `${weekday}, ${dayMonth}`;
}

function compareBoostedEventStart(a: BoostedFixtureUi, b: BoostedFixtureUi): number {
  if (!a.eventStart && !b.eventStart) return 0;
  if (!a.eventStart) return 1;
  if (!b.eventStart) return -1;
  return a.eventStart.localeCompare(b.eventStart);
}

function groupBoostedByCalendarDate(fixtures: BoostedFixtureUi[]): { dateKey: string; items: BoostedFixtureUi[] }[] {
  const sorted = [...fixtures].sort(compareBoostedEventStart);
  const byKey = new Map<string, BoostedFixtureUi[]>();
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

type BoostedFixtureListProps = {
  brand: Brand;
};

export const BoostedFixtureList = ({ brand }: BoostedFixtureListProps) => {
  const isBk = brand === "bk";
  const accentBg = isBk ? "#1a2b6b" : "#1a2db8";
  const accentSoft = isBk ? "#00d8c8" : "#FFCD00";
  const textDeep = isBk ? "#003030" : "#0d1580";
  const pillBg = "#dbeafe";
  const dateBarBg = "#ede9fe";
  const dateBarText = "#312e81";

  const [fixtures, setFixtures] = useState<BoostedFixtureUi[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    setFixtures(null);
    setPage(1);

    const run = async () => {
      try {
        const res = await fetchBoostedPrematch();
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(res.error ?? `API ${res.status}`);
          setFixtures(res.fixtures ?? []);
          return;
        }
        setFixtures(res.fixtures);
      } catch (e) {
        if (cancelled) return;
        setLoadError(
          e instanceof PrematchBoostedClientError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Network error"
        );
        setFixtures([]);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil((fixtures?.length ?? 0) / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    if (!fixtures) return [];
    return fixtures.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [fixtures, safePage]);

  const dateGroups = useMemo(() => groupBoostedByCalendarDate(pageSlice), [pageSlice]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  return (
    <div className="shrink-0 rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="boosted-matches-panel"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-2 border-b border-black/5 text-left cursor-pointer hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/40 transition-colors"
        style={{ background: `linear-gradient(135deg, ${accentBg}, ${isBk ? "#0d1a3a" : "#0d1580"})` }}
      >
        <span className="text-[15px] leading-none shrink-0 text-white" aria-hidden>
          <BoostBolt className="inline-block w-[14px] h-[14px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div id="boosted-matches-heading" className="text-[12px] font-extrabold text-white">
            Boosted
          </div>
          <div className="text-[9px] text-white/70 mt-0.5">Enhanced odds — limited time</div>
        </div>
        <svg
          className={`shrink-0 w-4 h-4 text-white/85 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 4.5L6 8l4-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id="boosted-matches-panel"
        role="region"
        aria-labelledby="boosted-matches-heading"
        hidden={!expanded}
        className="py-3 px-0"
      >
        {loadError && (
          <div className="text-[11px] text-amber-900/90 bg-amber-50 rounded-lg mx-3 px-3 py-2 border border-amber-100 mb-2">
            Could not load boosted matches: {loadError}
          </div>
        )}

        {fixtures === null && !loadError && (
          <div className="text-[11px] text-gray-500 px-3 py-2 animate-pulse">Loading boosts…</div>
        )}

        {fixtures !== null && fixtures.length === 0 && !loadError && (
          <div className="text-[11px] text-gray-500 px-3 py-2">No boosted matches right now.</div>
        )}

        {fixtures !== null && fixtures.length > 0 && (
          <>
            <div className="divide-y divide-gray-100 border-y border-gray-100/90">
              {dateGroups.map(({ dateKey, items }) => (
                <div key={dateKey}>
                  <div className={ROW_FLEX_HEADER} style={{ backgroundColor: dateBarBg }}>
                    <div
                      className={`${LEFT_COL} text-[11px] font-extrabold tracking-tight leading-tight whitespace-normal break-words`}
                      style={{ color: dateBarText }}
                    >
                      {dateHeaderLabel(dateKey)}
                    </div>
                  </div>

                  <ul className="list-none divide-y divide-gray-100 bg-white">
                    {items
                      .filter((fx): fx is BoostedFixtureUi & { market: NonNullable<BoostedFixtureUi["market"]> } =>
                        Boolean(fx.market)
                      )
                      .map((fx) => {
                      const homeAway = splitFixtureName(fx.fixtureName);

                      return (
                        <Fragment key={fx.fixtureKey}>
                          <li>
                            <div className={`${ROW_FLEX_HEADER} bg-white`}>
                              <div
                                className={`${LEFT_COL} text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate`}
                              >
                                {fx.market.name}
                              </div>
                              <div className={ODDS_CLUSTER}>
                                {fx.market.selections.map((s, i) => (
                                  <div key={i} className={ODDS_SLOT}>
                                    <div
                                      className={`${GHOST_ODDS_SHELL} text-[10px] font-extrabold tabular-nums text-slate-500`}
                                    >
                                      {s.name}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                          <li className={`${ROW_FLEX_FIXTURE} bg-white`}>
                            <div className={LEFT_COL}>
                              {homeAway ? (
                                <>
                                  <div className="text-[11px] font-bold text-[#1a1a2e] leading-snug break-words">
                                    {homeAway[0]}
                                  </div>
                                  <div className="text-[11px] font-semibold text-slate-600 leading-snug break-words">
                                    {homeAway[1]}
                                  </div>
                                </>
                              ) : (
                                <div className="text-[11px] font-bold text-[#1a1a2e] leading-snug break-words">
                                  {fx.fixtureName}
                                </div>
                              )}
                              <div className="text-[9px] font-semibold text-slate-500 mt-0.5 truncate">
                                {fx.competitionName}
                              </div>
                            </div>
                            <div className={ODDS_CLUSTER}>
                              {fx.market.selections.map((sel, i) => (
                                <div key={i} className={ODDS_SLOT}>
                                  <div className="flex flex-col items-center gap-0.5 min-w-0">
                                    <div
                                      title={
                                        sel.boosted && sel.original
                                          ? `Boosted from ${sel.original} to ${sel.price}`
                                          : undefined
                                      }
                                      className="rounded-full max-w-full shrink-0 px-1.5 py-1 text-center flex items-center justify-center gap-0.5 min-w-0 shadow-sm border border-sky-200/60"
                                      style={{ backgroundColor: pillBg }}
                                    >
                                      {sel.boosted && <BoostBolt className="shrink-0 text-amber-500" />}
                                      <span
                                        className="text-[11px] font-extrabold tabular-nums truncate min-w-0"
                                        style={{ color: textDeep }}
                                      >
                                        {sel.price}
                                      </span>
                                    </div>
                                    {sel.boosted && sel.original ? (
                                      <span className="text-[9px] font-semibold tabular-nums text-gray-500 line-through leading-none">
                                        {sel.original}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </li>
                        </Fragment>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
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
          </>
        )}
      </div>

      <div
        className="h-1 w-full opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentSoft}, transparent)` }}
      />
    </div>
  );
};
