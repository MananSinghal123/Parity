"use client";

import { useMemo } from "react";
import { ClobClient } from "@polymarket/clob-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { useWallet } from "@/providers/WalletContext";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import {
  CLOB_API_URL,
  POLYGON_CHAIN_ID,
  REMOTE_SIGNING_URL,
} from "@/constants/polymarket";
import type { TradingSession } from "@/utils/session";

export default function useClobClient(
  tradingSession: TradingSession | null,
  isTradingSessionComplete: boolean | undefined
) {
  const { eoaAddress, ethersSigner } = useWallet();
  const { derivedSafeAddressFromEoa } = useSafeDeployment();

  const clobClient = useMemo(() => {
    if (
      !ethersSigner ||
      !eoaAddress ||
      !derivedSafeAddressFromEoa ||
      !isTradingSessionComplete ||
      !tradingSession?.apiCredentials
    ) {
      return null;
    }

    const builderConfig = new BuilderConfig({
      remoteBuilderConfig: { url: REMOTE_SIGNING_URL() },
    });

    return new ClobClient(
      CLOB_API_URL,
      POLYGON_CHAIN_ID,
      ethersSigner as any,
      tradingSession.apiCredentials as any,
      2, // signatureType = 2 for Safe funder
      derivedSafeAddressFromEoa,
      undefined,
      false,
      builderConfig
    );
  }, [
    eoaAddress,
    ethersSigner,
    derivedSafeAddressFromEoa,
    isTradingSessionComplete,
    tradingSession?.apiCredentials,
  ]);

  return { clobClient };
}
