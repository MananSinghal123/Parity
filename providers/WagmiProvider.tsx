"use client";

import { type ReactNode } from "react";
import { WagmiProvider as Wagmi, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon } from "wagmi/chains";
import { POLYGON_RPC_URL } from "@/constants/polymarket";

const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(POLYGON_RPC_URL),
  },
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
});

export default function WagmiProvider({ children }: { children: ReactNode }) {
  return <Wagmi config={config}>{children}</Wagmi>;
}
