"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatPrice, formatPercent, formatVolume, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function MarketsPage() {
  const tokens = useAppStore((state) => state.tokens);

  const getRiskBadge = (riskScore: string) => {
    switch (riskScore) {
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
            Low Risk
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
            Medium Risk
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-danger/10 text-danger">
            High Risk
          </span>
        );
    }
  };

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Markets</h1>
        <p className="text-text-secondary">Trade tokens and hedge your risk with event markets</p>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border bg-surface-light text-xs font-medium text-text-tertiary uppercase">
          <div>Token</div>
          <div className="text-right">Price</div>
          <div className="text-right">24h Change</div>
          <div className="text-right">24h Volume</div>
          <div className="text-center">Risk Score</div>
          <div className="text-right">Action</div>
        </div>

        <div className="divide-y divide-border">
          {tokens.map((token) => (
            <Link
              key={token.symbol}
              href={`/markets/${token.symbol}`}
              className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-surface-light transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-light flex items-center justify-center border border-border">
                  <span className="text-sm font-bold text-primary">{token.symbol}</span>
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{token.symbol}</div>
                  <div className="text-sm text-text-tertiary">{token.name}</div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-text-primary font-medium">${formatPrice(token.price)}</span>
              </div>

              <div className="flex items-center justify-end">
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    token.change24h >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {token.change24h >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatPercent(token.change24h)}
                </span>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-text-secondary">{formatVolume(token.volume24h)}</span>
              </div>

              <div className="flex items-center justify-center">
                {getRiskBadge(token.riskScore)}
              </div>

              <div className="flex items-center justify-end">
                <button className="px-4 py-1.5 rounded bg-primary text-background text-sm font-medium hover:bg-primary-dark transition-colors">
                  Trade
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-surface rounded-lg border border-border p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Risk Management</h3>
            <p className="text-sm text-text-secondary">
              Click on any token to access the trading interface and view related event markets. 
              Use event markets to hedge your positions against specific risks like price drops, 
              network outages, or token unlocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
