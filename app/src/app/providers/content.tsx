"use client";

import { columns } from "@/components/ListTable/Columns";
import { ProvidersTable } from "@/components/ListTable/ProvidersTable";
import { useEffect, useState } from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import idl from "@anchor/target/idl/provider.json";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";

export default function Content() {
  const [tableData, setTableData] = useState<
    ProgramAccount<{
      name: string;
      ip: string;
      port: number;
      country: string;
      environmentType: string;
      availability: boolean;
    }>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const { anchorProvider } = useSolanaNetwork();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <ProvidersTable
        columns={columns()}
        data={tableData}
        isLoading={isLoading}
      />
    </>
  );
}
