"use client";

import { providerColumns } from "@/components/ListTable/ProviderColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useEffect, useState } from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import idl from "@anchor/target/idl/provider.json";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Provider } from "@/lib/types";

export default function Content() {
  const [tableData, setTableData] = useState<ProgramAccount<Provider>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { anchorProvider } = useSolanaNetwork();

  const fetchData = async () => {
    if (anchorProvider) {
      setIsLoading(true);
      const program = new Program<ProviderProgram>(idl, anchorProvider);

      program.account.provider
        .all()
        .then((res) => {
          setTableData(res);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [anchorProvider]);

  const elementPath = "/providers";

  return (
    <>
      <div className="flex items-end justify-between gap-2 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Providers</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of available providers!
          </p>
        </div>
      </div>
      <DataTable<ProgramAccount<Provider>>
        columns={providerColumns()}
        data={tableData}
        isLoading={isLoading}
        elementPath={elementPath}
      />
    </>
  );
}
