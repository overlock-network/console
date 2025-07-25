"use client";

import { ContractsProvider, GasContractClient } from "@/chain/client";
import { ContractsTable } from "@/components/ContractsTable";

export function Content() {
  const contractCodeId = process.env.NEXT_PUBLIC_GAS_CONTRACT_ID;
  if (!contractCodeId) return;
  return (
    <ContractsProvider
      queryClientClass={GasContractClient}
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
