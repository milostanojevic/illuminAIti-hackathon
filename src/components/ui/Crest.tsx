"use client";

import { useEffect, useState } from "react";
import { getTeamBadgeUrl } from "@/lib/data/teamBadges";

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
        setSrc((s) => (s !== FALLBACK ? FALLBACK : s));
      }}
    />
  );
};
