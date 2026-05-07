"use client";

import type { ReactElement } from "react";
import type { Brand } from "@/types/brand";

type HomeDepositWidgetProps = {
  brand: Brand;
};

function StackedCoinsGraphic() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 90"
      className="absolute right-3 bottom-2 sm:right-4 sm:bottom-3 w-[88px] sm:w-[110px] pointer-events-none"
    >
      <defs>
        <linearGradient id="coinFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="coinEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Back stack (taller) */}
      <ellipse cx="78" cy="38" rx="28" ry="9" fill="url(#coinFace)" />
      <path d="M50 38v14c0 5 12.5 9 28 9s28-4 28-9V38" fill="url(#coinEdge)" />
      <ellipse cx="78" cy="52" rx="28" ry="9" fill="url(#coinFace)" />
      <path d="M50 52v10c0 4 12.5 8 28 8s28-4 28-8V52" fill="url(#coinEdge)" />
      <ellipse cx="78" cy="62" rx="28" ry="9" fill="url(#coinFace)" />
      {/* Front stack (shorter, offset) */}
      <ellipse cx="52" cy="52" rx="26" ry="8.5" fill="url(#coinFace)" />
      <path d="M26 52v12c0 4.5 11.7 8.5 26 8.5s26-4 26-8.5V52" fill="url(#coinEdge)" />
      <ellipse cx="52" cy="64" rx="26" ry="8.5" fill="url(#coinFace)" />
      <path d="M26 64v8c0 3.5 11.7 7 26 7s26-3.5 26-7V64" fill="url(#coinEdge)" />
      <ellipse cx="52" cy="72" rx="26" ry="8.5" fill="url(#coinFace)" />
    </svg>
  );
}

export const HomeDepositWidget = ({ brand }: HomeDepositWidgetProps): ReactElement => {
  const isBk = brand === "bk";
  const accentA = isBk ? "#00d8c8" : "#FFCD00";
  const accentB = isBk ? "#FFCD00" : "#00d8c8";
  const buttonFg = isBk ? "#003030" : "#0d1580";
  const bg = isBk
    ? "linear-gradient(135deg, #1a2b6b, #0f1a4d)"
    : "linear-gradient(135deg, #1a2db8, #0d1580)";

  return (
    <div
      className="shrink-0 relative overflow-hidden rounded-xl px-4 py-4 sm:px-5 sm:py-5 min-h-[140px] sm:min-h-[152px]"
      style={{ background: bg }}
    >
      <h3 className="relative z-10 text-2xl sm:text-3xl font-extrabold leading-[1.05] text-white max-w-[78%]">
        Deposit and <span style={{ color: accentA }}>Play Now!</span>
      </h3>
      <p
        className="relative z-10 text-[12px] sm:text-[13px] font-bold mt-2.5"
        style={{ color: accentB }}
      >
        Deposit instantly and safely
      </p>
      <p className="relative z-10 text-[11px] sm:text-[12px] text-white/80 mt-1 max-w-[70%]">
        and enjoy non-stop betting and gaming action today.
      </p>
      <button
        type="button"
        aria-label="Deposit"
        className="relative z-10 border-none rounded-full px-5 py-2 text-[12px] font-extrabold tracking-wide uppercase mt-3.5 cursor-pointer"
        style={{ background: accentA, color: buttonFg }}
      >
        Deposit Now
      </button>
      <StackedCoinsGraphic />
    </div>
  );
};
