import type { ProviderKey } from "@/types/brand";

export interface SSGame {
  name: string;
  bg: string;
  tag: string;
  icon: string;
}

export const SS_GAMES: Record<ProviderKey, SSGame[]> = {
  habanero: [
    { name: "Hot Hot Fruit", bg: "linear-gradient(135deg,#2a0060,#9b008b)", tag: "HOT", icon: "🍉" },
    { name: "Mystic Fortune Deluxe", bg: "linear-gradient(135deg,#0a3020,#1a7a40)", tag: "", icon: "🌺" },
    { name: "Wild Trucks", bg: "linear-gradient(135deg,#1a0a00,#6b2800)", tag: "", icon: "🚛" },
    { name: "Disco Beats", bg: "linear-gradient(135deg,#10006a,#7000bb)", tag: "NEW", icon: "🕺" },
    { name: "Laughing Buddha", bg: "linear-gradient(135deg,#3a1800,#9a5000)", tag: "", icon: "🪙" },
    { name: "Lantern Luck", bg: "linear-gradient(135deg,#3a0010,#aa0030)", tag: "", icon: "🏮" },
    { name: "New Years Bash", bg: "linear-gradient(135deg,#1a0040,#6a00aa)", tag: "NEW", icon: "🎆" },
    { name: "Wealth Inn", bg: "linear-gradient(135deg,#3a1000,#8a3800)", tag: "", icon: "🏯" },
  ],
  spribe: [
    { name: "Aviator", bg: "linear-gradient(135deg,#2a0000,#aa0000)", tag: "HOT", icon: "✈️" },
    { name: "Mines", bg: "linear-gradient(135deg,#003020,#006a40)", tag: "", icon: "💣" },
    { name: "Plinko", bg: "linear-gradient(135deg,#001060,#0030bb)", tag: "NEW", icon: "🎯" },
    { name: "Goal", bg: "linear-gradient(135deg,#003a10,#007a30)", tag: "", icon: "⚽" },
    { name: "Hilo", bg: "linear-gradient(135deg,#200040,#700090)", tag: "", icon: "🃏" },
    { name: "Dice", bg: "linear-gradient(135deg,#1a1a1a,#444444)", tag: "", icon: "🎲" },
  ],
  pragmatic: [
    { name: "Gates of Olympus", bg: "linear-gradient(135deg,#1a0040,#7a00cc)", tag: "HOT", icon: "⚡" },
    { name: "Sugar Rush 1000", bg: "linear-gradient(135deg,#4a0060,#cc00cc)", tag: "", icon: "🍬" },
    { name: "Gates of Olympus 1000", bg: "linear-gradient(135deg,#1a0050,#6600cc)", tag: "", icon: "🏛" },
    { name: "Joker's Jewels", bg: "linear-gradient(135deg,#000a60,#0020cc)", tag: "", icon: "💎" },
    { name: "Sweet Bonanza 1000", bg: "linear-gradient(135deg,#3a0050,#bb00aa)", tag: "", icon: "🍭" },
    { name: "5 Lions Megaways", bg: "linear-gradient(135deg,#3a0800,#9a1800)", tag: "", icon: "🦁" },
    { name: "Fire Strike", bg: "linear-gradient(135deg,#3a0200,#cc0800)", tag: "HOT", icon: "🔥" },
    { name: "Chests of Cai Shen", bg: "linear-gradient(135deg,#001a10,#006a30)", tag: "", icon: "🀄" },
  ],
  netent: [
    { name: "777 Strike", bg: "linear-gradient(135deg,#002200,#006600)", tag: "HOT", icon: "7️⃣" },
    { name: "Fortune House", bg: "linear-gradient(135deg,#3a1000,#cc4400)", tag: "", icon: "🏠" },
    { name: "Mega Jade", bg: "linear-gradient(135deg,#003010,#007a30)", tag: "", icon: "💚" },
    { name: "Jade Charms", bg: "linear-gradient(135deg,#002a20,#006a50)", tag: "NEW", icon: "🔮" },
    { name: "Jester Spins", bg: "linear-gradient(135deg,#100030,#4400aa)", tag: "", icon: "🃏" },
  ],
  betgames: [
    { name: "Bet on Poker", bg: "linear-gradient(135deg,#1a0030,#5a0088)", tag: "", icon: "♠️" },
    { name: "Lucky 5", bg: "linear-gradient(135deg,#003a10,#009a30)", tag: "HOT", icon: "🍀" },
    { name: "Bet on Baccarat", bg: "linear-gradient(135deg,#200030,#700080)", tag: "", icon: "🎴" },
    { name: "Wheel of Fortune", bg: "linear-gradient(135deg,#3a1800,#9a4400)", tag: "NEW", icon: "🎡" },
    { name: "War of Bets", bg: "linear-gradient(135deg,#1a0000,#660000)", tag: "", icon: "⚔️" },
  ],
  evolution: [
    { name: "Crazy Time", bg: "linear-gradient(135deg,#3a0000,#cc0000)", tag: "HOT", icon: "🎡" },
    { name: "777 Strike", bg: "linear-gradient(135deg,#002200,#006600)", tag: "", icon: "7️⃣" },
    { name: "Thor's Rage", bg: "linear-gradient(135deg,#000a50,#001aaa)", tag: "", icon: "⚡" },
    { name: "Duck Hunters", bg: "linear-gradient(135deg,#0a1800,#204000)", tag: "", icon: "🦆" },
    { name: "Jester Spins", bg: "linear-gradient(135deg,#100030,#4400aa)", tag: "NEW", icon: "🎪" },
    { name: "Mega Jade", bg: "linear-gradient(135deg,#003010,#007a30)", tag: "", icon: "💚" },
    { name: "Fortune House", bg: "linear-gradient(135deg,#3a1000,#cc4400)", tag: "", icon: "🏮" },
    { name: "Jade Charms", bg: "linear-gradient(135deg,#002a20,#006a50)", tag: "", icon: "🀄" },
  ],
} as const;
