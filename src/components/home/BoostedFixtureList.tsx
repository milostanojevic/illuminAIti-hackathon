"use client";

import { useEffect, useMemo, useState } from "react";
import type { Brand } from "@/types/brand";
import type { BoostedFixtureUi } from "@/lib/offerPrematch";
import { fetchBoostedPrematch, PrematchBoostedClientError } from "@/lib/offerPrematchBoostedClient";

const PAGE_SIZE = 5;

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

function formatKickoff(iso: string | null): string {
  if (!iso) return "Kick-off TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Kick-off TBD";
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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
            <ul className="divide-y divide-gray-100 border-y border-gray-100/90">
              {pageSlice.map((fx) => (
                <li key={fx.fixtureKey} className="px-3 py-3 bg-white">
                  <div className="text-[12px] font-extrabold text-[#1a1a2e] leading-snug break-words">{fx.fixtureName}</div>
                  <div className="text-[9px] font-semibold text-slate-600 mt-0.5">
                    {[fx.competitionName, fx.categoryName].filter(Boolean).join(" · ")}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-0.5">{formatKickoff(fx.eventStart)}</div>

                  {fx.market ? (
                    <>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#1a1a2e] mt-2.5 mb-1.5">
                        {fx.market.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {fx.market.selections.map((sel, i) => (
                          <div key={`${fx.fixtureKey}-${i}-${sel.name}`} className="flex flex-col items-center gap-0.5 min-w-0">
                            <div
                              title={
                                sel.boosted && sel.original
                                  ? `Boosted from ${sel.original} to ${sel.price}`
                                  : undefined
                              }
                              className="rounded-full max-w-full shrink-0 px-2 py-1 flex items-center justify-center gap-0.5 min-w-0 shadow-sm border border-sky-200/60"
                              style={{ backgroundColor: pillBg }}
                            >
                              {sel.boosted && <BoostBolt className="shrink-0 text-amber-500" />}
                              <span
                                className="text-[10px] font-extrabold tabular-nums truncate min-w-0"
                                style={{ color: textDeep }}
                              >
                                <span>{sel.name}</span>
                                <span className="mx-0.5 opacity-70">·</span>
                                <span>{sel.price}</span>
                              </span>
                            </div>
                            {sel.boosted && sel.original ? (
                              <span className="text-[9px] font-semibold tabular-nums text-gray-500 line-through leading-none">
                                {sel.original}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>

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
