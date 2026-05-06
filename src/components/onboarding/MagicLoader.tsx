"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { writeStoredPreferences } from "@/lib/storedPreferences";

type MagicStep = {
  icon: string;
  name: string;
  sub: string;
  pct: number;
};

export const MagicLoader = () => {
  const router = useRouter();
  const { state } = useOnboarding();
  const stateRef = useRef(state);
  stateRef.current = state;
  const isBk = state.brand === "bk";
  const accentColor = isBk ? "#4dd9ac" : "#FFCD00";
  const checkStroke = isBk ? "#003030" : "#0d1580";
  const bgGradient = isBk
    ? "linear-gradient(160deg, #0d1a3a, #1a2b6b)"
    : "linear-gradient(160deg, #0d1580, #1a2db8)";

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasStarted = useRef(false);

  const steps: MagicStep[] = [
    {
      icon: "🏟",
      name: "Loading your leagues",
      sub: state.leagues.map((k) => LEAGUE_NAMES[k]).join(", ") || "None",
      pct: 28,
    },
    {
      icon: "⚽",
      name: "Setting up your teams",
      sub: state.teams.slice(0, 3).join(", ") + (state.teams.length > 3 ? " +more" : "") || "None",
      pct: 58,
    },
    {
      icon: "🎮",
      name: "Pinning your games",
      sub: (isBk ? state.casinoGames : state.ssGames).join(", ") || "None",
      pct: 82,
    },
    {
      icon: "✨",
      name: "Finalising your feed",
      sub: "Almost there...",
      pct: 100,
    },
  ];

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setActiveStep(i);
        await new Promise((r) => setTimeout(r, 650 + i * 80));
        setCompletedSteps((prev) => [...prev, i]);
        setProgress(steps[i].pct);
      }

      writeStoredPreferences(stateRef.current);

      setTimeout(() => {
        router.push("/home");
      }, 700);
    };

    runSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center min-h-0 px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8 relative overflow-hidden"
      style={{ background: bgGradient }}
    >
      <div className="relative text-center mb-4 sm:mb-5 md:mb-6">
        <div className="text-[36px] sm:text-[44px] md:text-5xl mb-1.5 sm:mb-2.5">✨</div>
        <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-tight mb-1.5 sm:mb-2">
          Building your<br />personal experience
        </div>
        <div className="text-[11px] sm:text-xs md:text-sm text-white/60 leading-tight sm:leading-relaxed">
          Hang tight — setting<br />everything up just for you.
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 w-full relative">
        {steps.map((step, i) => {
          if (i > activeStep) return null;
          const isCompleted = completedSteps.includes(i);

          return (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-2.5 bg-white/[0.07] border border-white/10 rounded-[9px] sm:rounded-[10px] px-2.5 sm:px-3 py-2 sm:py-2.5 w-full animate-fadeUp"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white/[0.08] flex items-center justify-center flex-shrink-0 text-xs sm:text-[13px]">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="text-[10px] sm:text-[11px] md:text-xs font-semibold text-white">{step.name}</div>
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-white/45">{step.sub}</div>
              </div>
              {isCompleted ? (
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: accentColor }}
                >
                  <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                    <path d="M1 2.5l1.5 1.5 3-3" stroke={checkStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                  style={{ borderColor: `${accentColor} ${accentColor} ${accentColor} transparent` }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full relative mt-3 sm:mt-3.5 md:mt-4">
        <div className="magic-bar-track">
          <div
            className="magic-bar-fill"
            style={{ width: `${progress}%`, background: accentColor }}
          />
        </div>
        <div className="text-[9px] sm:text-[10px] md:text-[11px] text-white/50 text-center mt-1 sm:mt-1.5">
          {progress}%
        </div>
      </div>
    </div>
  );
};
