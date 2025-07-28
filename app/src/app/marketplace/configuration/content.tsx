"use client";

import { ContractsProvider, NftContractClient } from "@/chain/client";
import { ContractsTable } from "@/components/ContractsTable";

export function Content() {
  const contractCodeId = process.env.NEXT_PUBLIC_CONFIGURATION_CONTRACT_ID;

  if (!contractCodeId) return;
  return (
    <ContractsProvider
      queryClientClass={NftContractClient}
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
