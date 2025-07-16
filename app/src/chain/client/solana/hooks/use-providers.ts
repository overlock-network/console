"use client";

import { useCallback, useEffect, useState } from "react";
import { useNetwork } from "@/chain/client/solana";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { ChainProvider } from "@/chain/client/solana";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import providerIdl from "@anchor/target/idl/provider.json";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";
import { Provider } from "@/lib/types";

export function useProviders(providerKey?: string) {
  const { connection } = useNetwork();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!connection) return;
    setIsLoading(true);

    try {
      const program = new Program<ProviderProgram>(providerIdl, { connection });

      if (providerKey) {
        const publicKey = new PublicKey(providerKey);
        const account = await program.account.provider.fetch(publicKey);
        const provider = { id: providerKey, ...account };
        setProvider(provider);
        setProviders([provider]);
      } else {
        const result =
          (await program.account.provider.all()) as ProgramAccount<ChainProvider>[];
        setProviders(
          result.map((p) => {
            return {
              id: p.publicKey.toBase58(),
              ...p.account,
            };
          }),
        );
        setProvider(undefined);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch providers.",
        variant: "destructive",
      });
      setProviders([]);
      setProvider(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [connection, providerKey, toast]);

  useEffect(() => {
    load();
  }, [load]);

  return { providers, provider, isLoading };
}
