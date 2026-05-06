"use client";

import { useEffect, useState } from "react";
import { getCompetitionBadgeUrl } from "@/lib/data/competitionBadges";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import type { LeagueKey } from "@/types/brand";

const FALLBACK = "/competitions/other.svg";

type CompetitionBadgeProps = {
  league: LeagueKey;
  className?: string;
  size?: number;
};

export const CompetitionBadge = ({
  league,
  className,
  size = 24,
}: CompetitionBadgeProps) => {
  const initial = getCompetitionBadgeUrl(league);
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    setSrc(getCompetitionBadgeUrl(league));
  }, [league]);

  const useLayoutClass = Boolean(className);

  return (
    <img
      src={src}
      alt={`${LEAGUE_NAMES[league]} badge`}
      width={useLayoutClass ? undefined : size}
      height={useLayoutClass ? undefined : size}
      className={className ?? "inline-block object-contain"}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(FALLBACK)}
    />
  );
};
