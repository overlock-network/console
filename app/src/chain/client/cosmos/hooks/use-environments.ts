"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNetwork } from "@/chain/client/cosmos";
import { useChain } from "@cosmos-kit/react";
import { EnvironmentSDKType } from "@overlocknetwork/api/dist/overlock/crossplane/v1beta1/environment";
import { Environment } from "@/lib/types";

export function useEnvironments(envId?: string) {
  const { LCDClient, networkMeta } = useNetwork();
  const { address } = useChain(networkMeta.chain_name);
  const { toast } = useToast();

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [environment, setEnvironment] = useState<Environment | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const transform = (env: EnvironmentSDKType): Environment => ({
    id: env.id.toString(),
    name: env.metadata?.name ?? "",
    ownerId: env.creator,
    providerId: env.provider?.toString?.() ?? "",
  });

  const fetchEnvironments = useCallback(async () => {
    if (!LCDClient || !address) return;

    setIsLoading(true);
    try {
      if (envId) {
        const response =
          await LCDClient.overlock.crossplane.v1beta1.showEnvironment({
            id: BigInt(envId),
          });

        if (response.environment) {
          const environment = transform(response.environment);
          setEnvironment(environment);
          setEnvironments([environment]);
        } else {
          setEnvironment(undefined);
          setEnvironments([]);
        }
      } else {
        const response =
          await LCDClient.overlock.crossplane.v1beta1.listEnvironment({
            creator: address,
          });

        const environments = response.environments.map(transform);
        setEnvironments(environments);
        setEnvironment(undefined);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch environments.",
        variant: "destructive",
      });
      setEnvironments([]);
      setEnvironment(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [LCDClient, envId, address, toast]);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  return {
    environments,
    environment,
    isLoading,
  };
}
