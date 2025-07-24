"use client";

import { ContractsProvider } from "@/chain/client";
import { Cw721baseQueryClient } from "@/../../generated/Cw721base.client";
import { ContractsTable } from "@/components/ContractsTable";

export function Content() {
  const contractCodeId = process.env.NEXT_PUBLIC_GAS_CONTRACT_ID;
  if (!contractCodeId) return;
  return (
    <ContractsProvider
      queryClientClass={Cw721baseQueryClient}
      fetchInfo={async (client) => {
        const info = await client.contractInfo();
        return {
          ...info,
          address: client.contractAddress,
        };
      }}
      contractCodeId={contractCodeId}
    >
      <ContractsTable />
    </ContractsProvider>
  );
}
