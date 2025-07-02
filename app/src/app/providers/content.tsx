"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import idl from "@anchor/target/idl/provider.json";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import type { Provider } from "@/lib/types";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import { ProvidersMap } from "../../components/ProvidersMap";
import { ProviderDetails } from "../../components/ProviderDetails";
import { ProviderTable } from "../../components/ProviderTable";

export default function Content() {
  const [providers, setProviders] = useState<ProgramAccount<Provider>[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { toast } = useToast();
  const { connection, currentSolanaNetwork } = useSolanaNetwork();

  const program = useMemo(() => {
    return new Program<ProviderProgram>(idl, { connection });
  }, [connection]);

  useEffect(() => {
    if (!program) return;
    setIsLoading(true);
    program.account.provider
      .all()
      .then(setProviders)
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to fetch providers.",
          variant: "destructive",
        }),
      )
      .finally(() => setIsLoading(false));
  }, [program]);

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-[1400px] w-full">
      {!selectedProvider ? (
        <>
          <div className="text-3xl font-bold mb-1">Network Capacity</div>
          <div>
            <span className="font-bold text-primary text-xl">
              {providers.filter((p) => p.account.availability).length}
            </span>{" "}
            active providers in {currentSolanaNetwork.name}
          </div>
          <div className="flex flex-col items-center">
            <div className="max-w-[800px] w-full">
              <ProvidersMap
                providers={providers}
                hoveredCountry={hoveredCountry}
                setHoveredCountry={setHoveredCountry}
                onSelect={setSelectedProvider}
              />
            </div>

            <ProviderTable
              providers={providers}
              onSelect={setSelectedProvider}
            />
          </div>
        </>
      ) : (
        <ProviderDetails
          provider={selectedProvider}
          onBack={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}
