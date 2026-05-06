"use client";

import { useEffect, useState } from "react";
import { getLeagueFlagUrl } from "@/lib/data/leagueFlags";
import { LEAGUE_NAMES } from "@/lib/data/leagues";
import type { LeagueKey } from "@/types/brand";

const FALLBACK = "/flags/other.svg";

type CountryFlagProps = {
  league: LeagueKey;
  className?: string;
  size?: number;
};

export const CountryFlag = ({
  league,
  className,
  size = 16,
}: CountryFlagProps) => {
  const initial = getLeagueFlagUrl(league);
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    setSrc(getLeagueFlagUrl(league));
  }, [league]);

  const useLayoutClass = Boolean(className);

  return (
    <img
      src={src}
      alt={`${LEAGUE_NAMES[league]} flag`}
      width={useLayoutClass ? undefined : size}
      height={useLayoutClass ? undefined : size}
      className={className ?? "inline-block object-contain"}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(FALLBACK)}
    />
  );
};
