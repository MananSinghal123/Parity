"use client";

import { useState } from "react";
import { Token } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { MOCK_ORDER_BOOK } from "@/lib/mock-data";
import { PriceChart } from "@/components/PriceChart";

interface TradingPanelProps {
  token: Token;
}

export function TradingPanel({ token }: TradingPanelProps) {
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(token.price.toString());

  const estimatedCost = parseFloat(amount || "0") * parseFloat(price || "0");

  const handleTrade = () => {
    alert(
      `Order placed: ${orderSide.toUpperCase()} ${amount} ${token.symbol} @ $${price}`,
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Real-time Price Chart */}
      <div className="bg-surface border-b border-border p-4">
        <PriceChart symbol={token.symbol} />
      </div>

      <div className="flex flex-1 min-h-[600px]">
        {/* Order Book */}
        <div className="w-1/2 border-r border-border">
          <div className="bg-surface-light px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">
              Order Book
            </h3>
          </div>
          <div className="overflow-auto scrollbar-thin">
            {/* Asks */}
            <div className="px-4 py-2">
              <div className="grid grid-cols-3 text-xs text-text-tertiary mb-2">
                <span>Price (USD)</span>
                <span className="text-right">Amount ({token.symbol})</span>
                <span className="text-right">Total</span>
              </div>
              <div className="space-y-1">
                {MOCK_ORDER_BOOK.asks.reverse().map((order, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-xs hover:bg-surface-light cursor-pointer"
                  >
                    <span className="text-danger">
                      ${formatPrice(order.price)}
                    </span>
                    <span className="text-right text-text-secondary">
                      {order.amount}
                    </span>
                    <span className="text-right text-text-tertiary">
                      ${formatPrice(order.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Price */}
            <div className="px-4 py-3 bg-surface-light border-y border-border">
              <div className="flex items-center justify-between">
                <span
                  className="text-lg font-bold text-success"
                  suppressHydrationWarning
                >
                  ${formatPrice(token.price)}
                </span>
                <span className="text-xs text-text-tertiary">
                  Current Price
                </span>
              </div>
            </div>

            {/* Bids */}
            <div className="px-4 py-2">
              <div className="space-y-1">
                {MOCK_ORDER_BOOK.bids.map((order, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-xs hover:bg-surface-light cursor-pointer"
                  >
                    <span className="text-success">
                      ${formatPrice(order.price)}
                    </span>
                    <span className="text-right text-text-secondary">
                      {order.amount}
                    </span>
                    <span className="text-right text-text-tertiary">
                      ${formatPrice(order.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Form */}
        <div className="w-1/2">
          <div className="bg-surface-light px-4 py-3 border-b border-border">
            <div className="flex gap-2">
              <button
                onClick={() => setOrderSide("buy")}
                className={cn(
                  "flex-1 py-2 rounded text-sm font-medium transition-colors",
                  orderSide === "buy"
                    ? "bg-success text-white"
                    : "bg-surface text-text-secondary hover:text-text-primary",
                )}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderSide("sell")}
                className={cn(
                  "flex-1 py-2 rounded text-sm font-medium transition-colors",
                  orderSide === "sell"
                    ? "bg-danger text-white"
                    : "bg-surface text-text-secondary hover:text-text-primary",
                )}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Order Type */}
            <div>
              <label className="text-xs text-text-tertiary mb-2 block">
                Order Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType("limit")}
                  className={cn(
                    "flex-1 py-2 rounded text-sm font-medium transition-colors",
                    orderType === "limit"
                      ? "bg-primary text-background"
                      : "bg-surface text-text-secondary hover:text-text-primary",
                  )}
                >
                  Limit
                </button>
                <button
                  onClick={() => setOrderType("market")}
                  className={cn(
                    "flex-1 py-2 rounded text-sm font-medium transition-colors",
                    orderType === "market"
                      ? "bg-primary text-background"
                      : "bg-surface text-text-secondary hover:text-text-primary",
                  )}
                >
                  Market
                </button>
              </div>
            </div>

            {/* Price */}
            {orderType === "limit" && (
              <div>
                <label className="text-xs text-text-tertiary mb-2 block">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="text-xs text-text-tertiary mb-2 block">
                Amount ({token.symbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                placeholder="0.00"
              />
              <div className="flex gap-2 mt-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      setAmount(
                        (
                          (1000 / parseFloat(price || "1")) *
                          (percent / 100)
                        ).toFixed(2),
                      )
                    }
                    className="flex-1 py-1 text-xs bg-surface hover:bg-surface-light rounded text-text-secondary"
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="bg-surface-light rounded p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-tertiary">Estimated Cost</span>
                <span className="text-text-primary font-medium">
                  ${formatPrice(estimatedCost)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-tertiary">Fee (0.1%)</span>
                <span className="text-text-secondary">
                  ${formatPrice(estimatedCost * 0.001)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTrade}
              disabled={!amount || (orderType === "limit" && !price)}
              className={cn(
                "w-full py-3 rounded font-medium transition-colors",
                orderSide === "buy"
                  ? "bg-success hover:bg-success/90 text-white"
                  : "bg-danger hover:bg-danger/90 text-white",
                (!amount || (orderType === "limit" && !price)) &&
                  "opacity-50 cursor-not-allowed",
              )}
            >
              {orderSide === "buy" ? "Buy" : "Sell"} {token.symbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
