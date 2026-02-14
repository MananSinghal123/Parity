"use client";

import { useCallback } from "react";
import { useWallet } from "@/providers/WalletContext";
import { ClobClient } from "@polymarket/clob-client";
import { CLOB_API_URL, POLYGON_CHAIN_ID } from "@/constants/polymarket";
import type { UserApiCredentials } from "@/utils/session";

export default function useUserApiCredentials() {
  const { eoaAddress, ethersSigner } = useWallet();

  const createOrDeriveUserApiCredentials = useCallback(async (): Promise<UserApiCredentials> => {
    if (!eoaAddress || !ethersSigner) throw new Error("Wallet not connected");

    const tempClient = new ClobClient(
      CLOB_API_URL,
      POLYGON_CHAIN_ID,
      ethersSigner as any
    );

    const derivedCreds = await tempClient.deriveApiKey().catch(() => null);

    if (
      derivedCreds?.key &&
      derivedCreds?.secret &&
      derivedCreds?.passphrase
    ) {
      return derivedCreds as UserApiCredentials;
    }

    const newCreds = await tempClient.createApiKey();
    return newCreds as UserApiCredentials;
  }, [eoaAddress, ethersSigner]);

  return { createOrDeriveUserApiCredentials };
}
