"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { PROVIDER_LABELS } from "@/lib/data/providers";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { goToNextPreferenceStep } from "@/lib/onboardingNav";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import type { CasinoGame, CasinoGamesProviderResult } from "@/app/api/casino/games/route";
import { fetchCasinoGamesByProviders, CasinoGamesClientError } from "@/lib/casinoGamesClient";

const PAGE_SIZE = 10;

function mergeGames(results: CasinoGamesProviderResult[]): CasinoGame[] {
  const seen = new Set<string>();
  const out: CasinoGame[] = [];
  for (const block of results) {
    if (!block.ok) continue;
    for (const g of block.games) {
      const k = g.name.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(g);
    }
  }
  return out;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const GameGrid = () => {
  const router = useRouter();
  const { state, toggleSSGameDetail } = useOnboarding();
  const brand = state.brand!;
  const hasSelection = state.ssGames.length > 0;

  const providersKey = useMemo(() => state.providers.join("|"), [state.providers]);

  const [games, setGames] = useState<CasinoGame[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [partialErrors, setPartialErrors] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    setPartialErrors([]);
    setGames(null);
    setPage(1);

    if (state.providers.length === 0) {
      setGames([]);
      return;
    }

    const run = async () => {
      try {
        const results = await fetchCasinoGamesByProviders(state.providers);
        if (cancelled) return;

        const errs = results
          .filter((r) => !r.ok && r.error)
          .map((r) => `${PROVIDER_LABELS[r.providerKey]}: ${r.error}`);
        setPartialErrors(errs);

        const merged = mergeGames(results);
        const order = new Map(state.providers.map((k, i) => [k, i]));
        merged.sort((a, b) => (order.get(a.providerKey) ?? 99) - (order.get(b.providerKey) ?? 99));
        setGames(merged);
      } catch (e) {
        if (cancelled) return;
        setLoadError(
          e instanceof CasinoGamesClientError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Network error"
        );
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [providersKey, state.providers]);

  const totalPages = Math.max(1, Math.ceil((games?.length ?? 0) / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    if (!games) return [];
    return games.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [games, safePage]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const handleContinue = () => {
    const next = getNextStep(brand, "games");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => goToNextPreferenceStep(router, brand, "games");

  const providerNames = state.providers.map((k) => PROVIDER_LABELS[k]).join(", ");

  const onClass = "border-ss-accent shadow-[0_0_0_1px_rgba(255,205,0,0.35)]";

  return (
    <OnboardingStepShell
      header={
        <ScreenHeader
          brand={brand}
          currentStep="games"
          title="Choose your games"
          subtitle={`Top picks from ${providerNames}.`}
          stepLabel="Games"
        />
      }
    >
      <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">Pin your favourite games</div>
      <div className="flex flex-wrap gap-[5px] mb-2">
        {state.providers.map((key) => (
          <div
            key={key}
            className="inline-flex items-center gap-1 border rounded-full px-2 py-[3px] text-[10px] bg-[#eef2ff] border-[#a0b0e8] text-ss-primary"
          >
            {PROVIDER_LABELS[key]}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-ss-primary mb-2.5">
        <span className="font-semibold">{state.ssGames.length}</span> game{state.ssGames.length !== 1 ? "s" : ""}{" "}
        selected
      </div>

      {loadError && (
        <div className="text-[11px] text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-100 mb-2">
          Could not load games: {loadError}
        </div>
      )}

      {partialErrors.length > 0 && !loadError && (
        <div className="text-[10px] text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
          {partialErrors.map((e) => (
            <div key={e} className="leading-snug">
              {e}
            </div>
          ))}
        </div>
      )}

      {!loadError && games === null && (
        <div className="text-[11px] text-gray-500 py-4 animate-pulse">Loading games…</div>
      )}

      {!loadError && games !== null && games.length === 0 && state.providers.length > 0 && (
        <div className="text-[11px] text-gray-500 py-2">No games returned for these providers.</div>
      )}

      {!loadError && games !== null && games.length > 0 && (
        <>
          <div className="space-y-3">
            {state.providers.map((providerKey) => {
              const cards = pageSlice.filter((g) => g.providerKey === providerKey);
              if (cards.length === 0) return null;
              return (
                <section key={providerKey} className="min-w-0">
                  <div className="text-[10px] font-bold text-ss-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    {PROVIDER_LABELS[providerKey]}
                    <span className="flex-1 h-px bg-[#e8e8f0]" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cards.map((g) => {
                      const isSelected = state.ssGames.includes(g.name);
                      const rowKey = `${g.providerKey}-${g.slug}`;
                      return (
                        <button
                          key={rowKey}
                          type="button"
                          onClick={() =>
                            toggleSSGameDetail({
                              name: g.name,
                              thumbnailUrl: g.thumbnailUrl,
                              providerKey: g.providerKey,
                            })
                          }
                          className={`relative rounded-lg border-[1.5px] overflow-hidden h-[88px] cursor-pointer ${
                            isSelected ? onClass : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 pointer-events-none">
                            <span className="text-lg font-black text-white/90 tracking-tight">{initials(g.name)}</span>
                          </div>
                          {g.thumbnailUrl ? (
                            <img
                              src={g.thumbnailUrl}
                              alt=""
                              className="absolute inset-0 z-[1] w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.opacity = "0";
                              }}
                            />
                          ) : null}
                          <div className="absolute inset-x-0 bottom-0 z-[2] bg-black/55 text-white text-[10px] font-semibold px-2 py-1 truncate text-left">
                            {g.name}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ss-accent flex items-center justify-center z-10">
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
                                <path
                                  d="M1 3l2 2 4-4"
                                  stroke="#0d1580"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-3 mt-1">
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

      <div className="h-px bg-gray-100 my-3.5" />
      <ContinueButton brand={brand} disabled={!hasSelection} onClick={handleContinue} />
      <GhostButton brand={brand} onClick={handleSkip} />
    </OnboardingStepShell>
  );
};
