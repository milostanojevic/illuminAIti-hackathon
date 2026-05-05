"use client";

import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { buildTrendingCards } from "@/lib/trending";
import { LeagueChips } from "./LeagueChips";
import { HomeCTA } from "./HomeCTA";
import { TrendingCarousel } from "./TrendingCarousel";

export const HomeShell = () => {
  const { state } = useOnboarding();
  const brand = state.brand ?? "bk";
  const isBk = brand === "bk";

  const preferredTeam = state.teams.length > 0 ? state.teams[0] : "your team";
  const preferredLeague = state.leagues.length > 0 ? LEAGUE_NAMES[state.leagues[0]] : "top football";
  const preferredGame = isBk
    ? (state.casinoGames.length > 0 ? state.casinoGames[0] : "Aviator")
    : (state.ssGames.length > 0 ? state.ssGames[0] : "Aviator");

  const trendingCards = buildTrendingCards(brand, preferredTeam, preferredLeague, preferredGame);

  return (
    <div className="flex flex-col bg-[#f5f6fa]">
      <div
        className="px-3.5 pt-3.5 pb-3"
        style={{ background: isBk ? "#1a2b6b" : "#1a2db8" }}
      >
        <div className="flex items-center justify-between mb-2.5">
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

      <div className="p-3 flex flex-col gap-2.5">
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

        <HomeCTA
          icon="🎰"
          title="Casino"
          subtitle="Slots, live games & more"
          buttonLabel="Play"
          bg={isBk ? "#1a2b6b" : "#1a2db8"}
        />

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

        <TrendingCarousel cards={trendingCards} />
      </div>
    </div>
  );
};
