"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatPrice, formatPercent, cn } from "@/lib/utils";
import { Shield, AlertTriangle, TrendingDown, Activity } from "lucide-react";

export default function RiskDashboardPage() {
  const tokens = useAppStore((state) => state.tokens);
  const portfolioPositions = useAppStore((state) => state.portfolioPositions);
  const eventMarkets = useAppStore((state) => state.eventMarkets);
  const [selectedToken, setSelectedToken] = useState("APT");

  const token = tokens.find((t) => t.symbol === selectedToken);
  const tokenPosition = portfolioPositions.find((p) => p.symbol === selectedToken);
  const relatedEvents = eventMarkets.filter((e) => e.token === selectedToken);

  const calculateVolatility = (token: any) => {
    const absChange = Math.abs(token.change24h);
    if (absChange < 2) return { level: "Low", color: "text-success" };
    if (absChange < 5) return { level: "Medium", color: "text-primary" };
    return { level: "High", color: "text-danger" };
  };

  const volatility = token ? calculateVolatility(token) : { level: "N/A", color: "text-text-tertiary" };

  const topRisks = [
    {
      id: 1,
      event: "Price drop >30% in 14 days",
      probability: 22,
      severity: "high",
      impact: "$462",
    },
    {
      id: 2,
      event: "Token unlock >5% supply",
      probability: 35,
      severity: "medium",
      impact: "$315",
    },
    {
      id: 3,
      event: "Network downtime event",
      probability: 8,
      severity: "low",
      impact: "$168",
    },
  ];

  const suggestedHedgeSize = tokenPosition
    ? (tokenPosition.currentValue * 0.3).toFixed(2)
    : "0.00";

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Risk Dashboard</h1>
        <p className="text-text-secondary">Monitor and manage risk exposure across your portfolio</p>
      </div>

      {/* Token Selector */}
      <div className="mb-6">
        <label className="text-sm text-text-tertiary mb-2 block">Select Token</label>
        <div className="flex gap-2">
          {tokens.map((t) => (
            <button
              key={t.symbol}
              onClick={() => setSelectedToken(t.symbol)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedToken === t.symbol
                  ? "bg-primary text-background"
                  : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/50"
              )}
            >
              {t.symbol}
            </button>
          ))}
        </div>
      </div>

      {token && (
        <>
          {/* Risk Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">Current Price</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">${formatPrice(token.price)}</div>
              <div className={cn(
                "text-sm mt-1",
                token.change24h >= 0 ? "text-success" : "text-danger"
              )}>
                {formatPercent(token.change24h)} (24h)
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">Volatility</span>
              </div>
              <div className={cn("text-3xl font-bold", volatility.color)}>
                {volatility.level}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                Based on 24h movement
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">Active Risks</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">{relatedEvents.length}</div>
              <div className="text-sm text-text-secondary mt-1">
                Monitored events
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-text-tertiary">Position Size</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                {tokenPosition ? tokenPosition.amount : 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                {token.symbol} tokens
              </div>
            </div>
          </div>

          {/* Top Risks */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Top Identified Risks</h2>
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-border bg-surface-light text-xs font-medium text-text-tertiary uppercase">
                <div>Risk Event</div>
                <div className="text-center">Probability</div>
                <div className="text-center">Severity</div>
                <div className="text-right">Potential Impact</div>
              </div>

              <div className="divide-y divide-border">
                {topRisks.map((risk) => (
                  <div key={risk.id} className="grid grid-cols-4 gap-4 px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm text-text-primary">{risk.event}</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-text-primary">{risk.probability}%</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                          risk.severity === "high" && "bg-danger/10 text-danger",
                          risk.severity === "medium" && "bg-primary/10 text-primary",
                          risk.severity === "low" && "bg-success/10 text-success"
                        )}
                      >
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end">
                      <span className="text-sm font-medium text-danger">{risk.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hedge Recommendation */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Suggested Hedge Strategy</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Based on your current {token.symbol} position of {tokenPosition?.amount || 0} tokens 
                  (${formatPrice(tokenPosition?.currentValue || 0)}), we recommend hedging with event markets.
                </p>

                <div className="bg-surface/50 backdrop-blur rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-tertiary">Recommended Hedge Size</span>
                    <span className="text-2xl font-bold text-primary">${suggestedHedgeSize}</span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    ~30% of position value
                  </div>
                </div>

                <div className="bg-surface/50 backdrop-blur rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">How this protects you:</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Buying 100 YES shares on "Will {token.symbol} drop {'>'} 30% in 14 days?" at $0.22 each 
                    costs $22. If {token.symbol} drops 30%, you receive $100 (100 shares × $1), offsetting 
                    ${formatPrice(tokenPosition ? tokenPosition.currentValue * 0.3 : 0)} in losses. This hedges approximately 30% of your downside risk.
                  </p>
                </div>

                <button className="mt-4 px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  View Hedge Markets for {token.symbol}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
