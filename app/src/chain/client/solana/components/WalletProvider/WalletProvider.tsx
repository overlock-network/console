"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { Coin } from "@/lib/types";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNetwork } from "../NetworkProvider";

interface WalletContextType {
  disconnect: () => Promise<void>;
  connected: boolean;
  address: string | null;
  balance: Coin | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

const WalletProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { connected, disconnect, publicKey } = useSolanaWallet();
  const { connection } = useNetwork();
  const [balance, setBalance] = useState<Coin | null>(null);

  useEffect(() => {}, [publicKey]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !connection || !publicKey) return;

      const lamports = await connection.getBalance(publicKey);
      setBalance({
        denom: "SOL",
        amount: (lamports / LAMPORTS_PER_SOL).toString(),
      });
    };

    fetchBalance();
  }, [connected, connection, publicKey]);

  const contextValue = useMemo(
    (): WalletContextType => ({
      disconnect,
      connected,
      address: publicKey?.toBase58() ?? null,
      balance,
    }),
    [connected, disconnect, publicKey, balance],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export { WalletProvider, useWallet };
