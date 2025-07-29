"use client";

import { createContext, useContext, useCallback } from "react";
import { Nft } from "@/lib/types";
import { NftContextType, NftProviderProps } from "@/chain/client/cosmos";

const NftContext = createContext<NftContextType<unknown> | undefined>(
  undefined,
);

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

export function useNft<T>() {
  const context = useContext(
    NftContext as React.Context<NftContextType<T> | undefined>,
  );
  if (!context) throw new Error("useNft must be used within a NftProvider");
  return context;
}
