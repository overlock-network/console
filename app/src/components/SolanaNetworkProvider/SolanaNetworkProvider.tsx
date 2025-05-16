"use client";

import { SolanaNetwork } from "@/lib/types";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Box, Cog, TestTubeDiagonal } from "lucide-react";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Spinner } from "../Spinner";

interface SolanaNetworkContextType {
  solanaNetworks: SolanaNetwork[];
  currentSolanaNetwork: SolanaNetwork;
  setCurrentSolanaNetwork: React.Dispatch<
    React.SetStateAction<SolanaNetwork | undefined>
  >;
  endpoint: string;
  connection: Connection;
  metaplexConnection: Metaplex;
}

const SolanaNetworkContext = createContext<SolanaNetworkContextType | null>(
  null,
);

const SolanaNetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const [currentSolanaNetwork, setCurrentSolanaNetwork] = useState<
    SolanaNetwork | undefined
  >();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNetwork = localStorage.getItem("currentSolanaNetwork");
      if (storedNetwork) {
        setCurrentSolanaNetwork(
          solanaNetworks.find((network) => network.name === storedNetwork) ||
            solanaNetworks[0],
        );
      }
    }
  }, []);

  const endpoint = useMemo(() => {
    if (currentSolanaNetwork) return clusterApiUrl(currentSolanaNetwork.name);
  }, [currentSolanaNetwork]);

  const connection = useMemo(() => {
    if (endpoint) return new Connection(endpoint, "confirmed");
  }, [endpoint]);

  const metaplexConnection = useMemo(() => {
    if (connection) return Metaplex.make(connection);
  }, [connection]);

  useEffect(() => {
    if (currentSolanaNetwork && typeof window !== "undefined") {
      localStorage.setItem("currentSolanaNetwork", currentSolanaNetwork.name);
    }
  }, [currentSolanaNetwork]);

  if (
    currentSolanaNetwork === undefined ||
    endpoint === undefined ||
    connection === undefined ||
    metaplexConnection === undefined
  ) {
    return (
      <div className="flex h-[100vh] w-full justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const contextValue: SolanaNetworkContextType = {
    solanaNetworks,
    currentSolanaNetwork,
    setCurrentSolanaNetwork,
    endpoint,
    connection,
    metaplexConnection,
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
