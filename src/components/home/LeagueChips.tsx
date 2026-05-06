"use client";

import { LEAGUE_NAMES } from "@/lib/data/leagues";
import { CompetitionBadge } from "@/components/ui/CompetitionBadge";
import type { LeagueKey } from "@/types/brand";

type LeagueChipsProps = {
  leagues: LeagueKey[];
};

export const LeagueChips = ({ leagues }: LeagueChipsProps) => {
  if (leagues.length === 0) return null;

  return (
    <div className="scroll-touch flex flex-nowrap gap-1.5 overflow-x-auto overflow-y-hidden overscroll-x-contain">
      {leagues.map((key) => (
        <div
          key={key}
          className="inline-flex items-center gap-1 bg-white/[0.12] rounded-full px-2 py-[3px] flex-shrink-0"
        >
          <CompetitionBadge
            league={key}
            className="w-3 h-3 object-contain flex-shrink-0"
          />
          <span className="text-[9px] font-semibold text-white/90 whitespace-nowrap">
            {LEAGUE_NAMES[key]}
          </span>
        </div>
      ))}
    </div>
  );
};
