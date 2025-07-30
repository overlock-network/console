"use client";

import { ConfigurationContractClient } from "@/chain/client";
import { useSearchParams } from "next/navigation";
import { NftProvider } from "@/chain/client";
import { ConfigurationCards } from "@/components/ConfigurationCards/ConfigurationCards";
import { MintConfigurationDialog } from "@/components/MintConfigurationDialog";

export function Content() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("id");

  if (!contractId) return;

  return (
    <NftProvider
      queryClientClass={ConfigurationContractClient}
      fetchInfo={async (client, tokenId) => {
        return await client.nftInfo({ tokenId });
      }}
      fetchNft={async (client, limit, startAfter) => {
        return await client.allTokens({ limit, startAfter });
      }}
      contractId={contractId}
    >
      <div className="flex ml-auto mb-4">
        <MintConfigurationDialog contractId={contractId} />
      </div>
      <ConfigurationCards id={contractId} />
    </NftProvider>
  );
}
