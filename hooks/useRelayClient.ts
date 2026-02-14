"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@/providers/WalletContext";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { RelayClient } from "@polymarket/builder-relayer-client";
import {
  RELAYER_URL,
  POLYGON_CHAIN_ID,
  REMOTE_SIGNING_URL,
} from "@/constants/polymarket";

export default function useRelayClient() {
  const { eoaAddress, ethersSigner } = useWallet();
  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);

  const initializeRelayClient = useCallback(async (): Promise<RelayClient> => {
    if (!eoaAddress || !ethersSigner) {
      throw new Error("Wallet not connected");
    }

    const builderConfig = new BuilderConfig({
      remoteBuilderConfig: { url: REMOTE_SIGNING_URL() },
    });

    const client = new RelayClient(
      RELAYER_URL,
      POLYGON_CHAIN_ID,
      ethersSigner as any,
      builderConfig
    );

    setRelayClient(client);
    return client;
  }, [eoaAddress, ethersSigner]);

  const clearRelayClient = useCallback(() => {
    setRelayClient(null);
  }, []);

  return { relayClient, initializeRelayClient, clearRelayClient };
}
