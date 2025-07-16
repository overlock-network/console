"use client";

import { useCallback, useEffect, useState } from "react";
import { useNetwork } from "@/chain/client/solana";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { ChainEnvironment } from "@/chain/client/solana";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import environmentIdl from "@anchor/target/idl/environment.json";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";
import { Environment } from "@/lib/types";

export function useEnvironments(environmentKey?: string) {
  const { connection } = useNetwork();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [environment, setEnvironment] = useState<Environment | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!connection) return;
    setIsLoading(true);

    try {
      const program = new Program<EnvironmentProgram>(environmentIdl, {
        connection,
      });

      if (environmentKey) {
        const publicKey = new PublicKey(environmentKey);
        const account = await program.account.environment.fetch(publicKey);
        const environment = {
          id: environmentKey,
          ownerId: account.owner.toBase58(),
          providerId: account.provider.toBase58(),
          ...account,
        };
        setEnvironment(environment);
        setEnvironments([environment]);
      } else {
        const result =
          (await program.account.environment.all()) as ProgramAccount<ChainEnvironment>[];
        setEnvironments(
          result.map((e) => {
            return {
              id: e.publicKey.toBase58(),
              ownerId: e.account.owner.toBase58(),
              providerId: e.account.provider.toBase58(),
              ...e.account,
            };
          }),
        );
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
  }, [connection, environmentKey, toast]);

  useEffect(() => {
    load();
  }, [load]);

  return { environments, environment, isLoading };
}
