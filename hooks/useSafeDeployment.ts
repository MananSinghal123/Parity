"use client";

import { useCallback, useMemo } from "react";
import { useWallet } from "@/providers/WalletContext";
import type { RelayClient } from "@polymarket/builder-relayer-client";
import { deriveSafe } from "@polymarket/builder-relayer-client/dist/builder/derive";
import { getContractConfig } from "@polymarket/builder-relayer-client/dist/config";
import { POLYGON_CHAIN_ID } from "@/constants/polymarket";

export default function useSafeDeployment() {
  const { eoaAddress, isConnected, publicClient } = useWallet();

  const derivedSafeAddressFromEoa = useMemo(() => {
    if (!eoaAddress || !isConnected) return null;
    try {
      const config = getContractConfig(POLYGON_CHAIN_ID);
      return deriveSafe(eoaAddress, config.SafeContracts.SafeFactory);
    } catch (error) {
      console.error("Error deriving Safe address:", error);
      return null;
    }
  }, [eoaAddress, isConnected]);

  const isSafeDeployed = useCallback(
    async (relayClient: RelayClient, safeAddr: string): Promise<boolean> => {
      try {
        const deployed = await (relayClient as any).getDeployed(safeAddr);
        return !!deployed;
      } catch {
        if (publicClient) {
          const code = await publicClient.getBytecode({
            address: safeAddr as `0x${string}`,
          });
          return code !== undefined && code !== "0x" && (code?.length ?? 0) > 2;
        }
        return false;
      }
    },
    [publicClient]
  );

  const deploySafe = useCallback(async (relayClient: RelayClient) => {
    const response = await relayClient.deploy();
    const result = await response.wait();
    if (!result) throw new Error("Safe deployment failed");
    return result.proxyAddress;
  }, []);

  return {
    derivedSafeAddressFromEoa,
    isSafeDeployed,
    deploySafe,
  };
}
