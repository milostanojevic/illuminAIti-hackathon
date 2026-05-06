"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { writeStoredPreferences } from "@/lib/storedPreferences";
import type { OnboardingState } from "@/types/preferences";

type MagicStepCard = {
  icon: string;
  name: string;
  sub: string;
  pct: number;
  /** User filled this slice of onboarding (used when any preference exists overall). */
  categorySelected: boolean;
};

const PROMO_SUMMARY_LABELS: Record<string, string> = {
  freebets: "Free bets",
  freespins: "Free spins",
  cashback: "Cashback",
  odds: "Odds boosts",
};

const hasAnyMagicPreferences = (s: OnboardingState): boolean =>
  s.leagues.length > 0 ||
  s.teams.length > 0 ||
  (s.brand === "bk" ? s.casinoGames.length > 0 : s.ssGames.length > 0) ||
  s.style.risk !== null ||
  s.style.session !== null ||
  s.style.promos.length > 0;

const buildStyleSub = (s: OnboardingState): string => {
  const bits: string[] = [];
  if (s.style.risk === "low") bits.push("Low risk");
  if (s.style.risk === "high") bits.push("High risk");
  if (s.style.session === "quick") bits.push("Quick sessions");
  if (s.style.session === "long") bits.push("Long sessions");
  if (s.style.promos.length > 0) {
    const labels = s.style.promos
      .map((p) => PROMO_SUMMARY_LABELS[p] ?? p)
      .slice(0, 3)
      .join(", ");
    const extra = s.style.promos.length > 3 ? ` +${s.style.promos.length - 3} more` : "";
    bits.push(`Promos: ${labels}${extra}`);
  }
  return bits.length > 0 ? bits.join(" · ") : "No selection yet";
};

/** Fixed category order + normalized progress toward 100%. */
const buildMagicStepCards = (state: OnboardingState): MagicStepCard[] => {
  const isBk = state.brand === "bk";
  const leaguesSub =
    state.leagues.length > 0
      ? state.leagues.map((k) => LEAGUE_NAMES[k]).join(", ")
      : "No selection yet";

  const teamsSub =
    state.teams.length > 0
      ? state.teams.slice(0, 3).join(", ") + (state.teams.length > 3 ? " +more" : "")
      : "No selection yet";

  const games = isBk ? state.casinoGames : state.ssGames;
  const gamesSub =
    games.length > 0 ? games.join(", ") + (games.length > 6 ? " …" : "") : "No selection yet";

  const styleSub = buildStyleSub(state);

  const pctForIndex = (i: number, total: number) =>
    total <= 1 ? 100 : Math.round(((i + 1) / total) * 100);

  const cards: Omit<MagicStepCard, "pct">[] = [
    {
      icon: "🏟",
      name: "Loading your leagues",
      sub: leaguesSub,
      categorySelected: state.leagues.length > 0,
    },
    {
      icon: "⚽",
      name: "Setting up your teams",
      sub: teamsSub,
      categorySelected: state.teams.length > 0,
    },
    {
      icon: "🎮",
      name: isBk ? "Pinning your casino games" : "Pinning your games",
      sub: gamesSub,
      categorySelected: games.length > 0,
    },
    {
      icon: "🎯",
      name: "Your betting style",
      sub: styleSub,
      categorySelected:
        state.style.risk !== null ||
        state.style.session !== null ||
        state.style.promos.length > 0,
    },
    {
      icon: "✨",
      name: "Finalising your feed",
      sub: "Almost there…",
      categorySelected: false,
    },
  ];

  const total = cards.length;
  return cards.map((c, i) => ({ ...c, pct: pctForIndex(i, total) }));
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

  const steps = useMemo(() => buildMagicStepCards(state), [state]);
  const anyPrefs = hasAnyMagicPreferences(state);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runSteps = async () => {
      const snapshot = buildMagicStepCards(stateRef.current);
      for (let i = 0; i < snapshot.length; i++) {
        setActiveStep(i);
        await new Promise((r) => setTimeout(r, 650 + i * 80));
        setCompletedSteps((prev) => [...prev, i]);
        setProgress(snapshot[i].pct);
      }

      writeStoredPreferences(stateRef.current);

      setTimeout(() => {
        router.push("/home");
      }, 700);
    };

    runSteps();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps -- run once using stateRef.snapshot

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center min-h-0 px-6 py-7 relative overflow-hidden"
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
          const emphasize = anyPrefs && step.categorySelected;

          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 w-full animate-fadeUp border ${
                emphasize ? "bg-white/[0.12]" : "bg-white/[0.07] border-white/10"
              }`}
              style={
                emphasize
                  ? {
                      borderColor: `${accentColor}99`,
                      boxShadow: `inset 0 0 0 1px ${accentColor}40`,
                    }
                  : undefined
              }
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[13px] ${
                  emphasize ? "bg-white/[0.16]" : "bg-white/[0.08]"
                }`}
              >
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="text-[11px] font-semibold text-white">{step.name}</div>
                  {emphasize && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-px rounded-full"
                      style={{ background: `${accentColor}33`, color: accentColor }}
                    >
                      Set
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] leading-snug break-words ${
                    emphasize ? "text-white/80" : "text-white/45"
                  }`}
                >
                  {step.sub}
                </div>
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
