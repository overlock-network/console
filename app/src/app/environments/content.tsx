"use client";

import { environmentColumns } from "@/components/ListTable/EnvironmentColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Environment } from "@/lib/types";
import { useWallet, useEnvironments } from "@/chain/client";

export default function Content() {
  const { environments, isLoading } = useEnvironments();
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWallet entitiesName="environments" />;
  }

  return (
    <div className="max-w-[1400px] w-full">
      <div className="flex items-end justify-between gap-2 mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Environments
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of available environments!
          </p>
        </div>
      </div>
      <DataTable<Environment>
        columns={environmentColumns()}
        data={environments}
        isLoading={isLoading}
      />
    </div>
  );
}
