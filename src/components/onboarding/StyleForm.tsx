"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import type { PromoKey, RiskLevel, SessionStyle } from "@/types/brand";

type StyleOption = {
  value: string;
  icon: string;
  title: string;
  sub: string;
};

const RISK_OPTIONS: StyleOption[] = [
  { value: "low", icon: "🛡️", title: "Low risk", sub: "Steady rewards & safer bets" },
  { value: "high", icon: "🚀", title: "High risk", sub: "Big promos & high reward" },
];

const SESSION_OPTIONS: StyleOption[] = [
  { value: "quick", icon: "⚡", title: "Quick play", sub: "Fast bets, on the go" },
  { value: "long", icon: "🎯", title: "Long sessions", sub: "Deep dives & research" },
];

const PROMO_OPTIONS: (StyleOption & { key: PromoKey })[] = [
  { key: "freebets", value: "freebets", icon: "🎟️", title: "Free bets", sub: "Bet without risk" },
  { key: "freespins", value: "freespins", icon: "🎰", title: "Free spins", sub: "Bonus casino rounds" },
  { key: "cashback", value: "cashback", icon: "💰", title: "Cashback", sub: "Get losses back" },
  { key: "odds", value: "odds", icon: "📈", title: "Odds boosts", sub: "Enhanced winnings" },
];

export const StyleForm = () => {
  const router = useRouter();
  const { state, setRisk, setSession, togglePromo } = useOnboarding();
  const brand = state.brand!;
  const isBk = brand === "bk";
  const isComplete = state.style.risk !== null && state.style.session !== null;

  const handleContinue = () => {
    const next = getNextStep(brand, "style");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const tickColor = isBk ? "#4dd9ac" : "#FFCD00";
  const checkStroke = isBk ? "#003030" : "#0d1580";
  const onClass = isBk ? "border-bk-primary bg-[#eef1fb]" : "border-ss-primary bg-[#eef2ff]";

  return (
    <OnboardingStepShell
      header={
        <ScreenHeader
          brand={brand}
          currentStep="style"
          title="Your betting style"
          subtitle="Help us tailor your experience."
          stepLabel="Style"
        />
      }
    >
        <StyleGroup label="Risk preference">
          {RISK_OPTIONS.map((opt) => (
            <StyleCard
              key={opt.value}
              option={opt}
              isSelected={state.style.risk === opt.value}
              onClick={() => setRisk(opt.value as RiskLevel)}
              onClass={onClass}
              tickColor={tickColor}
              checkStroke={checkStroke}
            />
          ))}
        </StyleGroup>

        <StyleGroup label="Session style">
          {SESSION_OPTIONS.map((opt) => (
            <StyleCard
              key={opt.value}
              option={opt}
              isSelected={state.style.session === opt.value}
              onClick={() => setSession(opt.value as SessionStyle)}
              onClass={onClass}
              tickColor={tickColor}
              checkStroke={checkStroke}
            />
          ))}
        </StyleGroup>

        <StyleGroup label="Promo preferences" hint="(select all that apply)">
          {PROMO_OPTIONS.map((opt) => (
            <StyleCard
              key={opt.key}
              option={opt}
              isSelected={state.style.promos.includes(opt.key)}
              onClick={() => togglePromo(opt.key)}
              onClass={onClass}
              tickColor={tickColor}
              checkStroke={checkStroke}
            />
          ))}
        </StyleGroup>

        <div className="h-px bg-gray-100 my-3.5" />
        <ContinueButton
          brand={brand}
          disabled={!isComplete}
          onClick={handleContinue}
          label="Personalise my experience! ✨"
        />
        <GhostButton onClick={handleContinue} />
    </OnboardingStepShell>
  );
};

type StyleGroupProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

const StyleGroup = ({ label, hint, children }: StyleGroupProps) => (
  <div className="mb-3.5 sm:mb-[18px]">
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
      {label}
      {hint && (
        <span className="text-[9px] font-normal text-gray-300 normal-case tracking-normal ml-1">
          {hint}
        </span>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{children}</div>
  </div>
);

type StyleCardProps = {
  option: StyleOption;
  isSelected: boolean;
  onClick: () => void;
  onClass: string;
  tickColor: string;
  checkStroke: string;
};

const StyleCard = ({ option, isSelected, onClick, onClass, tickColor, checkStroke }: StyleCardProps) => (
  <button
    onClick={onClick}
    className={`rounded-[14px] border-[1.5px] bg-[#fafafa] cursor-pointer p-2.5 sm:p-3 flex flex-row sm:flex-col items-center text-left sm:text-center gap-2.5 sm:gap-1.5 relative transition-colors ${
      isSelected ? onClass : "border-gray-200 hover:border-[#aab0d8] hover:bg-[#f4f6ff]"
    }`}
  >
    {isSelected && (
      <div
        className="absolute top-[7px] right-[7px] w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: tickColor }}
      >
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3l2 2 4-4" stroke={checkStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )}
    <div className="text-xl sm:text-2xl leading-none sm:mb-0.5">{option.icon}</div>
    <div>
      <div className="text-[11px] font-bold text-[#1a1a2e] leading-tight">{option.title}</div>
      <div className="text-[9px] text-gray-400 leading-snug">{option.sub}</div>
    </div>
  </button>
);
