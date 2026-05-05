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
      className="w-full py-3.5 rounded-[30px] border-none text-[13px] font-semibold cursor-pointer mb-2 block disabled:opacity-40 disabled:cursor-default"
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
  onClick?: () => void;
  label?: string;
};

export const GhostButton = ({
  onClick,
  label = "Skip for now",
}: GhostButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-[30px] bg-transparent border border-gray-200 text-xs text-gray-400 cursor-pointer"
    >
      {label}
    </button>
  );
};
