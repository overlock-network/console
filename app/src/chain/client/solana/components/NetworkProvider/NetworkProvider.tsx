"use client";

import { Network } from "../../lib/types";
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
import { Spinner } from "../../../../../components/Spinner";

interface NetworkContextType {
  networks: Network[];
  currentNetwork: Network;
  setCurrentNetwork: React.Dispatch<React.SetStateAction<Network | undefined>>;
  endpoint: string;
  connection: Connection;
  metaplexConnection: Metaplex;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const networks: Network[] = [
    {
      name: "localnet",
      icon: MapPin,
    },
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

  const [currentNetwork, setCurrentNetwork] = useState<Network>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNetwork = localStorage.getItem("currentNetwork");
      setCurrentNetwork(
        networks.find((network) => network.name === storedNetwork) ||
          networks[0],
      );
    }
  }, []);

  const endpoint = useMemo(() => {
    if (currentNetwork) {
      if (currentNetwork.name === "localnet") {
        return process.env.NEXT_PUBLIC_ANCHOR_PROVIDER_URL;
      } else {
        return clusterApiUrl(currentNetwork.name);
      }
    }
  }, [currentNetwork]);

  const connection = useMemo(() => {
    if (endpoint) return new Connection(endpoint, "confirmed");
  }, [endpoint]);

  const metaplexConnection = useMemo(() => {
    if (connection) return Metaplex.make(connection);
  }, [connection]);

  useEffect(() => {
    if (currentNetwork && typeof window !== "undefined") {
      localStorage.setItem("currentNetwork", currentNetwork.name);
    }
  }, [currentNetwork]);

  if (
    currentNetwork === undefined ||
    endpoint === undefined ||
    connection === undefined ||
    metaplexConnection === undefined
  ) {
    return (
      <div className="w-full flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const contextValue: NetworkContextType = {
    networks,
    currentNetwork,
    setCurrentNetwork,
    endpoint,
    connection,
    metaplexConnection,
  };

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

export { NetworkProvider, useNetwork };
