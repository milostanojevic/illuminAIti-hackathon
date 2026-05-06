"use client";

import type { Brand } from "@/types/brand";

type ContinueButtonProps = {
  brand: Brand;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

export const ContinueButton = ({
  brand,
  disabled = false,
  onClick,
  label = "Continue →",
}: ContinueButtonProps) => {
  const isBk = brand === "bk";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full py-3 sm:py-3.5 rounded-2xl sm:rounded-[30px] border-none text-xs sm:text-[13px] font-semibold cursor-pointer mb-1.5 sm:mb-2 block disabled:opacity-40 disabled:cursor-default"
      style={{
        background: isBk ? "#00d8c8" : "#FFCD00",
        color: isBk ? "#003030" : "#0d1580",
      }}
    >
      {label}
    </button>
  );
};

type GhostButtonProps = {
  brand: Brand;
  onClick?: () => void;
  label?: string;
};

export const GhostButton = ({
  brand,
  onClick,
  label = "Skip for now",
}: GhostButtonProps) => {
  const isBk = brand === "bk";

  const ghostClasses = isBk
    ? [
        "border-bk-accent/55 text-[#003030]",
        "hover:bg-bk-accent/15 active:bg-bk-accent/22",
        "focus-visible:ring-bk-accent/45",
      ].join(" ")
    : [
        "border-ss-accent/70 text-ss-deep",
        "hover:bg-ss-accent/14 active:bg-ss-accent/22",
        "focus-visible:ring-ss-accent/50",
      ].join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-2.5 rounded-[30px] border-[1.5px] bg-white/60 text-[12px] font-semibold cursor-pointer transition-colors duration-150 ${ghostClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
    >
      {label}
    </button>
  );
};
