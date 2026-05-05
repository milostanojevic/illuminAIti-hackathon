export interface BKGame {
  name: string;
  bg: string;
  tag: string;
  tagColor: string;
}

export const BK_GAMES: BKGame[] = [
  { name: "Aviator", bg: "linear-gradient(135deg,#3a0808,#7a1010)", tag: "HOT", tagColor: "#e24b4a" },
  { name: "Crash King", bg: "linear-gradient(135deg,#08183a,#182870)", tag: "EXCL", tagColor: "#1a2b6b" },
  { name: "Space XY", bg: "linear-gradient(135deg,#082818,#145830)", tag: "NEW", tagColor: "#1a8c5b" },
  { name: "JetX", bg: "linear-gradient(135deg,#281808,#604010)", tag: "NEW", tagColor: "#1a8c5b" },
  { name: "King of Spins", bg: "linear-gradient(135deg,#180828,#481868)", tag: "EXCL", tagColor: "#1a2b6b" },
  { name: "Mines", bg: "linear-gradient(135deg,#082828,#085858)", tag: "EXCL", tagColor: "#1a2b6b" },
] as const;

export const GAME_COLORS: Record<string, string> = {
  Aviator: "linear-gradient(135deg,#3a0808,#7a1010)",
  "Crash King": "linear-gradient(135deg,#08183a,#182870)",
  "Space XY": "linear-gradient(135deg,#082818,#145830)",
  JetX: "linear-gradient(135deg,#281808,#604010)",
  "King of Spins": "linear-gradient(135deg,#180828,#481868)",
  Mines: "linear-gradient(135deg,#082828,#085858)",
} as const;
