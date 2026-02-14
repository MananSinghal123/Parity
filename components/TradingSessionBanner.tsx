"use client";

import { useTrading } from "@/providers/TradingProvider";
import { Loader2 } from "lucide-react";

export function TradingSessionBanner() {
  const {
    eoaAddress,
    isTradingSessionComplete,
    currentStep,
    sessionError,
    initializeTradingSession,
  } = useTrading();

  if (!eoaAddress) return null;
  if (isTradingSessionComplete) return null;

  const isInitializing =
    currentStep !== "idle" && currentStep !== "complete";

  const stepLabels: Record<string, string> = {
    checking: "Checking session...",
    deploying: "Deploying Safe wallet...",
    credentials: "Getting API credentials...",
    approvals: "Setting token approvals...",
  };

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
      <p className="text-sm text-text-primary mb-2">
        {isInitializing
          ? stepLabels[currentStep] ?? "Setting up trading..."
          : "Initialize Polymarket trading for gasless bets with builder attribution."}
      </p>
      {sessionError && (
        <p className="text-xs text-danger mb-2">{sessionError.message}</p>
      )}
      <button
        type="button"
        onClick={() => initializeTradingSession()}
        disabled={isInitializing}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {isInitializing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {stepLabels[currentStep] ?? "Initializing..."}
          </>
        ) : (
          "Initialize Trading"
        )}
      </button>
    </div>
  );
}
