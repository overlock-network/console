"use client";

import { NftContractClient } from "@/chain/client";
import { useSearchParams } from "next/navigation";
import { NftProvider } from "@/chain/client";
import { GasCards } from "@/components/GasCards";

export function Content() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("id");
  if (!contractId) return;

  return (
    <NftProvider<NftContractClient>
      queryClientClass={NftContractClient}
      fetchInfo={async (client, tokenId) => {
        return await client.nftInfo({ tokenId });
      }}
      contractId={contractId}
      fetchNft={async (client, limit, startAfter) => {
        return await client.allTokens({ limit, startAfter });
      }}
    >
      <GasCards id={contractId} />
    </NftProvider>
  );
}
