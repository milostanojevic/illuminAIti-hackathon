"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES, LEAGUE_FLAGS } from "@/lib/data/leagues";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { goToNextPreferenceStep } from "@/lib/onboardingNav";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import type { LeagueKey } from "@/types/brand";

const LEAGUE_KEYS: LeagueKey[] = ["psl", "epl", "ll", "bl", "ucl", "wc"];

const LEAGUE_REGIONS: Record<LeagueKey, string> = {
  psl: "South Africa",
  epl: "England",
  ll: "Spain",
  bl: "Germany",
  ucl: "Europe",
  wc: "International",
};

export const LeagueGrid = () => {
  const router = useRouter();
  const { state, toggleLeague } = useOnboarding();
  const brand = state.brand!;
  const isBk = brand === "bk";
  const hasSelection = state.leagues.length > 0;

  const handleContinue = () => {
    const next = getNextStep(brand, "leagues");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => goToNextPreferenceStep(router, brand, "leagues");

  const stepLabel = state.leagues.length > 0
    ? `${state.leagues.length} league${state.leagues.length > 1 ? "s" : ""} selected`
    : "Leagues";

  return (
    <OnboardingStepShell
      header={
        <ScreenHeader
          brand={brand}
          currentStep="leagues"
          title="Pick your leagues"
          subtitle="Select one or more — we'll tailor your feed."
          stepLabel={stepLabel}
        />
      }
    >
        <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
          Select leagues
        </div>
        <div className="text-[11px] text-gray-400 mb-3">
          Tap to toggle — select as many as you like
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LEAGUE_KEYS.map((key) => {
            const isSelected = state.leagues.includes(key);
            const onClass = isBk ? "border-bk-primary bg-[#eef1fb]" : "border-ss-primary bg-[#eef2ff]";
            const textClass = isBk ? "text-bk-primary" : "text-ss-primary";

            return (
              <button
                key={key}
                onClick={() => toggleLeague(key)}
                className={`rounded-xl border-[1.5px] bg-[#fafafa] cursor-pointer text-center w-full h-24 flex flex-col items-center justify-center relative flex-shrink-0 ${
                  isSelected ? onClass : "border-gray-200"
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute top-[7px] right-[7px] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: isBk ? "#1a2b6b" : "#FFCD00" }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3l2 2 4-4"
                        stroke={isBk ? "#fff" : "#0d1580"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className="w-9 h-6 rounded-sm flex-shrink-0"
                  style={{ background: LEAGUE_FLAGS[key] }}
                />
                <div className={`text-[11px] font-semibold mt-[7px] leading-none ${isSelected ? textClass : "text-[#1a1a2e]"}`}>
                  {LEAGUE_NAMES[key]}
                </div>
                <div className="text-[10px] text-gray-400 mt-[3px] leading-none">
                  {LEAGUE_REGIONS[key]}
                </div>
              </button>
            );
          })}
        </div>
        <div className="h-px bg-gray-100 my-3.5" />
        <ContinueButton brand={brand} disabled={!hasSelection} onClick={handleContinue} />
        <GhostButton brand={brand} onClick={handleSkip} />
    </OnboardingStepShell>
  );
};
