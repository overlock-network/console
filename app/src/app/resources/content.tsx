"use client";

import { useEffect, useState } from "react";
import { resourceColumns } from "@/components/ListTable/ResourceColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useWallet, useEnvironments, useProviders } from "@/chain/client";
import { useToast } from "@/hooks/use-toast";
import { ConnectWallet } from "@/components/ConnectWallet";
import { TokenDialog } from "@/components/TokenDialog";
import { useSessionToken } from "@/hooks/use-session-token";
import { listResources } from "@/api/ResourcesApi";
import { ENV_TOKEN } from "@/lib/utils";
import { Resource } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Content() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const { environments } = useEnvironments();
  const { token } = useSessionToken(ENV_TOKEN);

  const [selectedEnv, setSelectedEnv] = useState<string>();
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
          <Select value={selectedEnv ?? ""} onValueChange={setSelectedEnv}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {environments.length > 0 ? (
                environments.map((env) => (
                  <SelectItem key={env.id} value={env.id}>
                    {env.name ?? env.id}
                  </SelectItem>
                ))
              ) : (
                <span className="text-xs pl-2">environments not found</span>
              )}
            </SelectContent>
          </Select>
        </div>

        <DataTable<Resource>
          columns={resourceColumns()}
          data={resources}
          isLoading={isLoading}
        />
      </div>

      <TokenDialog />
    </>
  );
}
