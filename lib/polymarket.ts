import type { EventMarket } from "./types";

const POLYMARKET_BASE = "https://polymarket.com";

/**
 * Build Polymarket trade URL for an event market.
 * Uses polymarketSlug when available; otherwise falls back to events page with search.
 */
export function getPolymarketTradeUrl(event: EventMarket): string {
  if (event.polymarketSlug) {
    return `${POLYMARKET_BASE}/event/${event.polymarketSlug}`;
  }
  const q = encodeURIComponent(event.question);
  return `${POLYMARKET_BASE}/events?q=${q}`;
}
