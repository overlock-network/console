"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import environmentIdl from "@anchor/target/idl/environment.json";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { useToast } from "@/hooks/use-toast";
import { Environment } from "@/lib/types";

type EnvironmentsContextType = {
  environments: ProgramAccount<Environment>[];
  isLoading: boolean;
};

const EnvironmentsContext = createContext<EnvironmentsContextType | undefined>(
  undefined,
);

export function EnvironmentsProvider({ children }: { children: ReactNode }) {
  const { connection } = useSolanaNetwork();
  const [environments, setEnvironments] = useState<
    ProgramAccount<Environment>[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!connection) return;

    const fetchEnvironments = async () => {
      setIsLoading(true);
      try {
        const program = new Program<EnvironmentProgram>(environmentIdl, {
          connection,
        });
        const all = await program.account.environment.all();
        setEnvironments(all);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch environments.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvironments();
  }, [connection]);

  return (
    <EnvironmentsContext.Provider value={{ environments, isLoading }}>
      {children}
    </EnvironmentsContext.Provider>
  );
}

export function useEnvironments() {
  const ctx = useContext(EnvironmentsContext);
  if (!ctx) {
    throw new Error("useEnvironments must be used within EnvironmentsProvider");
  }
  return ctx;
}
