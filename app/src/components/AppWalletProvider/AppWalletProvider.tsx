"use client";

import {
  WalletModalProviderWrapper,
  WalletProviderWrapper,
} from "@/chain/client";

export function AppWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviderWrapper>
      <WalletModalProviderWrapper>{children}</WalletModalProviderWrapper>
    </WalletProviderWrapper>
  );
}
