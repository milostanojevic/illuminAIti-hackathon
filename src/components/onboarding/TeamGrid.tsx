"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { buildTeamPool } from "@/lib/data/teams";
import { LEAGUE_NAMES, LEAGUE_FLAGS } from "@/lib/data/leagues";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import { Crest } from "@/components/ui/Crest";

export const TeamGrid = () => {
  const router = useRouter();
  const { state, toggleTeam } = useOnboarding();
  const brand = state.brand!;
  const isBk = brand === "bk";
  const hasSelection = state.teams.length > 0;

  const pool = buildTeamPool(state.leagues);

  const handleContinue = () => {
    const next = getNextStep(brand, "teams");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const subtitle = state.leagues.length === 1
    ? `Top 10 clubs from ${LEAGUE_NAMES[state.leagues[0]]}.`
    : `Best clubs across ${state.leagues.length} leagues.`;

  return (
    <>
      <ScreenHeader
        brand={brand}
        currentStep="teams"
        title="Choose your teams"
        subtitle={subtitle}
        stepLabel="Teams"
      />
      <div className="p-4 bg-white">
        <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
          Select your clubs
        </div>
        <div className="flex flex-wrap gap-[5px] mb-2">
          {state.leagues.map((key) => (
            <div
              key={key}
              className={`inline-flex items-center gap-1 border rounded-full px-2 py-[3px] text-[10px] ${
                isBk
                  ? "bg-[#eef1fb] border-[#b0b8d8] text-bk-primary"
                  : "bg-[#eef2ff] border-[#a0b0e8] text-ss-primary"
              }`}
            >
              <div
                className="w-3.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: LEAGUE_FLAGS[key] }}
              />
              {LEAGUE_NAMES[key]}
            </div>
          ))}
        </div>
        <div className={`text-[10px] mb-2.5 ${isBk ? "text-bk-primary" : "text-ss-primary"}`}>
          <span className="font-semibold">{state.teams.length}</span> team{state.teams.length !== 1 ? "s" : ""} selected
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {pool.map((name) => {
            const isSelected = state.teams.includes(name);
            const onClass = isBk ? "bg-[#eef1fb] border-bk-primary" : "bg-[#eef2ff] border-ss-primary";
            const textClass = isBk ? "text-bk-primary font-bold" : "text-ss-primary font-bold";

            return (
              <button
                key={name}
                onClick={() => toggleTeam(name)}
                className={`rounded-[10px] border-[1.5px] p-1.5 text-center cursor-pointer h-[68px] flex flex-col items-center justify-center relative ${
                  isSelected ? onClass : "border-gray-200 bg-[#f5f6fa]"
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute -top-[3px] -right-[3px] w-3 h-3 rounded-full flex items-center justify-center border-[1.5px] border-white"
                    style={{ background: isBk ? "#4dd9ac" : "#FFCD00" }}
                  >
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path
                        d="M1 2.5l1.5 1.5 3-3"
                        stroke={isBk ? "#003030" : "#0d1580"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div className="w-8 h-8 mb-1 flex-shrink-0">
                  <Crest name={name} size={32} />
                </div>
                <div className={`text-[8px] leading-tight break-words ${isSelected ? textClass : "text-gray-500 font-medium"}`}>
                  {name}
                </div>
              </button>
            );
          })}
          <button
            onClick={() => toggleTeam("Other")}
            className={`rounded-[10px] border-[1.5px] border-dashed p-1.5 text-center cursor-pointer h-[68px] flex flex-col items-center justify-center ${
              state.teams.includes("Other")
                ? isBk ? "bg-[#eef1fb] border-bk-primary" : "bg-[#eef2ff] border-ss-primary"
                : "border-gray-300 bg-[#f5f6fa]"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#dde0ee] flex items-center justify-center mb-1 text-sm text-gray-400">
              <Crest name="Other" size={28} />
            </div>
            <div className="text-[8.5px] text-gray-500">Other</div>
          </button>
        </div>
        <div className="h-px bg-gray-100 my-3.5" />
        <ContinueButton brand={brand} disabled={!hasSelection} onClick={handleContinue} />
        <GhostButton />
      </div>
    </>
  );
};
