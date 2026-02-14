import { Token, PortfolioPosition } from "./types";

export const MOCK_TOKENS: Token[] = [
  {
    symbol: "APT",
    name: "Aptos",
    price: 8.40,
    change24h: -3.24,
    volume24h: 124500000,
    riskScore: "medium",
  },
  {
    symbol: "OP",
    name: "Optimism",
    price: 3.12,
    change24h: 1.87,
    volume24h: 89200000,
    riskScore: "low",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2800.00,
    change24h: 0.45,
    volume24h: 8950000000,
    riskScore: "low",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    price: 1.50,
    change24h: -1.12,
    volume24h: 156700000,
    riskScore: "medium",
  },
];

export const MOCK_ORDER_BOOK = {
  bids: [
    { price: 8.39, amount: 1250, total: 10487.5 },
    { price: 8.38, amount: 2300, total: 19274 },
    { price: 8.37, amount: 890, total: 7449.3 },
    { price: 8.36, amount: 3400, total: 28424 },
    { price: 8.35, amount: 1670, total: 13944.5 },
    { price: 8.34, amount: 2100, total: 17514 },
    { price: 8.33, amount: 950, total: 7913.5 },
    { price: 8.32, amount: 1800, total: 14976 },
  ],
  asks: [
    { price: 8.40, amount: 1100, total: 9240 },
    { price: 8.41, amount: 2450, total: 20604.5 },
    { price: 8.42, amount: 780, total: 6567.6 },
    { price: 8.43, amount: 3200, total: 26976 },
    { price: 8.44, amount: 1520, total: 12828.8 },
    { price: 8.45, amount: 2250, total: 19012.5 },
    { price: 8.46, amount: 890, total: 7529.4 },
    { price: 8.47, amount: 1900, total: 16093 },
  ],
};

export const MOCK_PORTFOLIO: PortfolioPosition[] = [
  {
    id: "1",
    type: "token",
    symbol: "APT",
    amount: 250,
    entryPrice: 8.65,
    currentValue: 2100,
    pnl: -62.5,
    pnlPercent: -2.89,
  },
  {
    id: "2",
    type: "token",
    symbol: "ETH",
    amount: 1.5,
    entryPrice: 2750,
    currentValue: 4200,
    pnl: 75,
    pnlPercent: 1.82,
  },
  {
    id: "3",
    type: "event",
    eventId: 1,
    amount: 100,
    entryPrice: 0.22,
    currentValue: 22,
    pnl: 0,
    pnlPercent: 0,
  },
];
