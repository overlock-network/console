"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useToast } from "@/hooks/use-toast";
import { Contract } from "@/lib/types";
import { ContractsContextType, ContractsProviderProps } from "@/chain/client";

const ContractsContext = createContext<ContractsContextType | undefined>(
  undefined,
);

export function ContractsProvider<T>({
  children,
  queryClientClass,
  fetchInfo,
  contractCodeId,
}: ContractsProviderProps<T>) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<CosmWasmClient | null>(null);
  const { toast } = useToast();
  const endpoint = process.env.NEXT_PUBLIC_NFT_RPC_ENDPOINT;

  useEffect(() => {
    if (!endpoint) {
      toast({
        title: "Error",
        description: "Missing RPC endpoint in environment",
        variant: "destructive",
      });
      return;
    }
    CosmWasmClient.connect(endpoint)
      .then(setClient)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to connect to RPC",
          variant: "destructive",
        });
      });
  }, [toast, endpoint]);

  useEffect(() => {
    if (!client) return;

    const fetchContracts = async () => {
      setLoading(true);
      try {
        const addresses = await client.getContracts(parseInt(contractCodeId));
        const results = await Promise.all(
          addresses.map(async (address) => {
            const instance = new queryClientClass(client, address);
            return await fetchInfo(instance);
          }),
        );
        setContracts(results);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load collections",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [client, toast, queryClientClass, fetchInfo]);

  return (
    <ContractsContext.Provider value={{ contracts, loading }}>
      {children}
    </ContractsContext.Provider>
  );
}

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context)
    throw new Error("useContracts must be used within a ContractsProvider");
  return context;
};
