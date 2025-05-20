"use client";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { useSolanaNetwork } from "../SolanaNetworkProvider";

export function AppConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { endpoint } = useSolanaNetwork();
  return (
    <ConnectionProvider endpoint={endpoint}>{children}</ConnectionProvider>
  );
}
