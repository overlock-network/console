"use client";

import { useEffect, useState, useCallback } from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Environment } from "@/lib/types";
import environmentIdl from "@anchor/target/idl/environment.json";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";

export function useEnvironments(envKey?: PublicKey) {
  const { connection } = useSolanaNetwork();
  const { toast } = useToast();

  const [environments, setEnvironments] = useState<
    ProgramAccount<Environment>[]
  >([]);
  const [environment, setEnvironment] = useState<
    ProgramAccount<Environment> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEnvironments = useCallback(async () => {
    if (!connection) return;

    setIsLoading(true);
    try {
      const program = new Program<EnvironmentProgram>(environmentIdl, {
        connection,
      });

      if (envKey) {
        const account = await program.account.environment.fetch(envKey);
        const singleEnv = { publicKey: envKey, account };
        setEnvironment(singleEnv);
        setEnvironments([singleEnv]);
      } else {
        const result = await program.account.environment.all();
        setEnvironments(result);
        setEnvironment(undefined);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch environment(s).",
        variant: "destructive",
      });
      setEnvironments([]);
      setEnvironment(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [connection, envKey, toast]);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  return {
    environments,
    environment,
    isLoading,
  };
}
