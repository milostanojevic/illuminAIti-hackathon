"use client";

import { useRouter } from "next/navigation";
import type { Brand } from "@/types/brand";
import type { StepKey } from "@/lib/flow";
import {
  getWizardStepIndex,
  getWizardStepCount,
  getSmartPreviousStep,
  STEP_ROUTES,
} from "@/lib/flow";
import { useOnboarding } from "@/state/OnboardingContext";
import { SuperSportBetLogo } from "@/components/ui/SuperSportBetLogo";
import { StepProgress } from "./StepProgress";

type ScreenHeaderProps = {
  brand: Brand;
  currentStep: StepKey;
  title: string;
  subtitle: string;
  stepLabel: string;
  onBack?: () => void;
};

export const ScreenHeader = ({
  brand,
  currentStep,
  title,
  subtitle,
  stepLabel,
  onBack,
}: ScreenHeaderProps) => {
  const router = useRouter();
  const { state } = useOnboarding();
  const isBk = brand === "bk";
  const stepIndex = getWizardStepIndex(brand, currentStep);
  const stepCount = getWizardStepCount(brand);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const prev = getSmartPreviousStep(brand, currentStep, state);
    if (prev) {
      router.push(STEP_ROUTES[prev]);
    }
  };

  return (
    <div
      className="relative w-full min-w-0 flex-shrink-0 px-3 pt-3 pb-0 sm:px-4 sm:pt-4 md:px-5 md:pt-5"
      style={{ background: isBk ? "#1a2b6b" : "#1a2db8" }}
    >
      <div className="close-btn" />
      {!isBk && (
        <div className="flex items-center mb-2 sm:mb-2.5">
          <SuperSportBetLogo height={20} className="sm:!h-[22px]" />
        </div>
      )}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1 bg-transparent border-none text-[11px] text-white/70 cursor-pointer mb-2 p-0 sm:gap-1.5 sm:text-xs sm:mb-2.5"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M8 2L3 6l5 4"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>
      <div className="text-[10px] text-white/55 mb-0.5 sm:text-[11px] sm:mb-1 md:text-xs">
        Personalise your experience
      </div>
      <div className="text-base font-semibold text-white mb-1.5 sm:text-[17px] sm:mb-2 md:text-lg">{title}</div>
      <div className="text-[11px] text-white/55 leading-relaxed mb-3 sm:text-xs sm:mb-3.5 md:text-[13px]">
        {subtitle}
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] text-white/85 mb-3 bg-white/10 sm:px-3 sm:py-[5px] sm:text-[11px] sm:mb-3.5">
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: isBk ? "#4dd9ac" : "#FFCD00" }}
        />
        <span>
          Step {stepIndex} of {stepCount} — {stepLabel}
        </span>
      </div>
      <StepProgress brand={brand} currentStep={currentStep} />
    </div>
  );
};
