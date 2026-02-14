"use client";

import { useState } from "react";
import { EventMarket } from "@/lib/types";
import { formatProbability, formatVolume, cn } from "@/lib/utils";
import { getPolymarketTradeUrl } from "@/lib/polymarket";
import { useTrading } from "@/providers/TradingProvider";
import useClobOrder from "@/hooks/useClobOrder";
import { Info, Clock, ExternalLink } from "lucide-react";

interface EventMarketCardProps {
  event: EventMarket;
}

export function EventMarketCard({ event }: EventMarketCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
    null,
  );

  const { isTradingSessionComplete, clobClient, eoaAddress } = useTrading();
  const { submitOrder, isSubmitting } = useClobOrder(clobClient, eoaAddress);

  const canPlaceOrderInApp =
    isTradingSessionComplete &&
    clobClient &&
    eoaAddress &&
    ((selectedOutcome === "yes" && event.clobTokenIdYes) ||
      (selectedOutcome === "no" && event.clobTokenIdNo));

  const handlePlaceBet = async () => {
    if (!amount || !selectedOutcome) {
      alert("Please enter an amount and select YES or NO");
      return;
    }

    const shares = parseFloat(amount);
    if (isNaN(shares) || shares <= 0) {
      alert("Please enter a valid number of shares");
      return;
    }

    if (canPlaceOrderInApp) {
      try {
        const tokenId =
          selectedOutcome === "yes"
            ? event.clobTokenIdYes!
            : event.clobTokenIdNo!;
        const price =
          selectedOutcome === "yes"
            ? event.yesProbability
            : event.noProbability;
        await submitOrder({
          tokenId,
          size: shares,
          price,
          side: "BUY",
          negRisk: false,
        });
        alert("Order placed successfully!");
      } catch (err: any) {
        alert(err?.message ?? "Order failed");
      }
    } else {
      window.open(getPolymarketTradeUrl(event), "_blank");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
      {/* Question */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary flex-1 pr-2">
          {event.question}
        </h3>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-6 w-64 bg-surface-light border border-border rounded-lg p-3 shadow-xl z-10">
              <p className="text-xs text-text-secondary">{event.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Probabilities */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          onClick={() => setSelectedOutcome("yes")}
          className={cn(
            "bg-surface-light border rounded-lg p-3 cursor-pointer transition-all",
            selectedOutcome === "yes"
              ? "border-success bg-success/5"
              : "border-border hover:border-success/50",
          )}
        >
          <div className="text-xs text-text-tertiary mb-1">YES</div>
          <div className="text-2xl font-bold text-success">
            {formatProbability(event.yesProbability)}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            ${event.yesProbability.toFixed(2)} per share
          </div>
        </div>

        <div
          onClick={() => setSelectedOutcome("no")}
          className={cn(
            "bg-surface-light border rounded-lg p-3 cursor-pointer transition-all",
            selectedOutcome === "no"
              ? "border-danger bg-danger/5"
              : "border-border hover:border-danger/50",
          )}
        >
          <div className="text-xs text-text-tertiary mb-1">NO</div>
          <div className="text-2xl font-bold text-danger">
            {formatProbability(event.noProbability)}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            ${event.noProbability.toFixed(2)} per share
          </div>
        </div>
      </div>

      {/* Amount Input */}
      {selectedOutcome && (
        <div className="mb-3">
          <label className="text-xs text-text-tertiary mb-2 block">
            Number of Shares
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
            placeholder="Enter amount"
          />
          {amount && (
            <div className="text-xs text-text-secondary mt-1">
              Estimated cost: $
              {(
                parseFloat(amount) *
                (selectedOutcome === "yes"
                  ? event.yesProbability
                  : event.noProbability)
              ).toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {selectedOutcome && (
        <>
          <button
            onClick={handlePlaceBet}
            disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
            className={cn(
              "w-full py-2 rounded-lg text-sm font-medium transition-colors mb-2 flex items-center justify-center gap-2",
              selectedOutcome === "yes"
                ? "bg-success hover:bg-success/90 text-white disabled:opacity-70"
                : "bg-danger hover:bg-danger/90 text-white disabled:opacity-70",
            )}
          >
            {isSubmitting
              ? "Placing..."
              : canPlaceOrderInApp
                ? `Buy ${selectedOutcome.toUpperCase()} (gasless)`
                : "Place bet on Polymarket"}
          </button>
          {canPlaceOrderInApp && (
            <a
              href={getPolymarketTradeUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-text-tertiary hover:text-primary transition-colors"
            >
              Open on Polymarket <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </>
      )}

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-text-tertiary pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{event.expiresIn}</span>
        </div>
        <div>Liquidity: {formatVolume(event.liquidity)}</div>
      </div>
    </div>
  );
}
