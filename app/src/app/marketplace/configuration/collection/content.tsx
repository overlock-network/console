"use client";

import { ConfigurationContractClient } from "@/chain/client";
import { useSearchParams } from "next/navigation";
import { NftProvider } from "@/chain/client";
import { ConfigurationCards } from "@/components/ConfigurationCards/ConfigurationCards";

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
      <ConfigurationCards id={contractId} />
    </NftProvider>
  );
}
