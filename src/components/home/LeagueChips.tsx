"use client";

import { LEAGUE_NAMES, LEAGUE_FLAGS } from "@/lib/data/leagues";
import type { LeagueKey } from "@/types/brand";

type LeagueChipsProps = {
  leagues: LeagueKey[];
};

export const LeagueChips = ({ leagues }: LeagueChipsProps) => {
  if (leagues.length === 0) return null;

  return (
    <div className="flex gap-1.5 overflow-hidden">
      {leagues.map((key) => (
        <div
          key={key}
          className="inline-flex items-center gap-1 bg-white/[0.12] rounded-full px-2 py-[3px] flex-shrink-0"
        >
          <div
            className="w-3 h-2 rounded-sm flex-shrink-0"
            style={{ background: LEAGUE_FLAGS[key] }}
          />
          <span className="text-[9px] font-semibold text-white/90 whitespace-nowrap">
            {LEAGUE_NAMES[key]}
          </span>
        </div>
      ))}
    </div>
  );
};
