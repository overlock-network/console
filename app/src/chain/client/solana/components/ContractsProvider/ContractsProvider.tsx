"use client";

import { createContext, useContext, useState } from "react";
import { Contract } from "@/lib/types";
import { ContractsContextType, ContractsProviderProps } from "@/chain/client";

const ContractsContext = createContext<ContractsContextType | undefined>(
  undefined,
);

export function ContractsProvider<T>({ children }: ContractsProviderProps<T>) {
  const [contracts] = useState<Contract[]>([]);
  const [loading] = useState(false);

  return (
    <ContractsContext.Provider value={{ contracts, loading }}>
      {children}
    </ContractsContext.Provider>
  );
}

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context)
    throw new Error("useContracts must be used within a ContractsProvider");
  return context;
};
