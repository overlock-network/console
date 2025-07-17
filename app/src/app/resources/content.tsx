"use client";

import { useEffect, useState } from "react";
import { resourceColumns } from "@/components/ListTable/ResourceColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useWallet, useProviders } from "@/chain/client";
import { useToast } from "@/hooks/use-toast";
import { ConnectWallet } from "@/components/ConnectWallet";
import { listResources } from "@/api/ResourcesApi";
import { Resource } from "@/lib/types";
import { useEnvironment } from "@/components/EnvironmentProvider";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";

export default function Content() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const { environments, token, selectedEnv } = useEnvironment();

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedEnvAccount = environments.find((env) => env.id === selectedEnv);
  const { provider } = useProviders(selectedEnvAccount?.providerId);

  useEffect(() => {
    if (!provider || !token || !selectedEnvAccount) return;

    setIsLoading(true);

    listResources(provider, token)
      .then((data) => {
        setResources(data);
      })
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to fetch resources.",
          variant: "destructive",
        }),
      )
      .finally(() => setIsLoading(false));
  }, [provider, token, selectedEnvAccount, toast]);

  if (!connected) {
    return <ConnectWallet entitiesName="resources" />;
  }

  return (
    <>
      <div className="max-w-[1400px] w-full">
        <div className="flex items-end justify-between gap-2 mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Resources
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of available resources!
            </p>
          </div>
          <EnvironmentSelector />
        </div>

        <DataTable<Resource>
          columns={resourceColumns()}
          data={resources}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
