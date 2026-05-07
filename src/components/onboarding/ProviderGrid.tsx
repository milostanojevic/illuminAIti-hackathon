"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { PROVIDER_LABELS } from "@/lib/data/providers";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { goToNextPreferenceStep } from "@/lib/onboardingNav";
import { OnboardingStepShell } from "./OnboardingStepShell";
import { ScreenHeader } from "./ScreenHeader";
import { ContinueButton, GhostButton } from "./ContinueButton";
import type { ProviderKey } from "@/types/brand";

type ProviderInfo = {
  key: ProviderKey;
  icon: string;
  color: string;
  sub: string;
  logoUrl?: string;
  /** Dark logos need a light tile background (logo tiles default to dark). */
  logoOnLight?: boolean;
};

const PROVIDERS: ProviderInfo[] = [
  {
    key: "habanero",
    icon: "🌶️",
    color: "#E8521A",
    sub: "177 Slots",
    logoUrl: "https://habanerosystems.com/Content/img/habanero_white.png",
  },
  {
    key: "spribe",
    icon: "🚀",
    color: "#1a2db8",
    sub: "Crash Games",
    logoUrl: "https://spribe.co/assets/images/spribe-logo-black.svg",
    logoOnLight: true,
  },
  {
    key: "pragmatic",
    icon: "⚡",
    color: "#d40000",
    sub: "119 Slots",
    logoUrl:
      "https://www.pragmaticplay.com/wp-content/themes/gp-theme-basic/libs/dist/images/PP-white-logo.svg",
  },
  {
    key: "netent",
    icon: "🎰",
    color: "#00B0F0",
    sub: "Slots",
    logoUrl: "https://netent.com/images/tenants/netent/netent_og_image.webp",
  },
  {
    key: "betgames",
    icon: "🎲",
    color: "#8b1a8b",
    sub: "Live Dealer",
    logoUrl:
      "https://www.betgames.tv/api/uploads/Bet_Games_logo_dark_blue_8dcefda24e.png",
  },
  {
    key: "evolution",
    icon: "♠️",
    color: "#6d0a0a",
    sub: "961 Games",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1k6hg6D5BFbzBfbCcarLiuKsTS8bJPctqrQ&s",
    logoOnLight: true,
  },
];

export const ProviderGrid = () => {
  const router = useRouter();
  const { state, toggleProvider } = useOnboarding();
  const brand = state.brand!;
  const hasSelection = state.providers.length > 0;

  const handleContinue = () => {
    const next = getNextStep(brand, "providers");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => goToNextPreferenceStep(router, brand, "providers");

  const stepLabel = hasSelection
    ? `${state.providers.length} provider${state.providers.length > 1 ? "s" : ""} selected`
    : "Providers";

  return (
    <OnboardingStepShell
      header={
        <ScreenHeader
          brand={brand}
          currentStep="providers"
          title="Pick your providers"
          subtitle="Choose the game studios you enjoy most."
          stepLabel={stepLabel}
        />
      }
    >
        <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
          Select game providers
        </div>
        <div className="text-[11px] text-gray-400 mb-3">
          Tap to toggle — multiple allowed
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {PROVIDERS.map(({ key, icon, color, sub, logoUrl, logoOnLight }) => {
            const isSelected = state.providers.includes(key);
            const hasLogo = Boolean(logoUrl);
            const logoTileBg = logoOnLight ? "bg-white" : "bg-[#1c1c1c]";

            const containerClass = hasLogo
              ? `rounded-xl border-[1.5px] cursor-pointer h-16 sm:h-[86px] flex items-center justify-center relative flex-shrink-0 transition-colors overflow-hidden ${logoTileBg} ${
                  isSelected
                    ? "border-ss-primary"
                    : "border-gray-200 hover:border-[#aab0d8]"
                }`
              : `rounded-xl border-[1.5px] cursor-pointer h-16 sm:h-[86px] px-3 sm:px-0 flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-1 relative flex-shrink-0 transition-colors ${
                  isSelected
                    ? "border-ss-primary bg-[#eef2ff]"
                    : "border-gray-200 bg-[#fafafa] hover:border-[#aab0d8] hover:bg-[#f4f6ff]"
                }`;

            return (
              <button
                key={key}
                onClick={() => toggleProvider(key)}
                className={containerClass}
              >
                {isSelected && (
                  <div className="absolute top-[7px] right-[7px] w-4 h-4 rounded-full bg-ss-accent flex items-center justify-center z-[1]">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#0d1580" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {hasLogo ? (
                  <img
                    src={logoUrl}
                    alt={PROVIDER_LABELS[key]}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <>
                    <div className="text-xl sm:text-[22px] leading-none sm:mb-0.5">{icon}</div>
                    <div className="text-left sm:text-center">
                      <div className="text-[11px] font-extrabold tracking-wide leading-tight" style={{ color }}>
                        {PROVIDER_LABELS[key]}
                      </div>
                      <div className="text-[9px] text-gray-400">{sub}</div>
                    </div>
                  </>
                )}
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
