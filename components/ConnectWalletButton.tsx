"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  return (
    <ConnectButton
      accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
      chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
      showBalance={{ smallScreen: false, largeScreen: true }}
      label="Connect Wallet"
    />
  );
}

