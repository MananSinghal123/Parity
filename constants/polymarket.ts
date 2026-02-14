// Polymarket API URLs and constants
// @see https://github.com/Polymarket/wagmi-safe-builder-example
// @see https://docs.polymarket.com/developers/gamma-markets-api

export const RELAYER_URL = "https://relayer-v2.polymarket.com/";
export const CLOB_API_URL = "https://clob.polymarket.com";
export const GAMMA_API_URL = "https://gamma-api.polymarket.com";

export const POLYGON_RPC_URL =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com";

export const REMOTE_SIGNING_URL = () =>
  typeof window !== "undefined"
    ? `${window.location.origin}/api/polymarket/sign`
    : "/api/polymarket/sign";

export const POLYGON_CHAIN_ID = 137;
