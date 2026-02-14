"use client";

import { useQuery } from "@tanstack/react-query";
import type { EventMarket } from "@/lib/types";

interface GammaMarket {
  id: string;
  question?: string;
  description?: string;
  slug?: string;
  clobTokenIds?: string;
  outcomePrices?: string;
  outcomes?: string;
  liquidity?: string;
  volume?: string;
  endDate?: string;
  enableOrderBook?: boolean;
}

interface GammaEvent {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  endDate?: string;
  markets?: GammaMarket[];
  liquidity?: number;
}

function parseEventToMarkets(event: GammaEvent): EventMarket[] {
  const markets = event.markets ?? [];
  const slug = event.slug ?? event.id;
  const results: EventMarket[] = [];

  for (const m of markets) {
    if (!m.enableOrderBook || !m.clobTokenIds || !m.question) continue;

    let tokenIds: string[] = [];
    try {
      tokenIds = JSON.parse(m.clobTokenIds) as string[];
    } catch {
      continue;
    }
    if (tokenIds.length < 2) continue;

    let yesPrice = 0.5;
    let noPrice = 0.5;
    if (m.outcomePrices) {
      try {
        const prices = JSON.parse(m.outcomePrices) as string[];
        if (prices.length >= 2) {
          yesPrice = parseFloat(prices[0]) || 0.5;
          noPrice = parseFloat(prices[1]) || 0.5;
        }
      } catch {
        // use 0.5 / 0.5
      }
    }

    const liquidityNum = m.liquidity ? parseFloat(String(m.liquidity)) : 0;
    const endDate = m.endDate ?? event.endDate;
    const expiresIn = endDate
      ? new Date(endDate) > new Date()
        ? `Ends ${new Date(endDate).toLocaleDateString()}`
        : "Ended"
      : "—";

    results.push({
      id: m.id,
      question: m.question,
      yesProbability: yesPrice,
      noProbability: noPrice,
      liquidity: liquidityNum,
      description: m.description ?? event.description ?? "",
      expiresIn,
      clobTokenIdYes: tokenIds[0],
      clobTokenIdNo: tokenIds[1],
      polymarketSlug: m.slug ?? slug,
    });
  }

  return results;
}

export function usePolymarketEvents(limit = 20) {
  return useQuery({
    queryKey: ["polymarket-events", limit],
    queryFn: async (): Promise<EventMarket[]> => {
      const res = await fetch(
        `/api/polymarket/events?limit=${limit}&closed=false`
      );
      if (!res.ok) throw new Error("Failed to fetch Polymarket events");
      const events: GammaEvent[] = await res.json();
      const markets: EventMarket[] = [];
      for (const e of events) {
        markets.push(...parseEventToMarkets(e));
      }
      return markets;
    },
    staleTime: 60_000,
  });
}
