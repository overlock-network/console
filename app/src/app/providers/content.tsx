"use client";

import { columns } from "@/components/ListTable/Columns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useEffect, useState } from "react";
import { ListTableData } from "@/lib/types";
import { listProvider } from "@/api/ProviderApi";
import { useNetwork } from "@/components/NetworkProvider";

export default function Content() {
  const [tableData, setTableData] = useState<ListTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { LCDClient } = useNetwork();

  const fetchData = async () => {
    setIsLoading(true);
    if (LCDClient) {
      await listProvider(LCDClient)
        .then((res) => {
          setTableData(
            res.map((prov) => ({
              id: prov.id.toString(),
              name: prov.metadata?.name,
            })) || [],
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [LCDClient]);

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
      <DataTable
        columns={columns()}
        data={tableData}
        isLoading={isLoading}
        elementPath={elementPath}
      />
    </>
  );
}
