"use client";

import { useChain } from "@cosmos-kit/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useNetwork } from "../NetworkProvider";
import { Coin } from "@/lib/types";

interface WalletContextType {
  disconnect: () => Promise<void>;
  connected: boolean;
  address: string | null;
  balance: Coin | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { networkMeta } = useNetwork();
  const { disconnect, isWalletConnected, address, getSigningStargateClient } =
    useChain(networkMeta.chain_name);

  const [balance, setBalance] = useState<Coin | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isWalletConnected || !address) {
        setBalance(null);
        return;
      }
      if (!getSigningStargateClient) {
        setBalance(null);
        return;
      }

      try {
        const client = await getSigningStargateClient();
        if (!client) {
          setBalance(null);
          return;
        }
        const result = await client.getBalance(
          address,
          networkMeta.fees.fee_tokens[0].denom,
        );
        setBalance(result);
      } catch {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [address, isWalletConnected, getSigningStargateClient, networkMeta]);

  const contextValue: WalletContextType = useMemo(
    () => ({
      disconnect,
      connected: isWalletConnected,
      address: address ?? null,
      balance,
    }),
    [disconnect, isWalletConnected, address, balance],
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
