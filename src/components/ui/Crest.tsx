"use client";

import { useEffect, useState } from "react";
import { getTeamBadgeUrl, slugifyTeamName } from "@/lib/data/teamBadges";

type CrestProps = {
  name: string;
  size?: number;
};

const FALLBACK = "/teams/other.svg";

export const Crest = ({ name, size = 32 }: CrestProps) => {
  const initial = name === "Other" ? FALLBACK : getTeamBadgeUrl(name);
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    setSrc(name === "Other" ? FALLBACK : getTeamBadgeUrl(name));
  }, [name]);

  const svgFallback =
    name === "Other" ? FALLBACK : `/teams/${slugifyTeamName(name)}.svg`;

  return (
    <img
      src={src}
      alt={`${name} crest`}
      width={size}
      height={size}
      className="inline-block object-contain"
      loading="lazy"
      decoding="async"
      onError={() => {
        setSrc((current) => {
          const png = getTeamBadgeUrl(name);
          if (current === png && svgFallback !== FALLBACK) return svgFallback;
          if (current === svgFallback) return FALLBACK;
          return FALLBACK;
        });
      }}
    />
  );
};
