"use client";

import { useCallback } from "react";
import type { RelayClient } from "@polymarket/builder-relayer-client";
import { checkAllApprovals, createAllApprovalTxs } from "@/utils/approvals";

export default function useTokenApprovals() {
  const checkAllTokenApprovals = useCallback(async (safeAddress: string) => {
    return checkAllApprovals(safeAddress);
  }, []);

  const setAllTokenApprovals = useCallback(
    async (relayClient: RelayClient): Promise<boolean> => {
      try {
        const approvalTxs = createAllApprovalTxs();
        const response = await relayClient.execute(
          approvalTxs,
          "Set all token approvals for trading"
        );
        await response.wait();
        return true;
      } catch (err) {
        console.error("Failed to set token approvals:", err);
        return false;
      }
    },
    []
  );

  return { checkAllTokenApprovals, setAllTokenApprovals };
}
