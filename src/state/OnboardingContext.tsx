"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { OnboardingState } from "@/types/preferences";
import type { Brand, LeagueKey, ProviderKey, PromoKey, RiskLevel, SessionStyle } from "@/types/brand";
import { writeStoredPreferences, createDefaultOnboardingState } from "@/lib/storedPreferences";

type Action =
  | { type: "SET_BRAND"; payload: Brand }
  | { type: "TOGGLE_LEAGUE"; payload: LeagueKey }
  | { type: "TOGGLE_TEAM"; payload: string }
  | { type: "TOGGLE_CASINO_GAME"; payload: string }
  | { type: "TOGGLE_PROVIDER"; payload: ProviderKey }
  | { type: "TOGGLE_SS_GAME"; payload: string }
  | { type: "TOGGLE_SS_GAME_DETAIL"; payload: { name: string; thumbnailUrl: string; providerKey: ProviderKey } }
  | { type: "SET_RISK"; payload: RiskLevel }
  | { type: "SET_SESSION"; payload: SessionStyle }
  | { type: "TOGGLE_PROMO"; payload: PromoKey }
  | { type: "HYDRATE"; payload: OnboardingState }
  | { type: "RESET" };

type OnboardingContextValue = {
  state: OnboardingState;
  hydrate: (payload: OnboardingState) => void;
  setBrand: (brand: Brand) => void;
  toggleLeague: (league: LeagueKey) => void;
  toggleTeam: (team: string) => void;
  toggleCasinoGame: (game: string) => void;
  toggleProvider: (provider: ProviderKey) => void;
  toggleSSGame: (game: string) => void;
  toggleSSGameDetail: (payload: { name: string; thumbnailUrl: string; providerKey: ProviderKey }) => void;
  setRisk: (risk: RiskLevel) => void;
  setSession: (session: SessionStyle) => void;
  togglePromo: (promo: PromoKey) => void;
  reset: () => void;
};

const defaultState = (): OnboardingState => createDefaultOnboardingState();

const toggle = <T,>(arr: T[], item: T): T[] =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

const toggleWithMax = <T,>(arr: T[], item: T, max: number): T[] => {
  if (arr.includes(item)) return arr.filter((i) => i !== item);
  if (arr.length >= max) return arr;
  return [...arr, item];
};

const reducer = (state: OnboardingState, action: Action): OnboardingState => {
  switch (action.type) {
    case "SET_BRAND":
      return { ...defaultState(), brand: action.payload };
    case "TOGGLE_LEAGUE":
      return { ...state, leagues: toggle(state.leagues, action.payload) };
    case "TOGGLE_TEAM":
      return { ...state, teams: toggle(state.teams, action.payload) };
    case "TOGGLE_CASINO_GAME":
      return { ...state, casinoGames: toggleWithMax(state.casinoGames, action.payload, 4) };
    case "TOGGLE_PROVIDER":
      return { ...state, providers: toggle(state.providers, action.payload) };
    case "TOGGLE_SS_GAME": {
      const name = action.payload;
      const thumbs = { ...state.ssGameThumbs };
      const provs = { ...state.ssGameProviders };
      if (state.ssGames.includes(name)) {
        const ssGames = state.ssGames.filter((n) => n !== name);
        delete thumbs[name];
        delete provs[name];
        return { ...state, ssGames, ssGameThumbs: thumbs, ssGameProviders: provs };
      }
      return {
        ...state,
        ssGames: [...state.ssGames, name],
        ssGameThumbs: { ...thumbs, [name]: thumbs[name] ?? "" },
        ssGameProviders: provs,
      };
    }
    case "TOGGLE_SS_GAME_DETAIL": {
      const { name, thumbnailUrl, providerKey } = action.payload;
      const thumbs = { ...state.ssGameThumbs };
      const provs = { ...state.ssGameProviders };
      if (state.ssGames.includes(name)) {
        const ssGames = state.ssGames.filter((n) => n !== name);
        delete thumbs[name];
        delete provs[name];
        return { ...state, ssGames, ssGameThumbs: thumbs, ssGameProviders: provs };
      }
      return {
        ...state,
        ssGames: [...state.ssGames, name],
        ssGameThumbs: { ...thumbs, [name]: thumbnailUrl },
        ssGameProviders: { ...provs, [name]: providerKey },
      };
    }
    case "SET_RISK":
      return { ...state, style: { ...state.style, risk: action.payload } };
    case "SET_SESSION":
      return { ...state, style: { ...state.style, session: action.payload } };
    case "TOGGLE_PROMO":
      return { ...state, style: { ...state.style, promos: toggle(state.style.promos, action.payload) } };
    case "HYDRATE": {
      const p = action.payload;
      return {
        ...p,
        ssGameThumbs: p.ssGameThumbs ?? {},
        ssGameProviders: p.ssGameProviders ?? {},
      };
    }
    case "RESET":
      return defaultState();
  }
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => defaultState());
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const skipPersistRef = useRef(true);

  const hydrate = useCallback((payload: OnboardingState) => {
    dispatch({ type: "HYDRATE", payload });
  }, []);

  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    if (!pathnameRef.current?.startsWith("/onboarding")) return;
    writeStoredPreferences(state);
  }, [state]);

  const value: OnboardingContextValue = {
    state,
    hydrate,
    setBrand: (brand) => dispatch({ type: "SET_BRAND", payload: brand }),
    toggleLeague: (league) => dispatch({ type: "TOGGLE_LEAGUE", payload: league }),
    toggleTeam: (team) => dispatch({ type: "TOGGLE_TEAM", payload: team }),
    toggleCasinoGame: (game) => dispatch({ type: "TOGGLE_CASINO_GAME", payload: game }),
    toggleProvider: (provider) => dispatch({ type: "TOGGLE_PROVIDER", payload: provider }),
    toggleSSGame: (game) => dispatch({ type: "TOGGLE_SS_GAME", payload: game }),
    toggleSSGameDetail: (payload) => dispatch({ type: "TOGGLE_SS_GAME_DETAIL", payload }),
    setRisk: (risk) => dispatch({ type: "SET_RISK", payload: risk }),
    setSession: (session) => dispatch({ type: "SET_SESSION", payload: session }),
    togglePromo: (promo) => dispatch({ type: "TOGGLE_PROMO", payload: promo }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
