"use client";

import { Spinner } from "@/components/Spinner";
import { useNetwork, useProviders, useWallet } from "@/chain/client";
import { ProvidersMap } from "@/components/ProvidersMap";
import { ProviderDetails } from "@/components/ProviderDetails";
import { ProviderTable } from "@/components/ProviderTable";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Provider } from "@/lib/types";
import { useState } from "react";

export default function Content() {
  const { currentNetwork } = useNetwork();
  const { providers, isLoading } = useProviders();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWallet entitiesName="providers" />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-[1400px] w-full">
      {!selectedProvider ? (
        <>
          <div className="text-3xl font-bold mb-1">Network Capacity</div>
          <div>
            <span className="font-bold text-primary text-xl">
              {providers.filter((p) => p.availability).length}
            </span>{" "}
            active providers in {currentNetwork.name}
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
