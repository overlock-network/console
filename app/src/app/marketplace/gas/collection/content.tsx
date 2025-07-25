"use client";

import { GasContractClient } from "@/chain/client";

import { useSearchParams } from "next/navigation";
import { NftProvider } from "@/chain/client";
import { NftCards } from "@/components/NftCards";

export function Content() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("id");
  if (!contractId) return;

  return (
    <NftProvider<GasContractClient>
      queryClientClass={GasContractClient}
      fetchInfo={async (client, tokenId) => {
        return await client.nftInfo({ tokenId });
      }}
      contractId={contractId}
      fetchNft={async (client, limit, startAfter) => {
        return await client.allTokens({ limit, startAfter });
      }}
    >
      <NftCards id={contractId} />
    </NftProvider>
  );
}
