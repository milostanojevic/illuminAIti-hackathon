"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { BK_GAMES } from "@/lib/data/bkGames";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { goToNextPreferenceStep } from "@/lib/onboardingNav";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";

export const CasinoGrid = () => {
  const router = useRouter();
  const { state, toggleCasinoGame } = useOnboarding();
  const brand = state.brand!;
  const hasSelection = state.casinoGames.length > 0;

  const handleContinue = () => {
    const next = getNextStep(brand, "casino");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => goToNextPreferenceStep(router, brand, "casino");

  return (
    <OnboardingStepShell
      header={
        <ScreenHeader
          brand={brand}
          currentStep="casino"
          title="Top casino picks"
          subtitle="Pin your favourite games to your home screen."
          stepLabel="Casino"
        />
      }
    >
        <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
          Select up to 4 games
        </div>
        <div className="text-[11px] text-gray-400 mb-3">
          These will be pinned to your home
        </div>
        <div className="grid grid-cols-2 gap-[7px]">
          {BK_GAMES.map((game) => {
            const isSelected = state.casinoGames.includes(game.name);

            return (
              <button
                key={game.name}
                onClick={() => toggleCasinoGame(game.name)}
                className={`rounded-[10px] border-2 overflow-hidden cursor-pointer relative h-[72px] ${
                  isSelected ? "border-bk-accent" : "border-transparent"
                }`}
              >
                <div className="absolute inset-0" style={{ background: game.bg }} />
                {isSelected && (
                  <div className="absolute top-[5px] right-[5px] w-4 h-4 rounded-full bg-bk-accent flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#003030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div className="game-card-overlay">
                  <span className="text-[10px] font-semibold text-white">{game.name}</span>
                  {game.tag && (
                    <span
                      className="text-[8px] px-[5px] py-[2px] rounded font-semibold text-white"
                      style={{ background: game.tagColor }}
                    >
                      {game.tag}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-[10px] text-gray-400 text-right mt-1.5">
          {state.casinoGames.length} / 4 selected
        </div>
        <div className="h-px bg-gray-100 my-3.5" />
        <ContinueButton
          brand={brand}
          disabled={!hasSelection}
          onClick={handleContinue}
          label="Finish setup →"
        />
        <GhostButton onClick={handleSkip} />
    </OnboardingStepShell>
  );
};
