import type { Brand } from "@/types/brand";

export type TrendingCard = {
  chip: string;
  icon: string;
  name: string;
  desc: string;
  cta: string;
  bg: string;
};

export const buildTrendingCards = (
  brand: Brand,
  preferredTeam: string,
  preferredLeague: string,
  preferredGame: string
): TrendingCard[] => {
  const isBk = brand === "bk";
  const casinoBg = isBk
    ? "linear-gradient(135deg, #1a2b6b, #0d1a3a)"
    : "linear-gradient(135deg, #1a2db8, #0d1580)";
  const sportsBg = isBk
    ? "linear-gradient(135deg, #c8102e, #740015)"
    : "linear-gradient(135deg, #1a3dc8, #0d1580)";
  const promoBg = isBk
    ? "linear-gradient(135deg, #003030, #00a89c)"
    : "linear-gradient(135deg, #0d1580, #00a89c)";

  return [
    {
      chip: "Don't miss this",
      icon: "🎰",
      name: `Try ${preferredGame}`,
      desc: "Casino pick surfaced from your game preferences.",
      cta: "Play now",
      bg: casinoBg,
    },
    {
      chip: "For you",
      icon: "⚽",
      name: `${preferredTeam} next up`,
      desc: `Sports event recommendations from ${preferredLeague}.`,
      cta: "View markets",
      bg: sportsBg,
    },
    {
      chip: "Promo",
      icon: "🎁",
      name: "Boost your next bet",
      desc: "Personalised offer combining sports and casino activity.",
      cta: "Claim offer",
      bg: promoBg,
    },
    {
      chip: "Trending",
      icon: "🔥",
      name: "Live picks today",
      desc: "Popular games and events other players are opening now.",
      cta: "Explore",
      bg: "linear-gradient(135deg, #281808, #604010)",
    },
  ];
};
