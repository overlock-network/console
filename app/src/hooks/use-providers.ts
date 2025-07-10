import { useCallback, useEffect, useState } from "react";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Provider } from "@/lib/types";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import providerIdl from "@anchor/target/idl/provider.json";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";

export function useProviders(providerKey?: PublicKey) {
  const { connection } = useSolanaNetwork();
  const [providers, setProviders] = useState<ProgramAccount<Provider>[]>([]);
  const [provider, setProvider] = useState<
    ProgramAccount<Provider> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!connection) return;
    setIsLoading(true);

    try {
      const program = new Program<ProviderProgram>(providerIdl, { connection });

      if (providerKey) {
        const account = await program.account.provider.fetch(providerKey);
        const singleProvider = { publicKey: providerKey, account };
        setProvider(singleProvider);
        setProviders([singleProvider]);
      } else {
        const result = await program.account.provider.all();
        setProviders(result);
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
