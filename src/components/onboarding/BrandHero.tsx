"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";
import { STEP_ROUTES, getNextStep } from "@/lib/flow";
import { SuperSportBetLogo } from "@/components/ui/SuperSportBetLogo";
import { brandGradients } from "@/lib/brand/designTokens";

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

  const headlineSize = "clamp(1.5rem, 6.2vw, 2.5rem)";
  const sideCardHeight = "clamp(120px, 22vh, 188px)";
  const middleCardHeight = "clamp(150px, 27vh, 224px)";

  return (
    <div className="relative flex flex-1 flex-col min-h-0 w-full overflow-hidden bg-ss-deep">
      <div
        className="absolute inset-0"
        style={{ background: brandGradients.ss.brandHero }}
      />
      <div className="ss-dots absolute inset-0 opacity-50" />

      <div
        className="relative z-10 flex flex-1 flex-col min-h-0 px-5 sm:px-6"
        style={{
          paddingTop: "clamp(0.75rem, 3vh, 2.25rem)",
          paddingBottom:
            "max(clamp(0.75rem, 2vh, 1.25rem), env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex flex-col items-center flex-shrink-0">
          <SuperSportBetLogo height="clamp(48px, 8vh, 80px)" />

          <div
            className="text-center text-white leading-[1.02] tracking-tight"
            style={{ marginTop: "clamp(0.4rem, 1.4vh, 1rem)" }}
          >
            <div className="font-black" style={{ fontSize: headlineSize }}>
              Make
            </div>
            <div
              className="italic font-extrabold -mt-0.5"
              style={{ fontSize: headlineSize }}
            >
              <span>SuperSport</span>
              <span className="text-ss-accent">BET</span>
            </div>
            <div className="font-black -mt-0.5" style={{ fontSize: headlineSize }}>
              Yours
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[360px] flex-shrink-0"
          style={{ marginTop: "clamp(0.75rem, 2.5vh, 2rem)" }}
        >
          <div className="absolute -top-1 left-2 z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-ss-deep/40 backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute -top-1 right-2 z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-ss-deep/40 backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3l2.6 5.85 6.4.6-4.85 4.3 1.45 6.25L12 16.85 6.4 20l1.45-6.25L3 9.45l6.4-.6L12 3z"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="pointer-events-none absolute left-0 top-[42%] text-white/35 text-base">+</span>
          <span className="pointer-events-none absolute right-0 top-[42%] text-white/35 text-base">+</span>
          <span className="pointer-events-none absolute left-[18%] bottom-1 text-white/30 text-sm">+</span>
          <span className="pointer-events-none absolute right-[18%] bottom-1 text-white/30 text-sm">+</span>

          <div className="flex items-end justify-center gap-2 sm:gap-2.5 px-6">
            <div
              className="w-[26%] -translate-y-1 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm flex flex-col items-center justify-between p-2.5 opacity-90"
              style={{ height: sideCardHeight, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}
            >
              <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" />
                  <path
                    d="M12 3l2.5 5.5L20 9.5l-4 4.2 1 5.8-5-3-5 3 1-5.8L4 9.5l5.5-1L12 3z"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="w-full space-y-1.5 pb-1">
                <div className="h-1.5 w-full rounded-full bg-white/15" />
                <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
              </div>
            </div>

            <div
              className="w-[40%] rounded-2xl border border-white/25 bg-white/[0.10] backdrop-blur-md flex flex-col items-center p-3"
              style={{
                height: middleCardHeight,
                boxShadow: "0 18px 36px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <div className="mt-1 grid w-full grid-cols-3 gap-1">
                {["7", "7", "7"].map((s, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-md bg-ss-deep/70 ring-1 ring-white/15 text-lg font-black text-white"
                    style={{ boxShadow: "inset 0 0 10px rgba(255,205,0,0.12)" }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-white/40 ring-1 ring-white/30" />
                <div className="h-3.5 w-3.5 rounded-full bg-white/40 ring-1 ring-white/30" />
                <div className="h-3.5 w-3.5 rounded-full bg-white/40 ring-1 ring-white/30" />
              </div>
              <div className="mt-auto w-full space-y-1.5">
                <div className="h-1.5 w-2/5 rounded-full bg-ss-accent" />
                <div className="h-1.5 w-full rounded-full bg-white/15" />
              </div>
            </div>

            <div
              className="w-[26%] -translate-y-1 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm flex flex-col items-center justify-between p-2.5 opacity-90"
              style={{ height: sideCardHeight, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}
            >
              <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-bk-red ring-1 ring-white/30 shadow-[0_4px_16px_rgba(200,16,46,0.45)]">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="white">
                  <path d="M3 1.5v9l8-4.5-8-4.5z" />
                </svg>
              </div>
              <div className="w-full space-y-1.5 pb-1">
                <div className="h-1.5 w-full rounded-full bg-white/15" />
                <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
              </div>
            </div>
          </div>

          <div
            className="flex justify-center"
            style={{ marginTop: "clamp(0.4rem, 1.2vh, 0.9rem)" }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-ss-deep/40 backdrop-blur-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" strokeLinecap="round">
                <path d="M4 7h10" />
                <circle cx="17" cy="7" r="2" />
                <path d="M4 17h6" />
                <circle cx="13" cy="17" r="2" />
                <path d="M16 17h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0" />

        <div className="flex-shrink-0">
          <button
            onClick={handleStart}
            className="w-full rounded-2xl bg-ss-accent border-none text-[13px] sm:text-sm font-black text-ss-deep cursor-pointer uppercase tracking-[0.18em] active:scale-[0.99] transition-transform"
            style={{
              padding: "clamp(0.75rem, 1.8vh, 1rem) 0",
              boxShadow: "0 14px 36px rgba(255,205,0,0.32)",
            }}
          >
            Get Started
          </button>
          <button
            onClick={handleSkip}
            className="w-full rounded-2xl bg-white/10 border border-white/20 text-[13px] font-medium text-white/85 cursor-pointer mt-2 hover:bg-white/15 backdrop-blur-sm"
            style={{ padding: "clamp(0.6rem, 1.5vh, 0.875rem) 0" }}
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
};
