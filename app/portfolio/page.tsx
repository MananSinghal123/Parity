"use client";

import { useAppStore } from "@/lib/store";
import { formatPrice, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Briefcase, Shield } from "lucide-react";

export default function PortfolioPage() {
  const portfolioPositions = useAppStore((state) => state.portfolioPositions);
  const tokens = useAppStore((state) => state.tokens);
  const eventMarkets = useAppStore((state) => state.eventMarkets);

  const totalValue = portfolioPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalPnl = portfolioPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  const tokenPositions = portfolioPositions.filter((p) => p.type === "token");
  const eventPositions = portfolioPositions.filter((p) => p.type === "event");

  const getEventDetails = (eventId: number) => {
    return eventMarkets.find((e) => e.id === eventId);
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Portfolio</h1>
        <p className="text-text-secondary">Track your token holdings and event positions</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-text-tertiary" />
            <span className="text-sm text-text-tertiary">Total Value</span>
          </div>
          <div className="text-3xl font-bold text-text-primary">${formatPrice(totalValue)}</div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            {totalPnl >= 0 ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-danger" />
            )}
            <span className="text-sm text-text-tertiary">Total P&L</span>
          </div>
          <div className={cn(
            "text-3xl font-bold",
            totalPnl >= 0 ? "text-success" : "text-danger"
          )}>
            {totalPnl >= 0 ? "+" : ""}${formatPrice(Math.abs(totalPnl))}
          </div>
          <div className={cn(
            "text-sm",
            totalPnl >= 0 ? "text-success" : "text-danger"
          )}>
            {formatPercent(totalPnlPercent)}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-text-tertiary">Active Hedges</span>
          </div>
          <div className="text-3xl font-bold text-text-primary">{eventPositions.length}</div>
          <div className="text-sm text-text-secondary">
            ${formatPrice(eventPositions.reduce((sum, p) => sum + p.currentValue, 0))} protected
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Token Holdings</h2>
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border bg-surface-light text-xs font-medium text-text-tertiary uppercase">
            <div>Token</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Entry Price</div>
            <div className="text-right">Current Value</div>
            <div className="text-right">P&L</div>
            <div className="text-right">P&L %</div>
          </div>

          <div className="divide-y divide-border">
            {tokenPositions.map((position) => {
              const token = tokens.find((t) => t.symbol === position.symbol);
              return (
                <div key={position.id} className="grid grid-cols-6 gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-surface-light flex items-center justify-center border border-border">
                      <span className="text-sm font-bold text-primary">{position.symbol}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{position.symbol}</div>
                      <div className="text-sm text-text-tertiary">{token?.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="text-text-primary">{position.amount}</span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="text-text-secondary">${formatPrice(position.entryPrice)}</span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="text-text-primary font-medium">${formatPrice(position.currentValue)}</span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className={cn(
                      "font-medium",
                      position.pnl >= 0 ? "text-success" : "text-danger"
                    )}>
                      {position.pnl >= 0 ? "+" : ""}${formatPrice(Math.abs(position.pnl))}
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className={cn(
                      "font-medium",
                      position.pnlPercent >= 0 ? "text-success" : "text-danger"
                    )}>
                      {formatPercent(position.pnlPercent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Positions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Event Positions (Hedges)</h2>
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {eventPositions.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border bg-surface-light text-xs font-medium text-text-tertiary uppercase">
                <div className="col-span-2">Event</div>
                <div className="text-right">Shares</div>
                <div className="text-right">Entry Price</div>
                <div className="text-right">Current Value</div>
              </div>

              <div className="divide-y divide-border">
                {eventPositions.map((position) => {
                  const event = getEventDetails(position.eventId!);
                  return (
                    <div key={position.id} className="grid grid-cols-5 gap-4 px-6 py-4">
                      <div className="col-span-2">
                        <div className="text-sm text-text-primary mb-1">{event?.question}</div>
                        <div className="text-xs text-text-tertiary">Expires in {event?.expiresIn}</div>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-text-primary">{position.amount}</span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-text-secondary">${formatPrice(position.entryPrice)}</span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-text-primary font-medium">${formatPrice(position.currentValue)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary">No active hedges</p>
              <p className="text-sm text-text-tertiary mt-1">
                Visit token trading pages to hedge your positions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hedge Effectiveness */}
      {eventPositions.length > 0 && (
        <div className="mt-6 bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Hedge Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Token exposure</span>
              <span className="text-text-primary font-medium">
                ${formatPrice(tokenPositions.reduce((sum, p) => sum + p.currentValue, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Hedge coverage</span>
              <span className="text-text-primary font-medium">
                ${formatPrice(eventPositions.reduce((sum, p) => sum + p.currentValue * 100, 0))}
              </span>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-text-tertiary">
                Your hedges will pay out if the specified events occur, helping to offset potential losses in your token positions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
