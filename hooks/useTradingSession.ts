"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@/providers/WalletContext";
import useRelayClient from "@/hooks/useRelayClient";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import useUserApiCredentials from "@/hooks/useUserApiCredentials";
import useTokenApprovals from "@/hooks/useTokenApprovals";
import {
  loadSession,
  saveSession,
  clearSession,
  type TradingSession,
  type SessionStep,
} from "@/utils/session";

export default function useTradingSession() {
  const { eoaAddress, isConnected } = useWallet();
  const { initializeRelayClient, relayClient, clearRelayClient } = useRelayClient();
  const { derivedSafeAddressFromEoa, isSafeDeployed, deploySafe } = useSafeDeployment();
  const { createOrDeriveUserApiCredentials } = useUserApiCredentials();
  const { checkAllTokenApprovals, setAllTokenApprovals } = useTokenApprovals();

  const [session, setSession] = useState<TradingSession | null>(null);
  const [currentStep, setCurrentStep] = useState<SessionStep>("idle");
  const [sessionError, setSessionError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!eoaAddress || !isConnected) {
      setSession(null);
      setCurrentStep("idle");
      setSessionError(null);
      if (eoaAddress) clearSession(eoaAddress);
      clearRelayClient();
      return;
    }
    const loaded = loadSession(eoaAddress);
    if (loaded?.hasApiCredentials && loaded?.hasApprovals) {
      setSession(loaded);
      setCurrentStep("complete");
    } else {
      setSession(loaded);
      setCurrentStep("idle");
    }
  }, [eoaAddress, isConnected, clearRelayClient]);

  const initializeTradingSession = useCallback(async () => {
    if (!eoaAddress || !isConnected) {
      throw new Error("Wallet not connected");
    }

    setIsInitializing(true);
    setSessionError(null);

    try {
      setCurrentStep("checking");
      const relay = await initializeRelayClient();

      const safeAddr = derivedSafeAddressFromEoa;
      if (!safeAddr) throw new Error("Could not derive Safe address");

      const deployed = await isSafeDeployed(relay, safeAddr);
      if (!deployed) {
        setCurrentStep("deploying");
        await deploySafe(relay);
      }

      let apiCredentials = loadSession(eoaAddress)?.apiCredentials;
      if (!apiCredentials) {
        setCurrentStep("credentials");
        apiCredentials = await createOrDeriveUserApiCredentials();
      }

      const approvalStatus = await checkAllTokenApprovals(safeAddr);
      if (!approvalStatus.allApproved) {
        setCurrentStep("approvals");
        const ok = await setAllTokenApprovals(relay);
        if (!ok) throw new Error("Token approvals failed");
      }

      const newSession: TradingSession = {
        eoaAddress,
        safeAddress: safeAddr,
        isSafeDeployed: true,
        hasApiCredentials: true,
        hasApprovals: true,
        apiCredentials,
        lastChecked: Date.now(),
      };
      saveSession(eoaAddress, newSession);
      setSession(newSession);
      setCurrentStep("complete");
    } catch (err: unknown) {
      setSessionError(
        err instanceof Error ? err : new Error(String((err as { message?: string })?.message ?? "Failed to initialize trading session"))
      );
      setCurrentStep("idle");
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [
    eoaAddress,
    isConnected,
    initializeRelayClient,
    derivedSafeAddressFromEoa,
    isSafeDeployed,
    deploySafe,
    createOrDeriveUserApiCredentials,
    checkAllTokenApprovals,
    setAllTokenApprovals,
  ]);

  const endTradingSession = useCallback(() => {
    if (eoaAddress) clearSession(eoaAddress);
    setSession(null);
    setCurrentStep("idle");
    clearRelayClient();
  }, [eoaAddress, clearRelayClient]);

  const isTradingSessionComplete = currentStep === "complete" && !!session?.hasApiCredentials && !!session?.hasApprovals;

  return {
    tradingSession: session,
    currentStep,
    sessionError,
    isInitializing,
    isTradingSessionComplete,
    initializeTradingSession,
    endTradingSession,
    relayClient,
  };
}
