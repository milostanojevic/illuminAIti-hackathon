import type { Brand } from "@/types/brand";
import { brandGradients } from "@/lib/brand/designTokens";

export type TrendingCard = {
  chip: string;
  icon: string;
  name: string;
  desc: string;
  cta: string;
  bg: string;
};

/** Curated “most popular” row when onboarding did not capture meaningful prefs (local POC). */
export const buildPopularDefaultCards = (brand: Brand): TrendingCard[] => {
  const isBk = brand === "bk";
  const g = isBk ? brandGradients.bk : brandGradients.ss;
  const casinoBg = g.cardCasino;
  const sportsBg = g.cardSports;
  const promoBg = g.promo;

  return [
    {
      chip: "Hot right now",
      icon: "🎰",
      name: "Aviator",
      desc: "Most-played crash game across the lobby this hour.",
      cta: "Play now",
      bg: casinoBg,
    },
    {
      chip: "Top event",
      icon: "⚽",
      name: "EPL derby night",
      desc: "The busiest football market tonight — odds moving fast.",
      cta: "View markets",
      bg: sportsBg,
    },
    {
      chip: "Player favourite",
      icon: "🎲",
      name: "Mega wheel live",
      desc: "Huge spin volume — join the busiest live table.",
      cta: "Take a seat",
      bg: "linear-gradient(135deg, #2a1438, #5c1f4a)",
    },
    {
      chip: "Trending promo",
      icon: "🎁",
      name: "Weekend boost bundle",
      desc: "The offer everyone is activating before kickoff.",
      cta: "Claim offer",
      bg: promoBg,
    },
  ];
};

export const buildTrendingCards = (
  brand: Brand,
  preferredTeam: string,
  preferredLeague: string,
  preferredGame: string
): TrendingCard[] => {
  const isBk = brand === "bk";
  const g = isBk ? brandGradients.bk : brandGradients.ss;
  const casinoBg = g.cardCasino;
  const sportsBg = g.cardSports;
  const promoBg = g.promo;

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
