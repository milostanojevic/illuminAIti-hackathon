"use client";

import type { ReactNode } from "react";

type OnboardingStepShellProps = {
  header: ReactNode;
  children: ReactNode;
};

export const OnboardingStepShell = ({ header, children }: OnboardingStepShellProps) => {
  return (
    <div className="flex flex-1 flex-col min-h-0 w-full min-w-0">
      {header}
      <div className="scroll-touch flex flex-1 flex-col min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white p-3 sm:p-4 md:p-5 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
    </div>
  );
};
