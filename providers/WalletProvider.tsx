"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useWalletClient,
  useConnect,
  useConnectors,
} from "wagmi";
import { BrowserProvider } from "ethers";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { WalletContext } from "./WalletContext";
import { POLYGON_RPC_URL } from "@/constants/polymarket";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http(POLYGON_RPC_URL),
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [ethersSigner, setEthersSigner] = useState<import("ethers").Signer | null>(null);

  const { address: eoaAddress, isConnected: wagmiConnected } = useAccount();
  const { data: wagmiWalletClient } = useWalletClient();
  const { disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();

  useEffect(() => {
    if (wagmiWalletClient) {
      try {
        const provider = new BrowserProvider(wagmiWalletClient as any);
        provider.getSigner().then(setEthersSigner).catch(() => setEthersSigner(null));
      } catch {
        setEthersSigner(null);
      }
    } else {
      setEthersSigner(null);
    }
  }, [wagmiWalletClient]);

  const connect = async () => {
    try {
      const injectedConnector = connectors.find((c) => c.id === "injected");
      if (injectedConnector) {
        await connectAsync({ connector: injectedConnector });
      }
    } catch (error) {
      console.error("Connect error:", error);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
      setEthersSigner(null);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const value = useMemo(
    () => ({
      eoaAddress,
      walletClient: wagmiWalletClient ?? null,
      ethersSigner,
      publicClient,
      connect,
      disconnect,
      isConnected: !!wagmiConnected,
    }),
    [eoaAddress, wagmiWalletClient, ethersSigner, wagmiConnected]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
