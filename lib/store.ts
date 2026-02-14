import { create } from "zustand";
import { Token, EventMarket, PortfolioPosition, HedgePosition } from "./types";
import { MOCK_TOKENS, MOCK_PORTFOLIO } from "./mock-data";

interface AppState {
  selectedToken: string | null;
  tokens: Token[];
  portfolioPositions: PortfolioPosition[];
  hedgePositions: HedgePosition[];

  // Actions
  setSelectedToken: (symbol: string) => void;
  getTokenBySymbol: (symbol: string) => Token | undefined;
  addPortfolioPosition: (position: PortfolioPosition) => void;
  addHedgePosition: (hedge: HedgePosition) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedToken: null,
  tokens: MOCK_TOKENS,
  portfolioPositions: MOCK_PORTFOLIO,
  hedgePositions: [],

  setSelectedToken: (symbol: string) => set({ selectedToken: symbol }),

  getTokenBySymbol: (symbol: string) => {
    return get().tokens.find((t) => t.symbol === symbol);
  },

  addPortfolioPosition: (position: PortfolioPosition) => {
    set((state) => ({
      portfolioPositions: [...state.portfolioPositions, position],
    }));
  },

  addHedgePosition: (hedge: HedgePosition) => {
    set((state) => ({
      hedgePositions: [...state.hedgePositions, hedge],
    }));
  },
}));
