"use client";

import { LCDClient, Network, NetworkMeta } from "@/chain/client/cosmos";
import { overlock } from "@overlocknetwork/api";
import { Cog, TestTubeDiagonal } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

interface NetworkContextType {
  networks: Network[];
  currentNetwork: Network;
  setCurrentNetwork: React.Dispatch<React.SetStateAction<Network>>;
  networkMeta: NetworkMeta;
  LCDClient: LCDClient;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

const networks: Network[] = [
  { name: "Local", icon: TestTubeDiagonal },
  { name: "Devnet", icon: Cog },
];

const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);
  const [networkMeta, setNetworkMeta] = useState<NetworkMeta | null>(null);
  const [lcdClient, setLcdClient] = useState<LCDClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNetworkData = async () => {
      setLoading(true);

      const metaKey = `${currentNetwork.name}_meta`;
      let meta: NetworkMeta;
      const storageMeta = localStorage.getItem(metaKey);

      if (storageMeta) {
        meta = JSON.parse(storageMeta);
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NETWORK_URL}/${currentNetwork.name.toLowerCase()}/meta.json`,
        );
        meta = await res.json();
        localStorage.setItem(metaKey, JSON.stringify(meta));
      }
      setNetworkMeta(meta);

      const client = await overlock.ClientFactory.createLCDClient({
        restEndpoint: meta.apis.rest[0].address || "",
      });
      setLcdClient(client);

      if (currentNetwork.name === "Local") {
        const faucetKey = `${currentNetwork.name}_faucet_url`;
        if (!localStorage.getItem(faucetKey)) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NETWORK_URL}/${currentNetwork.name.toLowerCase()}/faucet-url.txt`,
          );
          const faucetUrl = await res.text();
          localStorage.setItem(faucetKey, faucetUrl);
        }
      }

      setLoading(false);
    };

    loadNetworkData();
  }, [currentNetwork]);

  if (loading || !networkMeta || !lcdClient) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const contextValue: NetworkContextType = {
    networks,
    currentNetwork,
    setCurrentNetwork,
    networkMeta,
    LCDClient: lcdClient,
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
