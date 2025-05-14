import { Metaplex, Metadata } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { NftData } from "@/lib/types";

export async function listConfiguration(
  metaplex: Metaplex,
  page: number,
  pageSize = 20,
): Promise<{ nfts: NftData[]; totalCount: number }> {
  try {
    const updateAuthority =
      process.env.NEXT_PUBLIC_CONFIGURATION_COLLECTION_UPDATE_AUTHORITY;

    if (!updateAuthority) {
      return { nfts: [], totalCount: 0 };
    }

    const addresses = updateAuthority.split(",").filter(Boolean);

    const metadataArrays = await Promise.all(
      addresses.map((a) =>
        metaplex.nfts().findAllByUpdateAuthority({
          updateAuthority: new PublicKey(a),
        }),
      ),
    );
    
    const allMetadata = metadataArrays.flat();

    const totalCount = allMetadata.length;
    const start = page * pageSize;
    const end = start + pageSize;
    const pageItems = allMetadata.slice(start, end) as Metadata[];

    const loaded = await Promise.all(
      pageItems.map(async (metadata) => {
        try {
          const nft = await metaplex.nfts().load({ metadata });
          return {
            name: nft.name,
            image: nft.json?.image || "",
            description: nft.json?.description,
          };
        } catch {
          return undefined;
        }
      }),
    );

    const filtered = loaded.filter((n) => n && n.image && n.name) as NftData[];

    return { nfts: filtered, totalCount };
  } catch (e) { console.log(e)
    return { nfts: [], totalCount: 0 };
  }
}
