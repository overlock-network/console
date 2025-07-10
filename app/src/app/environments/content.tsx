"use client";

import { environmentColumns } from "@/components/ListTable/EnvironmentColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useEnvironments } from "@/components/EnvironmentsProvider";
import { ConnectWallet } from "@/components/ConnectWallet";
import { ProgramAccount } from "@coral-xyz/anchor";
import { Environment } from "@/lib/types";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";

export default function Content() {
  const { environments, isLoading } = useEnvironments();
  const { anchorProvider } = useSolanaNetwork();

  if (!anchorProvider) {
    return <ConnectWallet entitiesName="environments" />;
  }

  return (
    <>
      <div className="flex items-end justify-between gap-2 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Environments</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of available environments!
          </p>
        </div>
      </div>
      <DataTable<ProgramAccount<Environment>>
        columns={environmentColumns()}
        data={environments}
        isLoading={isLoading}
      />
    </>
  );
}
