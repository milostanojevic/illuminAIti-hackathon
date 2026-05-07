"use client";

import { useEffect, useMemo, useState } from "react";
import type { Brand, ProviderKey } from "@/types/brand";
import { useOnboarding } from "@/state/OnboardingContext";
import { BK_GAMES, GAME_COLORS } from "@/lib/data/bkGames";
import { PROVIDER_LABELS } from "@/lib/data/providers";

const PAGE_SIZE = 6;

type BucketKey = ProviderKey | "other";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function isKnownProviderKey(x: string): x is ProviderKey {
  return x in PROVIDER_LABELS;
}

type HomeCasinoWidgetProps = {
  brand: Brand;
};

export const HomeCasinoWidget = ({ brand }: HomeCasinoWidgetProps) => {
  const { state } = useOnboarding();
  const isBk = brand === "bk";
  const accentBg = isBk ? "#1a2b6b" : "#1a2db8";
  const accentSoft = isBk ? "#00d8c8" : "#FFCD00";

  const sortedGameNames = useMemo(() => {
    if (isBk) return [...state.casinoGames];
    const order = new Map(state.providers.map((k, i) => [k, i]));
    const rank = (name: string) => {
      const p = state.ssGameProviders[name];
      if (p !== undefined && order.has(p)) return order.get(p)!;
      return 98;
    };
    return [...state.ssGames].sort((a, b) => rank(a) - rank(b));
  }, [isBk, state.casinoGames, state.providers, state.ssGames, state.ssGameProviders]);

  const gameNamesKey = useMemo(() => sortedGameNames.join("|"), [sortedGameNames]);
  const hasGames = sortedGameNames.length > 0;

  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(sortedGameNames.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageNames = useMemo(
    () => sortedGameNames.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedGameNames, safePage]
  );

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    setPage(1);
  }, [gameNamesKey]);

  const buckets = useMemo(() => {
    if (isBk) return [] as { providerKey: BucketKey; names: string[] }[];
    const out: { providerKey: BucketKey; names: string[] }[] = [];
    for (const name of pageNames) {
      const raw = state.ssGameProviders[name];
      const k: BucketKey =
        raw !== undefined && isKnownProviderKey(raw) ? raw : "other";
      const last = out[out.length - 1];
      if (last && last.providerKey === k) last.names.push(name);
      else out.push({ providerKey: k, names: [name] });
    }
    return out;
  }, [isBk, pageNames, state.ssGameProviders]);

  return (
    <div className="shrink-0 rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="home-casino-panel"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 border-b border-black/5 text-left cursor-pointer hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/40 transition-colors"
        style={{ background: `linear-gradient(135deg, ${accentBg}, ${isBk ? "#0d1a3a" : "#0d1580"})` }}
      >
        <span className="text-base leading-none shrink-0" aria-hidden>
          🎰
        </span>
        <div className="min-w-0 flex-1">
          <div id="home-casino-heading" className="text-xs sm:text-[13px] font-extrabold text-white">
            Casino
          </div>
          <div className="text-[9px] sm:text-[10px] text-white/70 mt-0.5">
            {hasGames
              ? `${sortedGameNames.length} game${sortedGameNames.length !== 1 ? "s" : ""} pinned`
              : "Slots, live games & more"}
          </div>
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
        id="home-casino-panel"
        role="region"
        aria-labelledby="home-casino-heading"
        hidden={!expanded}
        className="px-3 py-2.5 sm:px-4 sm:py-3"
      >
        {!hasGames && (
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] text-gray-500 leading-snug">Pick games during onboarding to pin them here.</div>
            <button
              type="button"
              className="border-none rounded-lg px-2.5 py-1.5 text-[11px] font-semibold cursor-pointer shrink-0"
              style={{ background: "rgba(13,21,128,0.12)", color: "#0d1580" }}
            >
              Play
            </button>
          </div>
        )}

        {hasGames && isBk && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {pageNames.map((name) => {
                const meta = BK_GAMES.find((g) => g.name === name);
                const bkBg =
                  meta?.bg ??
                  GAME_COLORS[name as keyof typeof GAME_COLORS] ??
                  "linear-gradient(135deg,#64748b,#334155)";

                return (
                  <div
                    key={name}
                    className="relative rounded-lg border border-gray-100 overflow-hidden aspect-square min-h-0"
                  >
                    <div className="absolute inset-0" style={{ background: bkBg }} />
                    <div className="absolute inset-x-0 bottom-0 z-[2] bg-black/55 px-1 py-0.5">
                      <span className="text-[8px] font-semibold text-white leading-tight line-clamp-2 block text-center">
                        {name}
                      </span>
                    </div>
                    {meta?.tag ? (
                      <span
                        className="absolute top-0.5 right-0.5 z-[2] text-[6px] px-1 py-0.5 rounded font-bold text-white"
                        style={{ background: meta.tagColor }}
                      >
                        {meta.tag}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2.5 mt-1 border-t border-gray-100">
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

        {hasGames && !isBk && (
          <>
            <div className="space-y-3">
              {buckets.map((bucket, bi) => (
                <section key={`${bucket.providerKey}-${bi}-${bucket.names.join("\0")}`} className="min-w-0">
                  <div className="text-[10px] font-bold text-ss-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    {bucket.providerKey === "other" ? "Other" : PROVIDER_LABELS[bucket.providerKey]}
                    <span className="flex-1 h-px bg-[#e8e8f0]" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {bucket.names.map((name) => {
                      const thumb = state.ssGameThumbs[name] ?? "";
                      const ssFallbackBg = "linear-gradient(135deg,#475569,#1e293b)";

                      return (
                        <div
                          key={name}
                          className="relative rounded-lg border border-gray-100 overflow-hidden aspect-square min-h-0"
                        >
                          {thumb ? (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-[10px] font-bold text-white/80">
                                {initials(name)}
                              </div>
                              <img
                                src={thumb}
                                alt=""
                                className="absolute inset-0 z-[1] w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                                }}
                              />
                            </>
                          ) : (
                            <div className="absolute inset-0" style={{ background: ssFallbackBg }} />
                          )}
                          <div className="absolute inset-x-0 bottom-0 z-[2] bg-black/55 px-1 py-0.5">
                            <span className="text-[8px] font-semibold text-white leading-tight line-clamp-2 block text-center">
                              {name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2.5 mt-1 border-t border-gray-100">
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
