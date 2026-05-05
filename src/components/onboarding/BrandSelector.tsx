"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/state/OnboardingContext";

export const BrandSelector = () => {
  const router = useRouter();
  const { setBrand } = useOnboarding();

  const handleSelect = (brand: "bk" | "ss") => {
    setBrand(brand);
    router.push("/onboarding/hero");
  };

  return (
    <div className="relative flex flex-col items-center justify-center px-5 py-10 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1e2a5e 0%, #2d1a4a 40%, #1a1a3a 100%)" }}
    >
      <div className="brand-glow" />
      <div className="brand-grid" />
      <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mb-3 text-2xl relative">
        🎮
      </div>
      <div className="text-[10px] text-white/45 uppercase tracking-widest mb-1.5 text-center relative">
        Welcome — choose your brand
      </div>
      <div className="text-[17px] font-bold text-white text-center leading-tight mb-7 relative">
        Which platform<br />are you using?
      </div>
      <div className="flex flex-col gap-2.5 w-full relative">
        <button
          onClick={() => handleSelect("bk")}
          className="rounded-[14px] p-4 cursor-pointer flex items-center gap-3 border-[1.5px] border-white/15 hover:border-bk-mint transition-colors"
          style={{ background: "linear-gradient(135deg, rgba(30,50,120,0.9), rgba(15,28,80,0.9))" }}
        >
          <div className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center flex-shrink-0 text-lg bg-bk-mint/15 border border-bk-mint/20">
            👑
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-bold text-white mb-0.5">BetKing</div>
            <div className="text-[10px] text-white/45">Nigeria &middot; Sports &amp; Casino</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-sm text-white/40">
            ›
          </div>
        </button>

        <button
          onClick={() => handleSelect("ss")}
          className="rounded-[14px] p-4 cursor-pointer flex items-center gap-3 border-[1.5px] border-white/15 hover:border-ss-accent transition-colors"
          style={{ background: "linear-gradient(135deg, rgba(35,60,210,0.9), rgba(18,30,160,0.9))" }}
        >
          <div className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center flex-shrink-0 text-lg bg-ss-accent/[0.12] border border-ss-accent/20">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10 C3 6 6 3 10 3 C14 3 17 6 17 10" stroke="#FFCD00" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M6 14 C6 14 8 17 10 17 C12 17 14 14 14 14" stroke="#FFCD00" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-bold text-ss-accent mb-0.5">SuperSportBET</div>
            <div className="text-[10px] text-white/45">South Africa &middot; Sports &amp; Casino</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-sm text-white/40">
            ›
          </div>
        </button>
      </div>
      <div className="mt-4 text-[10px] text-white/30 text-center relative">
        You can switch brands at any time
      </div>
    </div>
  );
};
