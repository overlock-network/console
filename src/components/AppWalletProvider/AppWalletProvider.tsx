"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useSolanaNetwork } from "../SolanaNetworkProvider";

export function AppWalletProvider({ children }: { children: React.ReactNode }) {
  const { endpoint } = useSolanaNetwork();

  if (endpoint) {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }
}
