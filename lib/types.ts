export interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  riskScore: "low" | "medium" | "high";
}

export interface EventMarket {
  id: number;
  token: string;
  question: string;
  yesProbability: number;
  noProbability: number;
  liquidity: number;
  description: string;
  expiresIn: string;
}

export interface PortfolioPosition {
  id: string;
  type: "token" | "event";
  symbol?: string;
  eventId?: number;
  amount: number;
  entryPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface HedgePosition {
  id: string;
  tokenSymbol: string;
  eventMarketId: number;
  sharesYes: number;
  sharesNo: number;
  totalCost: number;
  protectionPercent: number;
}

export type OrderType = "limit" | "market";
export type OrderSide = "buy" | "sell";
