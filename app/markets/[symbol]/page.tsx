"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { TradingPanel } from "@/components/TradingPanel";
import { EventMarketCard } from "@/components/EventMarketCard";
import { TradingSessionBanner } from "@/components/TradingSessionBanner";
import { usePolymarketEvents } from "@/hooks/usePolymarketEvents";
import { Shield, Loader2 } from "lucide-react";

export default function TradingPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  const token = useAppStore((state) => state.getTokenBySymbol(symbol));
  const setSelectedToken = useAppStore((state) => state.setSelectedToken);
  const { data: eventMarkets = [], isLoading } = usePolymarketEvents(15);

  useEffect(() => {
    if (!token) {
      router.push("/markets");
      return;
    }
    setSelectedToken(symbol);
  }, [token, symbol, setSelectedToken, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Left: Trading Interface */}
      <div className="flex-1 border-r border-border">
        <TradingPanel token={token} />
      </div>

      {/* Right: Event Markets (Hedging Panel) */}
      <div className="w-96 bg-surface overflow-auto scrollbar-thin">
        <div className="sticky top-0 bg-surface border-b border-border px-4 py-4 z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Hedge Risk</h2>
          </div>
          <p className="text-xs text-text-secondary">
            Protect your {token.symbol} position against specific risks
          </p>
        </div>

        <div className="p-4 space-y-4">
          <TradingSessionBanner />
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading Polymarket events…</span>
            </div>
          ) : eventMarkets.length > 0 ? (
            eventMarkets.map((event) => (
              <EventMarketCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary">
                No Polymarket events available right now
              </p>
            </div>
          )}
        </div>

        {eventMarkets.length > 0 && (
          <div className="p-4 border-t border-border bg-surface-light">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-primary mb-2">
                How Hedging Works
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Buy YES shares if you think the event will happen. If it does,
                you receive $1 per share. This helps offset losses in your token
                position if adverse events occur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
