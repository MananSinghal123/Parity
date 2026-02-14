// Polymarket trading session persistence (localStorage)
// Per-address session with granular readiness flags

export interface UserApiCredentials {
  key: string;
  secret: string;
  passphrase: string;
}

export interface TradingSession {
  eoaAddress: string;
  safeAddress: string;
  isSafeDeployed: boolean;
  hasApiCredentials: boolean;
  hasApprovals: boolean;
  apiCredentials?: UserApiCredentials;
  lastChecked: number;
}

export type SessionStep =
  | "idle"
  | "checking"
  | "deploying"
  | "credentials"
  | "approvals"
  | "complete";

export function loadSession(address: string): TradingSession | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(
    `polymarket_trading_session_${address.toLowerCase()}`
  );
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as TradingSession;

    if (session.eoaAddress?.toLowerCase() !== address?.toLowerCase()) {
      clearSession(address);
      return null;
    }

    return session;
  } catch (e) {
    console.error("Failed to parse session:", e);
    return null;
  }
}

export function saveSession(address: string, session: TradingSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `polymarket_trading_session_${address.toLowerCase()}`,
      JSON.stringify(session)
    );
  } catch {
    // ignore
  }
}

export function clearSession(address: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(
      `polymarket_trading_session_${address.toLowerCase()}`
    );
  } catch {
    // ignore
  }
}
