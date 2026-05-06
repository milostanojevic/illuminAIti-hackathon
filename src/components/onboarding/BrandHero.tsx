"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";

const CROWD_HEIGHTS = [
  32, 24, 40, 28, 44, 30, 36, 26, 42, 22, 38, 46, 28, 34, 40,
  25, 44, 30, 36, 28, 42, 32, 22, 38, 46, 26, 34, 30, 40, 24,
] as const;

const CROWD_WIDTHS = [7, 6, 8, 7, 6, 8, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 6, 8, 7, 6, 8, 7, 6, 8] as const;

const CrowdRow = () => (
  <div className="absolute top-[46%] left-0 right-0 flex items-end justify-center gap-px h-[52px] px-1.5">
    {CROWD_HEIGHTS.map((h, i) => (
      <div
        key={i}
        style={{
          width: `${CROWD_WIDTHS[i]}px`,
          height: `${h}px`,
          background: "rgba(0,0,0,0.7)",
          borderRadius: "3px 3px 0 0",
        }}
      />
    ))}
  </div>
);

export const BrandHero = () => {
  const router = useRouter();
  const { state } = useOnboarding();
  const brand = state.brand!;
  const isBk = brand === "bk";

  const handleStart = () => {
    const next = getNextStep(brand, "hero");
    if (next) router.push(STEP_ROUTES[next]);
  };

  const handleSkip = () => router.push("/home");

  if (isBk) {
    return (
      <div className="relative flex flex-1 flex-col min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-touch bg-[#0d0d0d]">
        <div className="stadium-bg" />
        <div className="red-shape" />
        <div className="red-noise" />
        <CrowdRow />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[32%]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.55) 42%, #000 92%)",
          }}
        />

        <div className="relative z-10 mt-auto px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[13px] sm:text-sm">👑</span>
              <span className="text-xs sm:text-[13px] font-extrabold text-white">betking</span>
            </div>
            <div className="w-px h-4 sm:h-[18px] bg-white/25" />
            <span className="text-[9px] sm:text-[10px] font-semibold text-white/50 uppercase tracking-wider">
              Official Betting Partner
            </span>
          </div>

          <div className="text-[1.35rem] sm:text-[clamp(1.25rem,5vw+0.65rem,1.75rem)] md:text-[1.85rem] font-black text-white leading-[1.03] sm:leading-[1.05] uppercase mb-4 sm:mb-[22px] md:mb-6 tracking-tight">
            Personalise<br />
            your favourite<br />
            <span className="text-bk-red">teams</span> &amp; games
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 sm:py-[15px] md:py-4 rounded-xl bg-bk-red border-none text-[13px] sm:text-sm font-bold text-white cursor-pointer uppercase tracking-wider"
          >
            Get Started
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-2.5 sm:py-3 md:py-3.5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-[13px] font-medium text-white/75 cursor-pointer mt-2 sm:mt-2.5 hover:bg-white/15"
          >
            Skip personalisation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-touch bg-[#1a2db8]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #2a3dc8 0%, #1a2db8 50%, #0d1580 100%)",
        }}
      />
      <div className="ss-dots absolute inset-0" />

      <div className="absolute top-[min(18vh,120px)] left-0 right-0 min-h-[160px] max-h-[42vh]">
        <div className="absolute left-3 bottom-0 flex flex-col items-center">
          <div className="w-[14px] h-[14px] rounded-full bg-white/30 mb-0.5" />
          <div
            className="w-[26px] h-[56px] rounded-t-[4px]"
            style={{ background: "rgba(180,0,0,0.65)" }}
          />
          <div className="flex gap-0.5">
            <div
              className="w-[11px] h-[46px] rounded-b-[3px]"
              style={{ background: "rgba(150,0,0,0.55)" }}
            />
            <div
              className="w-[11px] h-[40px] rounded-b-[3px]"
              style={{ background: "rgba(150,0,0,0.55)" }}
            />
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
          <div className="w-[18px] h-[18px] rounded-full bg-white/[0.32] mb-0.5" />
          <div
            className="w-[36px] h-[66px] rounded-t-[6px]"
            style={{ background: "rgba(20,20,120,0.75)" }}
          >
            <div
              className="w-[10px] h-[28px] rounded-sm mx-auto"
              style={{ background: "rgba(180,40,40,0.75)", marginTop: "8px" }}
            />
          </div>
          <div
            className="w-[56px] h-[28px]"
            style={{
              background: "rgba(10,10,80,0.65)",
              borderRadius: "0 0 18px 18px",
            }}
          />
        </div>

        <div className="absolute right-3 bottom-0 flex flex-col items-center">
          <div className="w-[14px] h-[14px] rounded-full bg-white/[0.28] mb-0.5" />
          <div
            className="w-[26px] h-[56px] rounded-t-[4px]"
            style={{ background: "rgba(200,200,200,0.45)" }}
          />
          <div className="flex gap-0.5">
            <div
              className="w-[11px] h-[44px] rounded-b-[3px]"
              style={{ background: "rgba(180,180,180,0.4)" }}
            />
            <div
              className="w-[11px] h-[38px] rounded-b-[3px]"
              style={{ background: "rgba(180,180,180,0.4)" }}
            />
          </div>
        </div>
      </div>

      <CrowdRow />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[26%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(13,21,128,0.35) 28%, rgba(13,21,128,0.65) 52%, #0d1580 92%)",
        }}
      />

      <div className="relative z-10 mt-auto px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7 C2 4 4 2 7 2 C10 2 12 4 12 7"
              stroke="#FFCD00"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M4 10 C4 10 5.5 12 7 12 C8.5 12 10 10 10 10"
              stroke="#FFCD00"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs sm:text-[13px] font-black text-white">
            SuperSport<span className="text-ss-accent">BET</span>
          </span>
          <div className="w-px h-4 sm:h-[18px] bg-white/25" />
          <span className="text-[9px] sm:text-[10px] font-semibold text-white/50 uppercase tracking-wider">
            Official Betting Partner
          </span>
        </div>

        <div className="text-[1.35rem] sm:text-[clamp(1.25rem,5vw+0.65rem,1.75rem)] md:text-[1.85rem] font-black text-white leading-[1.03] sm:leading-[1.05] uppercase mb-4 sm:mb-[22px] md:mb-6 tracking-tight">
          Personalise<br />
          your favourite<br />
          <span className="text-ss-accent">games</span> &amp; teams
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3.5 sm:py-[15px] md:py-4 rounded-xl bg-ss-accent border-none text-[13px] sm:text-sm font-extrabold text-ss-deep cursor-pointer uppercase tracking-wider"
        >
          Get Started
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-2.5 sm:py-3 md:py-3.5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-[13px] font-medium text-white/75 cursor-pointer mt-2 sm:mt-2.5 hover:bg-white/15"
        >
          Skip personalisation
        </button>
      </div>
    </div>
  );
};
