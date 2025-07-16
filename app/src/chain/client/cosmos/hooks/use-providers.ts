"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNetwork } from "@/chain/client/cosmos";
import { useChain } from "@cosmos-kit/react";
import { ProviderSDKType as ChainProvider } from "@overlocknetwork/api/dist/overlock/crossplane/v1beta1/provider";
import { Provider } from "@/lib/types";

export function useProviders(providerId?: string) {
  const { LCDClient, networkMeta } = useNetwork();
  const { address } = useChain(networkMeta.chain_name);
  const { toast } = useToast();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const transform = (chainProvider: ChainProvider): Provider => ({
    id: chainProvider.id.toString(),
    name: chainProvider.metadata?.name ?? "",
    ip: chainProvider.ip,
    port: chainProvider.port,
    country: chainProvider.country_code,
    environmentType: chainProvider.environment_type,
    availability:
      chainProvider.availability === "true" ||
      chainProvider.availability === "1",
  });

  const fetchProviders = useCallback(async () => {
    if (!LCDClient || !address) return;

    setIsLoading(true);
    try {
      if (providerId) {
        const response =
          await LCDClient.overlock.crossplane.v1beta1.showProvider({
            id: BigInt(providerId),
          });

        if (response.Provider) {
          const transformed = transform(response.Provider);
          setProvider(transformed);
          setProviders([transformed]);
        } else {
          setProvider(undefined);
          setProviders([]);
        }
      } else {
        const response =
          await LCDClient.overlock.crossplane.v1beta1.listProvider({
            creator: { value: address },
          });

        const transformed = response.Providers.map(transform);
        setProviders(transformed);
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
  }, [LCDClient, providerId, address, toast]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    provider,
    isLoading,
  };
}
