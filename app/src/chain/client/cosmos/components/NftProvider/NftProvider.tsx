"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CosmWasmClient, JsonObject } from "@cosmjs/cosmwasm-stargate";
import { useToast } from "@/hooks/use-toast";
import { Nft } from "@/lib/types";
import {
  NftContextType,
  NftProviderProps,
  useNetwork,
} from "@/chain/client/cosmos";

const NftContext = createContext<NftContextType | undefined>(undefined);

const normalizeUri = (uri: string): string => {
  if (!uri) return "";
  return uri.startsWith("ipfs://")
    ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    : uri;
};

export function NftProvider<T>({
  queryClientClass,
  fetchNft,
  fetchInfo,
  children,
}: NftProviderProps<T>) {
  const [client, setClient] = useState<CosmWasmClient | null>(null);
  const { toast } = useToast();
  const { networkMeta } = useNetwork();

  useEffect(() => {
    const rpcEndpoint = networkMeta.apis.rpc[0].address;

    CosmWasmClient.connect(rpcEndpoint)
      .then(setClient)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to connect to RPC",
          variant: "destructive",
        });
      });
  }, [toast, networkMeta]);

  const getCollectionNft = useCallback(
    async (
      address: string,
      startAfter?: string,
      limit: number = 20,
    ): Promise<{ nft: Nft[]; nextStartAfter?: string }> => {
      if (!client) return { nft: [] };

      try {
        const queryClient = new queryClientClass(client, address);
        const { tokens = [] } = await fetchNft(queryClient, limit, startAfter);

        const nextStartAfter =
          tokens.length === limit ? tokens[tokens.length - 1] : undefined;

        const nft = await Promise.all(
          tokens.map(async (tokenId) => {
            const nftInfo = await fetchInfo(queryClient, tokenId);
            const tokenUri = nftInfo.token_uri || "";

            let metadata: JsonObject = {};
            if (tokenUri) {
              const res = await fetch(normalizeUri(tokenUri));
              if (res.ok) metadata = await res.json();
            }

            return {
              tokenId,
              tokenUri,
              name: metadata.name,
              image: normalizeUri(metadata.image),
              description: metadata.description,
            };
          }),
        );

        return { nft, nextStartAfter };
      } catch {
        toast({
          title: "Error",
          description: "Failed to load NFT from collection",
          variant: "destructive",
        });
        return { nft: [] };
      }
    },
    [client, toast],
  );

  return (
    <NftContext.Provider value={{ getCollectionNft }}>
      {children}
    </NftContext.Provider>
  );
}

export const useNft = () => {
  const context = useContext(NftContext);
  if (!context) throw new Error("useNft must be used within a NftProvider");
  return context;
};
