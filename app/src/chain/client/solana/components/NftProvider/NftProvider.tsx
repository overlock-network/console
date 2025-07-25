"use client";

import { createContext, useContext, useCallback } from "react";
import { Nft } from "@/lib/types";
import { NftContextType, NftProviderProps } from "@/chain/client/cosmos";

const NftContext = createContext<NftContextType | undefined>(undefined);

export function NftProvider<T>({ children }: NftProviderProps<T>) {
  const getCollectionNft = useCallback(async (): Promise<{
    nft: Nft[];
    nextStartAfter?: string;
  }> => {
    return { nft: [] };
  }, []);

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
