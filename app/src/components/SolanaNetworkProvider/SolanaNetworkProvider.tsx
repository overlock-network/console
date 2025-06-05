"use client";

import { SolanaNetwork } from "@/lib/types";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Box, Cog, MapPin, TestTubeDiagonal } from "lucide-react";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Spinner } from "../Spinner";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

interface SolanaNetworkContextType {
  solanaNetworks: SolanaNetwork[];
  currentSolanaNetwork: SolanaNetwork;
  setCurrentSolanaNetwork: React.Dispatch<
    React.SetStateAction<SolanaNetwork | undefined>
  >;
  endpoint: string;
  connection: Connection;
  metaplexConnection: Metaplex;
  anchorProvider?: AnchorProvider;
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
    {
      name: "localnet",
      icon: MapPin,
    },
  ];

  const [currentSolanaNetwork, setCurrentSolanaNetwork] =
    useState<SolanaNetwork>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNetwork = localStorage.getItem("currentSolanaNetwork");
      setCurrentSolanaNetwork(
        solanaNetworks.find((network) => network.name === storedNetwork) ||
          solanaNetworks[0],
      );
    }
  }, []);

  const endpoint = useMemo(() => {
    if (currentSolanaNetwork) {
      if (currentSolanaNetwork.name === "localnet") {
        return process.env.NEXT_PUBLIC_ANCHOR_PROVIDER_URL;
      } else {
        return clusterApiUrl(currentSolanaNetwork.name);
      }
    }
  }, [currentSolanaNetwork]);

  const connection = useMemo(() => {
    if (endpoint) return new Connection(endpoint, "confirmed");
  }, [endpoint]);

  const metaplexConnection = useMemo(() => {
    if (connection) return Metaplex.make(connection);
  }, [connection]);

  const anchorWallet = useAnchorWallet();

  const anchorProvider = useMemo(() => {
    if (connection && anchorWallet)
      return new AnchorProvider(connection, anchorWallet, {});
  }, [connection, anchorWallet]);

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
    anchorProvider,
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
