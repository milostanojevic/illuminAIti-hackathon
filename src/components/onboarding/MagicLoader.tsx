"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";

type MagicStep = {
  icon: string;
  name: string;
  sub: string;
  pct: number;
};

export const MagicLoader = () => {
  const router = useRouter();
  const { state } = useOnboarding();
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

      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: state.brand,
            leagues: state.leagues,
            teams: state.teams,
            casinoGames: state.casinoGames,
            providers: state.providers,
            ssGames: state.ssGames,
            risk: state.style.risk,
            session: state.style.session,
            promos: state.style.promos,
          }),
        });
      } catch {
        // POC: silently continue if persistence fails
      }

      setTimeout(() => {
        router.push("/home");
      }, 700);
    };

    runSteps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-7 relative overflow-hidden min-h-[400px]"
      style={{ background: bgGradient }}
    >
      <div className="relative text-center mb-5">
        <div className="text-[44px] mb-2.5">✨</div>
        <div className="text-xl font-extrabold text-white leading-tight mb-2">
          Building your<br />personal experience
        </div>
        <div className="text-xs text-white/60 leading-relaxed">
          Hang tight — setting<br />everything up just for you.
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full relative">
        {steps.map((step, i) => {
          if (i > activeStep) return null;
          const isCompleted = completedSteps.includes(i);

          return (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-white/[0.07] border border-white/10 rounded-[10px] px-3 py-2.5 w-full animate-fadeUp"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center flex-shrink-0 text-[13px]">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-white">{step.name}</div>
                <div className="text-[10px] text-white/45">{step.sub}</div>
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

      <div className="w-full relative mt-3.5">
        <div className="magic-bar-track">
          <div
            className="magic-bar-fill"
            style={{ width: `${progress}%`, background: accentColor }}
          />
        </div>
        <div className="text-[10px] text-white/50 text-center mt-1.5">
          {progress}%
        </div>
      </div>
    </div>
  );
};
