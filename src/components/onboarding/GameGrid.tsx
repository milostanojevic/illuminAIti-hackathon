"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { SS_GAMES } from "@/lib/data/ssGames";
import { PROVIDER_LABELS } from "@/lib/data/providers";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { goToNextPreferenceStep } from "@/lib/onboardingNav";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import type { ProviderKey } from "@/types/brand";

type GameCardData = {
  name: string;
  bg: string;
  tag: string;
  icon: string;
};

const buildGamePool = (providers: ProviderKey[]): { popular: GameCardData[]; more: GameCardData[] } => {
  const pool: GameCardData[] = [];
  const seen = new Set<string>();

  providers.forEach((key) => {
    (SS_GAMES[key] ?? []).forEach((g) => {
      if (g.tag === "HOT" && !seen.has(g.name)) {
        seen.add(g.name);
        pool.push(g);
      }
    });
  });

  providers.forEach((key) => {
    (SS_GAMES[key] ?? []).forEach((g) => {
      if (!seen.has(g.name)) {
        seen.add(g.name);
        pool.push(g);
      }
    });
  });

  const capped = pool.slice(0, 10);
  return { popular: capped.slice(0, 4), more: capped.slice(4) };
};

export const GameGrid = () => {
  const router = useRouter();
  const { state, toggleSSGame } = useOnboarding();
  const brand = state.brand!;
  const hasSelection = state.ssGames.length > 0;
  const { popular, more } = buildGamePool(state.providers);

  const handleContinue = () => {
    const next = getNextStep(brand, "games");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => goToNextPreferenceStep(router, brand, "games");

  const providerNames = state.providers.map((k) => PROVIDER_LABELS[k]).join(", ");

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
        <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
          Pin your favourite games
        </div>
        <div className="flex flex-wrap gap-[5px] mb-2">
          {state.providers.map((key) => (
            <div key={key} className="inline-flex items-center gap-1 border rounded-full px-2 py-[3px] text-[10px] bg-[#eef2ff] border-[#a0b0e8] text-ss-primary">
              {PROVIDER_LABELS[key]}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-ss-primary mb-2.5">
          <span className="font-semibold">{state.ssGames.length}</span> game{state.ssGames.length !== 1 ? "s" : ""} selected
        </div>

        <div className="text-[10px] font-bold text-ss-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
          🔥 Popular games
          <span className="flex-1 h-px bg-[#e8e8f0]" />
        </div>
        <GameSection games={popular} selectedGames={state.ssGames} onToggle={toggleSSGame} />

        {more.length > 0 && (
          <>
            <div className="text-[10px] font-bold text-ss-primary uppercase tracking-wider mt-3 mb-2 flex items-center gap-1.5">
              More games
              <span className="flex-1 h-px bg-[#e8e8f0]" />
            </div>
            <GameSection games={more} selectedGames={state.ssGames} onToggle={toggleSSGame} />
          </>
        )}

        <div className="h-px bg-gray-100 my-3.5" />
        <ContinueButton brand={brand} disabled={!hasSelection} onClick={handleContinue} />
        <GhostButton brand={brand} onClick={handleSkip} />
    </OnboardingStepShell>
  );
};

type GameSectionProps = {
  games: GameCardData[];
  selectedGames: string[];
  onToggle: (name: string) => void;
};

const GameSection = ({ games, selectedGames, onToggle }: GameSectionProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-[7px]">
    {games.map((game) => {
      const isSelected = selectedGames.includes(game.name);

      return (
        <button
          key={game.name}
          onClick={() => onToggle(game.name)}
          className={`rounded-[10px] border-2 overflow-hidden cursor-pointer relative h-16 sm:h-[72px] ${
            isSelected ? "border-ss-accent" : "border-transparent"
          }`}
        >
          <div className="absolute inset-0 rounded-[9px]" style={{ background: game.bg }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[22px] leading-none">
            {game.icon}
          </div>
          {isSelected && (
            <div className="absolute top-[5px] right-[5px] w-4 h-4 rounded-full bg-ss-accent flex items-center justify-center">
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3l2 2 4-4" stroke="#0d1580" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <div className="game-card-overlay">
            <span className="text-[10px] font-semibold text-white">{game.name}</span>
            {game.tag && (
              <span className={`text-[8px] px-[5px] py-[2px] rounded font-semibold text-white ${
                game.tag === "HOT" ? "bg-[#e24b4a]" : "bg-[#1a8c5b]"
              }`}>
                {game.tag}
              </span>
            )}
          </div>
        </button>
      );
    })}
  </div>
);
