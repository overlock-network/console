"use client";

import { SolanaNetwork } from "@/lib/types";
import { clusterApiUrl } from "@solana/web3.js";
import { Box, Cog, TestTubeDiagonal } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SolanaNetworkContextType {
  solanaNetworks: SolanaNetwork[];
  currentSolanaNetwork: SolanaNetwork;
  setCurrentSolanaNetwork: React.Dispatch<React.SetStateAction<SolanaNetwork>>;
  endpoint?: string;
}

const SolanaNetworkContext = createContext<SolanaNetworkContextType | null>(
  null,
);

const SolanaNetworkProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const solanaNetworks: SolanaNetwork[] = [
    {
      name: "devnet",
      icon: Cog,
    },
    {
      name: "testnet",
      icon: TestTubeDiagonal,
    },
    {
      name: "mainnet-beta",
      icon: Box,
    },
  ];

  const [currentSolanaNetwork, setCurrentSolanaNetwork] =
    useState<SolanaNetwork>(solanaNetworks[0]);
  const [endpoint, setEndpoint] = useState<string>();

  useEffect(() => {
    setEndpoint(clusterApiUrl(currentSolanaNetwork.name));
  }, [currentSolanaNetwork]);

  const contextValue: SolanaNetworkContextType = {
    solanaNetworks,
    currentSolanaNetwork,
    setCurrentSolanaNetwork,
    endpoint,
  };

  return (
    <SolanaNetworkContext.Provider value={contextValue}>
      {children}
    </SolanaNetworkContext.Provider>
  );
};

const useSolanaNetwork = () => {
  const context = useContext(SolanaNetworkContext);
  if (!context) {
    throw new Error(
      "useSolanaNetwork must be used within a SolanaNetworkProvider",
    );
  }
  return context;
};

export { SolanaNetworkProvider, useSolanaNetwork };
