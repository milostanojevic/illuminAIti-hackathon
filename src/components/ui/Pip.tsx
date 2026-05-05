"use client";

import type { Brand } from "@/types/brand";

type PipProps = {
  state: "done" | "current" | "future";
  brand: Brand;
};

export const Pip = ({ state, brand }: PipProps) => {
  const isBk = brand === "bk";

  if (state === "done") {
    return (
      <div
        className="h-[3px] flex-1 rounded-sm"
        style={{ background: isBk ? "#4dd9ac" : "#FFCD00" }}
      />
    );
  }

  if (state === "current") {
    return (
      <div
        className="h-[3px] flex-1 rounded-sm"
        style={{ background: "#fff" }}
      />
    );
  }

  return (
    <div className="h-[3px] flex-1 rounded-sm bg-white/20" />
  );
};
