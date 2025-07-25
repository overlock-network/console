import { Nft } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useNft } from "@/chain/client";

const NFT_CARDS_QUANTITY = 20;

export function GasCards({ id }: { id: string }) {
  const { getCollectionNft } = useNft();
  const [nft, setNft] = useState<Nft[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [startAfterMap, setStartAfterMap] = useState<{
    [key: number]: string | undefined;
  }>({ 0: undefined });
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setPageLoading(true);
      const startAfter = startAfterMap[page];

      try {
        const { nft: fetchedNft, nextStartAfter } = await getCollectionNft(
          id,
          startAfter,
          NFT_CARDS_QUANTITY,
        );
        setNft(fetchedNft);
        setHasNextPage(!!nextStartAfter);

        if (nextStartAfter) {
          setStartAfterMap((prev) => ({
            ...prev,
            [page + 1]: nextStartAfter,
          }));
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetch();
  }, [id, page, getCollectionNft]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) return;
    if (newPage > page && !hasNextPage) return;
    setPage(newPage);
  };

  return (
    <div className="max-w-[1400px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {nft.map((n) => (
          <Card key={n.tokenId} className="overflow-hidden">
            {n.image ? (
              <div className="relative w-full pt-[100%]">
                <Image
                  src={n.image}
                  alt={n.name || n.tokenId}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg truncate">
                {n.name || `Token #${n.tokenId}`}
              </CardTitle>
              {n.description && (
                <CardDescription className="line-clamp-2">
                  {n.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button>Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {nft.length > 0 && (
        <div className="mt-6">
          <Pagination
            page={page}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
            loading={pageLoading}
          />
        </div>
      )}
    </div>
  );
}
