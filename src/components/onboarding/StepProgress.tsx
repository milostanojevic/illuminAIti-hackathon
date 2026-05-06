"use client";

import type { Brand } from "@/types/brand";
import type { StepKey } from "@/lib/flow";
import { FLOWS, getStepIndex } from "@/lib/flow";
import { Pip } from "@/components/ui/Pip";

type StepProgressProps = {
  brand: Brand;
  currentStep: StepKey;
};

export const StepProgress = ({ brand, currentStep }: StepProgressProps) => {
  const flow = FLOWS[brand];
  const currentIdx = getStepIndex(brand, currentStep);
  const stepsWithoutMeta = flow.filter((s) => s !== "hero" && s !== "magic");

  return (
    <div className="flex gap-0.5 mb-3 sm:gap-1 sm:mb-3.5">
      {stepsWithoutMeta.map((step) => {
        const actualIdx = flow.indexOf(step);
        let state: "done" | "current" | "future" = "future";
        if (actualIdx < currentIdx) state = "done";
        else if (actualIdx === currentIdx) state = "current";

        return <Pip key={step} state={state} brand={brand} />;
      })}
    </div>
  );
};
