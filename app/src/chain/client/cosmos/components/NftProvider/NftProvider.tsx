import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useToast } from "@/hooks/use-toast";
import { Nft } from "@/lib/types";
import {
  NftContextType,
  NftProviderProps,
  useNetwork,
  useWallet,
} from "@/chain/client/cosmos";
import { useChain } from "@cosmos-kit/react";
import { GasPrice } from "@cosmjs/stargate";

const NftContext = createContext<NftContextType<unknown> | undefined>(
  undefined,
);

export function NftProvider<T>({
  queryClientClass,
  fetchNft,
  fetchInfo,
  children,
}: NftProviderProps<T>) {
  const [client, setClient] = useState<CosmWasmClient | null>(null);
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  const { toast } = useToast();
  const { networkMeta } = useNetwork();
  const { getOfflineSigner, address, isWalletConnected } = useChain(
    networkMeta.chain_name,
  );
  const { balance } = useWallet();
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

  useEffect(() => {
    if (isWalletConnected) {
      const gasPrice = GasPrice.fromString("0ovk");

      SigningCosmWasmClient.connectWithSigner(rpcEndpoint, getOfflineSigner(), {
        gasPrice,
      }).then(setSigningClient);
    }
  }, [isWalletConnected]);

  const getCollectionNft = useCallback(
    async (
      address: string,
      startAfter?: string,
      limit: number = 20,
    ): Promise<{ nft: Nft<T>[]; nextStartAfter?: string }> => {
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

            let metadata = {} as T;
            if (tokenUri) {
              const res = await fetch(tokenUri);
              if (res.ok) {
                metadata = (await res.json()) as T;
              }
            }

            return {
              tokenId,
              metadata,
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
    [client],
  );

  const mintNft = useCallback(
    async ({
      contractAddress,
      tokenId,
      tokenUri = "",
    }: {
      contractAddress: string;
      tokenId: string;
      tokenUri?: string;
    }) => {
      if (!signingClient || !address) {
        toast({
          title: "Error",
          description: "Failed to mint NFT",
          variant: "destructive",
        });
        return;
      }

      if (balance && Number(balance.amount) > 0) {
        try {
          const msg = {
            mint: {
              token_id: tokenId,
              owner: address,
              token_uri: tokenUri,
            },
          };
          await signingClient.execute(address, contractAddress, msg, "auto");
          toast({
            title: "Success",
            description: `NFT minted successfully!`,
          });
        } catch {
          toast({
            title: "Error",
            description: "Failed to mint NFT",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "You don't have enough tokens",
          variant: "destructive",
        });
      }
    },
    [signingClient, address, balance],
  );

  return (
    <NftContext.Provider value={{ getCollectionNft, mintNft }}>
      {children}
    </NftContext.Provider>
  );
}

export function useNft<T>() {
  const context = useContext(
    NftContext as React.Context<NftContextType<T> | undefined>,
  );
  if (!context) throw new Error("useNft must be used within a NftProvider");
  return context;
}
