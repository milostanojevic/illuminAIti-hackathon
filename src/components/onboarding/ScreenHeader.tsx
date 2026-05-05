"use client";

import { useRouter } from "next/navigation";
import type { Brand } from "@/types/brand";
import type { StepKey } from "@/lib/flow";
import {
  getWizardStepIndex,
  getWizardStepCount,
  getPreviousStep,
  STEP_ROUTES,
} from "@/lib/flow";
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
  const isBk = brand === "bk";
  const stepIndex = getWizardStepIndex(brand, currentStep);
  const stepCount = getWizardStepCount(brand);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const prev = getPreviousStep(brand, currentStep);
    if (prev) {
      router.push(STEP_ROUTES[prev]);
    }
  };

  return (
    <div
      className="relative w-full min-w-0 flex-shrink-0 px-4 pt-4 pb-0"
      style={{ background: isBk ? "#1a2b6b" : "#1a2db8" }}
    >
      <div className="close-btn" />
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 bg-transparent border-none text-xs text-white/70 cursor-pointer mb-2.5 p-0"
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
      <div className="text-[11px] text-white/55 mb-1">
        Personalise your experience
      </div>
      <div className="text-[17px] font-semibold text-white mb-2">{title}</div>
      <div className="text-[11px] text-white/55 leading-relaxed mb-3.5">
        {subtitle}
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[11px] text-white/85 mb-3.5 bg-white/10">
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
