"use client";

import { CRESTS } from "@/lib/data/crests";

type CrestProps = {
  name: string;
  size?: number;
};

export const Crest = ({ name, size = 32 }: CrestProps) => {
  const svg = CRESTS[name] ?? CRESTS["Other"];
  const sized = svg.replace(
    'viewBox="0 0 32 32"',
    `viewBox="0 0 32 32" width="${size}" height="${size}"`
  );

  return (
    <span
      className="inline-flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: sized }}
    />
  );
};
