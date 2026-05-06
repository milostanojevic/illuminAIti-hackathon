"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { buildPopularDefaultCards, buildTrendingCards } from "@/lib/trending";
import { isEffectivelyDefault } from "@/lib/storedPreferences";
import { LeagueChips } from "./LeagueChips";
import { HomeCTA } from "./HomeCTA";
import { TrendingCarousel } from "./TrendingCarousel";
import { PrematchFixtureList } from "./PrematchFixtureList";
import { HomeCasinoWidget } from "./HomeCasinoWidget";

export const HomeShell = () => {
  const { state } = useOnboarding();
  const brand = state.brand;
  const isBk = brand === "bk";

  const usePopularFallback = isEffectivelyDefault(state);

  const preferredTeam = state.teams.length > 0 ? state.teams[0] : "your team";
  const preferredLeague = state.leagues.length > 0 ? LEAGUE_NAMES[state.leagues[0]] : "top football";
  const preferredGame = isBk
    ? (state.casinoGames.length > 0 ? state.casinoGames[0] : "Aviator")
    : (state.ssGames.length > 0 ? state.ssGames[0] : "Aviator");

  const trendingCards = usePopularFallback
    ? buildPopularDefaultCards(brand)
    : buildTrendingCards(brand, preferredTeam, preferredLeague, preferredGame);

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full min-w-0 bg-[#f5f6fa]">
      <div
        className="flex-shrink-0 px-3 pt-3 pb-2.5 sm:px-4 sm:pt-4 sm:pb-3.5 md:px-5 md:pt-5 md:pb-4 w-full min-w-0"
        style={{ background: isBk ? "#1a2b6b" : "#1a2db8" }}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
          <div>
            <div className="text-[11px] text-white/60">Good morning 👋</div>
            <div className="text-base font-bold text-white">
              {isBk ? "BetKing" : "SuperSportBET"}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm">
            👤
          </div>
        </div>
        <LeagueChips leagues={state.leagues} />
      </div>

      <div className="scroll-touch flex flex-1 min-h-0 flex-col gap-2 sm:gap-3 md:gap-3.5 overflow-y-auto overflow-x-hidden overscroll-y-contain p-2.5 sm:p-3.5 md:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <HomeCTA
          icon="💳"
          title="Deposit now"
          subtitle="Top up your account"
          buttonLabel="Deposit"
          bg={isBk ? "#00d8c8" : "#FFCD00"}
          titleColor={isBk ? "#003030" : "#0d1580"}
          subtitleColor={isBk ? "rgba(0,48,48,0.72)" : "rgba(13,21,128,0.72)"}
          buttonBg={isBk ? "#003030" : "#0d1580"}
          buttonColor="#fff"
        />

        <HomeCasinoWidget brand={brand} />

        <HomeCTA
          icon="⚽"
          title="Sports"
          subtitle="Matches, markets & live odds"
          buttonLabel="Bet"
          bg={isBk ? "#c8102e" : "linear-gradient(135deg, #1a3dc8, #0d1580)"}
        />

        <HomeCTA
          icon="🎁"
          title="Promos"
          subtitle="Offers and rewards"
          buttonLabel="View"
          bg={isBk ? "#FFCD00" : "#00d8c8"}
          titleColor={isBk ? "#0d1580" : "#003030"}
          subtitleColor={isBk ? "rgba(13,21,128,0.72)" : "rgba(0,48,48,0.72)"}
          buttonBg={isBk ? "#0d1580" : "#003030"}
          buttonColor="#fff"
        />

        {state.leagues.length > 0 && (
          <PrematchFixtureList leagueKeys={state.leagues} brand={brand} favouriteTeams={state.teams} />
        )}

        <TrendingCarousel cards={trendingCards} />
      </div>
    </div>
  );
};
