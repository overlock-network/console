"use client";

import React, { createContext, useContext, useState } from "react";
import { ENV_TOKEN } from "@/lib/utils";
import { TokenDialog } from "@/components/TokenDialog";
import { Environment } from "@/lib/types";
import { useEnvironments } from "@/chain/client";

interface EnvironmentContextType {
  token: string | undefined;
  selectedEnv: string | undefined;
  setSelectedEnv: (env: string | undefined) => void;
  environments: Environment[];
  isLoading: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

export const EnvironmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedEnv, setSelectedEnv] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { environments, isLoading } = useEnvironments();

  React.useEffect(() => {
    if (!selectedEnv) return;

    const stored = sessionStorage.getItem(`${ENV_TOKEN}_${selectedEnv}`);
    if (stored) {
      setToken(stored);
      setDialogOpen(false);
    } else {
      setToken(undefined);
      setDialogOpen(true);
    }
  }, [selectedEnv]);

  const handleSaveToken = (newToken: string) => {
    if (!selectedEnv || !newToken) return;

    sessionStorage.setItem(`${ENV_TOKEN}_${selectedEnv}`, newToken);
    setToken(newToken);
    setDialogOpen(false);
  };

  return (
    <EnvironmentContext.Provider
      value={{ token, selectedEnv, setSelectedEnv, environments, isLoading }}
    >
      {children}
      <TokenDialog open={dialogOpen} onSave={handleSaveToken} />
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error("useEnvironment must be used within EnvironmentProvider");
  }
  return context;
};
