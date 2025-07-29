"use client";

import { ContractsProvider, ConfigurationContractClient } from "@/chain/client";
import { ContractsTable } from "@/components/ContractsTable";
import { useRouter } from "next/navigation";

export function Content() {
  const contractCodeId = process.env.NEXT_PUBLIC_CONFIGURATION_CONTRACT_ID;
  const router = useRouter();

  if (!contractCodeId) return;
  return (
    <ContractsProvider
      queryClientClass={ConfigurationContractClient}
      fetchInfo={async (client) => {
        const info = await client.contractInfo();
        return {
          ...info,
          address: client.contractAddress,
        };
      }}
      contractCodeId={contractCodeId}
    >
      <ContractsTable
        onRowClick={(row) => {
          router.push(
            `/marketplace/configuration/collection?id=${row.address}`,
          );
        }}
      />
    </ContractsProvider>
  );
}
