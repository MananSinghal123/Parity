"use client";

import { useWallet } from "@/providers/WalletContext";

export function ConnectWalletButton() {
  const { eoaAddress, isConnected, connect, disconnect } = useWallet();

  if (isConnected && eoaAddress) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary font-mono">
          {`${eoaAddress.slice(0, 6)}...${eoaAddress.slice(-4)}`}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-lg bg-surface-light hover:bg-border text-text-primary text-sm font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect()}
      className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
