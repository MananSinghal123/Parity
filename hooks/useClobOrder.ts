"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Side, OrderType } from "@polymarket/clob-client";
import type { ClobClient } from "@polymarket/clob-client";

export type OrderParams = {
  tokenId: string;
  size: number;
  price?: number;
  side: "BUY" | "SELL";
  negRisk?: boolean;
  isMarketOrder?: boolean;
};

export default function useClobOrder(
  clobClient: ClobClient | null,
  walletAddress: string | undefined
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const submitOrder = useCallback(
    async (params: OrderParams) => {
      if (!walletAddress) throw new Error("Wallet not connected");
      if (!clobClient) throw new Error("CLOB client not initialized");

      setIsSubmitting(true);
      setError(null);
      setOrderId(null);

      try {
        const side = params.side === "BUY" ? Side.BUY : Side.SELL;

        if (params.isMarketOrder) {
          let aggressivePrice: number;
          try {
            const priceFromOrderbook = await clobClient.getPrice(
              params.tokenId,
              side
            );
            const marketPrice = parseFloat((priceFromOrderbook as any).price);
            if (isNaN(marketPrice) || marketPrice <= 0 || marketPrice >= 1) {
              throw new Error("Invalid price from orderbook");
            }
            aggressivePrice =
              params.side === "BUY"
                ? Math.min(0.99, marketPrice * 1.05)
                : Math.max(0.01, marketPrice * 0.95);
          } catch {
            aggressivePrice = params.side === "BUY" ? 0.99 : 0.01;
          }

          const limitOrder = {
            tokenID: params.tokenId,
            price: aggressivePrice,
            size: params.size,
            side,
            feeRateBps: 0,
            expiration: 0,
            taker: "0x0000000000000000000000000000000000000000",
          };
          const response = await clobClient.createAndPostOrder(
            limitOrder as any,
            { negRisk: params.negRisk },
            OrderType.GTC
          );
          if (response.orderID) {
            setOrderId(response.orderID);
            queryClient.invalidateQueries({ queryKey: ["active-orders"] });
            return { success: true, orderId: response.orderID };
          }
        } else {
          if (params.price == null) throw new Error("Price required for limit orders");
          const limitOrder = {
            tokenID: params.tokenId,
            price: params.price,
            size: params.size,
            side,
            feeRateBps: 0,
            expiration: 0,
            taker: "0x0000000000000000000000000000000000000000",
          };
          const response = await clobClient.createAndPostOrder(
            limitOrder as any,
            { negRisk: params.negRisk },
            OrderType.GTC
          );
          if (response.orderID) {
            setOrderId(response.orderID);
            queryClient.invalidateQueries({ queryKey: ["active-orders"] });
            return { success: true, orderId: response.orderID };
          }
        }
        throw new Error("Order submission failed");
      } catch (err: any) {
        const e = err instanceof Error ? err : new Error("Failed to submit order");
        setError(e);
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [clobClient, walletAddress, queryClient]
  );

  const cancelOrder = useCallback(
    async (id: string) => {
      if (!clobClient) throw new Error("CLOB client not initialized");
      setIsSubmitting(true);
      setError(null);
      try {
        await clobClient.cancelOrder({ orderID: id });
        queryClient.invalidateQueries({ queryKey: ["active-orders"] });
        return { success: true };
      } catch (err: any) {
        const e = err instanceof Error ? err : new Error("Failed to cancel order");
        setError(e);
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [clobClient, queryClient]
  );

  return { submitOrder, cancelOrder, isSubmitting, error, orderId };
}
