"use client";

import { environmentColumns } from "@/components/ListTable/EnvironmentColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useEffect, useState } from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import idl from "@anchor/target/idl/environment.json";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Environment } from "@/lib/types";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useToast } from "@/hooks/use-toast";

export default function Content() {
  const [tableData, setTableData] = useState<ProgramAccount<Environment>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { anchorProvider } = useSolanaNetwork();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    const program = new Program<EnvironmentProgram>(idl, anchorProvider);

    program.account.environment
      .all()
      .then((res) => setTableData(res))
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to fetch environments.",
          variant: "destructive",
        }),
      )
      .finally(() => setIsLoading(false));
  }, [anchorProvider]);

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
        data={tableData}
        isLoading={isLoading}
      />
    </>
  );
}
