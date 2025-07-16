import React, { useEffect, useState } from "react";
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletProvider } from "../WalletProvider";

export function WalletProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SolanaWalletProvider wallets={[]} autoConnect>
      <WalletProvider>{children}</WalletProvider>
    </SolanaWalletProvider>
  );
}
