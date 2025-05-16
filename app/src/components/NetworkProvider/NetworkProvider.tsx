"use client";

import { LCDClient, Network, NetworkMeta } from "@/lib/types";
import { overlock } from "@overlocknetwork/api";
import { Box, Cog, TestTubeDiagonal } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NetworkContextType {
  networks: Network[];
  currentNetwork: Network;
  setCurrentNetwork: React.Dispatch<React.SetStateAction<Network>>;
  networkMeta?: NetworkMeta;
  LCDClient?: LCDClient;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

const NetworkProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const networks = [
    {
      name: "Develop",
      icon: Cog,
    },
    {
      name: "Testnet",
      icon: TestTubeDiagonal,
    },
    {
      name: "Sandbox",
      icon: Box,
    },
  ];

  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);
  const [networkMeta, setNetworkMeta] = useState<NetworkMeta>();
  const [LCDClient, setLCDClient] = useState<LCDClient>();

  const getNetworkMeta = async () => {
    let meta: NetworkMeta;
    const storageNetworkMeta = localStorage.getItem(
      `${currentNetwork.name}_meta`,
    );

    if (storageNetworkMeta) {
      meta = JSON.parse(storageNetworkMeta);
      setNetworkMeta(meta);
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NETWORK_URL}/${currentNetwork.name.toLowerCase()}/meta.json`,
      );
      meta = await response.json();
      localStorage.setItem(`${currentNetwork.name}_meta`, JSON.stringify(meta));
      setNetworkMeta(meta);
    }

    setLCDClient(
      await overlock.ClientFactory.createLCDClient({
        restEndpoint: meta.apis.rest[0].address || "",
      }),
    );
  };

  const getFaucetEndpoint = async () => {
    const storageFaucetEndpoint = localStorage.getItem(
      `${currentNetwork.name}_faucet_url`,
    );
    let faucetEndpoint: string;

    if (storageFaucetEndpoint) {
      faucetEndpoint = storageFaucetEndpoint;
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NETWORK_URL}/${currentNetwork.name.toLowerCase()}/faucet-url.txt`,
      );
      faucetEndpoint = await response.text();
      localStorage.setItem(`${currentNetwork.name}_faucet_url`, faucetEndpoint);
    }
  };

  useEffect(() => {
    getNetworkMeta();
    if (currentNetwork.name === "develop") {
      getFaucetEndpoint();
    }
  }, [currentNetwork]);

  const contextValue: NetworkContextType = {
    networks,
    currentNetwork,
    setCurrentNetwork,
    networkMeta,
    LCDClient,
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
