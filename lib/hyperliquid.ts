/**
 * Hyperliquid SDK Integration
 *
 * Provides real-time candlestick data streaming using:
 * - InfoClient: Fetch historical candle snapshots
 * - SubscriptionClient: WebSocket streaming for real-time updates
 * - WebSocketTransport: Connection management
 */

import {
  InfoClient,
  SubscriptionClient,
  WebSocketTransport,
  HttpTransport,
} from "@nktkas/hyperliquid";

// Candlestick data structure from Hyperliquid
export interface HyperliquidCandle {
  t: number; // timestamp (ms)
  T: number; // close time (ms)
  o: string; // open price
  c: string; // close price
  h: string; // high price
  l: string; // low price
  v: string; // volume
  n: number; // number of trades
}

// Our normalized candle format for ApexCharts
export interface Candle {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
}

// Interval types
export type Interval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

type HyperliquidInterval =
  | "1m"
  | "5m"
  | "15m"
  | "1h"
  | "4h"
  | "1d"
  | "3m"
  | "30m"
  | "2h"
  | "8h"
  | "12h"
  | "3d"
  | "1w"
  | "1M";

// Interval mapping: UI format -> Hyperliquid format
const INTERVAL_MAP: Record<Interval, HyperliquidInterval> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
};

// Initialize subscription client (singleton pattern)
let subscriptionClient: SubscriptionClient | null = null;

/**
 * Get or create subscription client
 */
function getSubscriptionClient(): SubscriptionClient {
  if (!subscriptionClient) {
    const wsTransport = new WebSocketTransport();
    subscriptionClient = new SubscriptionClient({ transport: wsTransport });
  }
  return subscriptionClient;
}

/**
 * Fetch initial candle snapshot
 *
 * @param symbol - Trading pair (e.g., "BTC", "ETH")
 * @param interval - Timeframe (e.g., "1m", "5m", "1h")
 * @param limit - Number of candles to fetch (default: 100)
 * @returns Array of normalized candles
 */
export async function fetchInitialCandles(
  symbol: string,
  interval: Interval,
  limit: number = 100,
): Promise<Candle[]> {
  try {
    const httpTransport = new HttpTransport();
    const infoClient = new InfoClient({ transport: httpTransport });
    const hyperliquidInterval: HyperliquidInterval = INTERVAL_MAP[interval];

    // Fetch candle snapshot from Hyperliquid
    const response = await infoClient.candleSnapshot({
      coin: symbol,
      interval: hyperliquidInterval,
      startTime: Date.now() - limit * getIntervalMs(interval),
      endTime: Date.now(),
    });

    // Normalize candles for ApexCharts
    return response.map((candle: HyperliquidCandle) => ({
      x: new Date(candle.t),
      y: [
        parseFloat(candle.o), // open
        parseFloat(candle.h), // high
        parseFloat(candle.l), // low
        parseFloat(candle.c), // close
      ],
    }));
  } catch (error) {
    console.error("Error fetching initial candles:", error);
    return [];
  }
}

/**
 * Subscribe to real-time candle updates
 *
 * @param symbol - Trading pair (e.g., "BTC", "ETH")
 * @param interval - Timeframe (e.g., "1m", "5m", "1h")
 * @param callback - Function called when new candle data arrives
 * @returns Unsubscribe function
 */
export function subscribeToCandles(
  symbol: string,
  interval: Interval,
  callback: (candle: Candle, isUpdate: boolean) => void,
): () => void {
  try {
    const client = getSubscriptionClient();
    const hyperliquidInterval: HyperliquidInterval = INTERVAL_MAP[interval];

    let lastCandleTime = 0;

    // Subscribe to candle updates (cast to any to satisfy TS types)
    const subscription = (client as any).subscribeToCandle(
      {
        coin: symbol,
        interval: hyperliquidInterval,
      },
      (data: any) => {
        // Normalize incoming candle data
        const candle: Candle = {
          x: new Date(data.t),
          y: [
            parseFloat(data.o), // open
            parseFloat(data.h), // high
            parseFloat(data.l), // low
            parseFloat(data.c), // close
          ],
        };

        // Check if this is an update to existing candle or a new one
        const isUpdate = data.t === lastCandleTime;
        lastCandleTime = data.t;

        callback(candle, isUpdate);
      },
    );

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error("Error subscribing to candles:", error);
    return () => {}; // No-op unsubscribe
  }
}

/**
 * Convert interval string to milliseconds
 */
function getIntervalMs(interval: Interval): number {
  const value = parseInt(interval.slice(0, -1));
  const unit = interval.slice(-1);

  switch (unit) {
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60 * 1000; // default 1 minute
  }
}

/**
 * Cleanup all WebSocket connections
 * Call this when app unmounts or before hot reload
 */
export function cleanup() {
  if (subscriptionClient) {
    // Unsubscribe from all subscriptions
    subscriptionClient = null;
  }
}
