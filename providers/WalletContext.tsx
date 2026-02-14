"use client";

import { createContext, useContext } from "react";
import type { PublicClient, WalletClient } from "viem";
import type { Signer } from "ethers";

export interface WalletContextType {
  eoaAddress: `0x${string}` | undefined;
  walletClient: WalletClient | null;
  ethersSigner: Signer | null;
  publicClient: PublicClient;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
}

export const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
