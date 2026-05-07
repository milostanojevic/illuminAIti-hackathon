"use client";

import { useMemo } from "react";
import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { buildPopularDefaultCards, buildTrendingCards } from "@/lib/trending";
import { isEffectivelyDefault } from "@/lib/storedPreferences";
import { SuperSportBetLogo } from "@/components/ui/SuperSportBetLogo";
import { HomeDepositWidget } from "./HomeDepositWidget";
import { TrendingCarousel } from "./TrendingCarousel";
import { TrendingSportBetsCarousel } from "./TrendingSportBetsCarousel";
import { PrematchFixtureList } from "./PrematchFixtureList";
import { BoostedFixtureList } from "./BoostedFixtureList";
import { HomeCasinoWidget } from "./HomeCasinoWidget";
import { PromoCarousel } from "./PromoCarousel";
import { usePromotionsCatalog } from "@/hooks/usePromotionsCatalog";
import type { PromoCategoryKey, PromotionUi } from "@/app/api/promotions/route";

export const HomeShell = () => {
  const { state } = useOnboarding();
  const brand = state.brand;
  const isBk = brand === "bk";

  const hasCasinoSelections = isBk
    ? state.casinoGames.length > 0
    : state.ssGames.length > 0 || state.providers.length > 0;

  const showFreeBets = state.style.promos.includes("freebets");
  const showFreeSpins = state.style.promos.includes("freespins");
  const showCashback = state.style.promos.includes("cashback");
  const promoCatalogEnabled = showFreeBets || showFreeSpins || showCashback;
  const { data: promoData, loading: promoLoading, error: promoError, refresh: refreshPromos } =
    usePromotionsCatalog(promoCatalogEnabled);

  const selectedCategories = useMemo((): PromoCategoryKey[] => {
    const out: PromoCategoryKey[] = [];
    if (showFreeBets) out.push("freebets");
    if (showFreeSpins) out.push("freespins");
    if (showCashback) out.push("cashback");
    return out;
  }, [showFreeBets, showFreeSpins, showCashback]);

  const mergedPromotions = useMemo(() => {
    if (!promoData) return [];
    const out: PromotionUi[] = [];
    if (showFreeBets) out.push(...promoData.freebets);
    if (showFreeSpins) out.push(...promoData.freespins);
    if (showCashback) out.push(...promoData.cashback);
    return out;
  }, [promoData, showFreeBets, showFreeSpins, showCashback]);

  const usePopularFallback = isEffectivelyDefault(state);

  const preferredTeam = state.teams.length > 0 ? state.teams[0] : "your team";
  const preferredLeague = state.leagues.length > 0 ? LEAGUE_NAMES[state.leagues[0]] : "top football";
  const preferredGame = isBk
    ? (state.casinoGames.length > 0 ? state.casinoGames[0] : "Aviator")
    : (state.ssGames.length > 0 ? state.ssGames[0] : "Aviator");

  const trendingCards = usePopularFallback
    ? buildPopularDefaultCards(brand)
    : buildTrendingCards(brand, preferredTeam, preferredLeague, preferredGame);

  const showLiveTrendingBookingCodes = usePopularFallback && brand === "ss";

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full min-w-0 bg-[#f5f6fa]">
      <div
        className="flex-shrink-0 px-3 pt-3 pb-2.5 sm:px-4 sm:pt-4 sm:pb-3.5 md:px-5 md:pt-5 md:pb-4 w-full min-w-0"
        style={{ background: isBk ? "#1a2b6b" : "#1a2db8" }}
      >
        <div className="flex items-center justify-between">
          <div>
            {isBk ? (
              <div className="text-base font-bold text-white mb-0.5">BetKing</div>
            ) : (
              <SuperSportBetLogo height={22} alt="SuperSportBET" className="mb-1" />
            )}
            <div className="text-[11px] text-white/60">Good morning 👋</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm">
            👤
          </div>
        </div>
      </div>

      <div className="scroll-touch flex flex-1 min-h-0 flex-col gap-2 sm:gap-3 md:gap-3.5 overflow-y-auto overflow-x-hidden overscroll-y-contain p-2.5 sm:p-3.5 md:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <HomeDepositWidget brand={brand} />

        {hasCasinoSelections && <HomeCasinoWidget brand={brand} />}

        {state.leagues.length > 0 && (
          <PrematchFixtureList leagueKeys={state.leagues} brand={brand} favouriteTeams={state.teams} />
        )}

        {promoCatalogEnabled && (
          <PromoCarousel
            brand={brand}
            selectedCategories={selectedCategories}
            promotions={mergedPromotions}
            loading={promoLoading}
            error={promoError}
            onRefresh={refreshPromos}
          />
        )}

        {state.style.promos.includes("odds") && <BoostedFixtureList brand={brand} />}

        {showLiveTrendingBookingCodes ? (
          <TrendingSportBetsCarousel brand={brand} fallbackCards={trendingCards} />
        ) : (
          <TrendingCarousel cards={trendingCards} />
        )}
      </div>
    </div>
  );
};
