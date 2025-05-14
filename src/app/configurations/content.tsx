"use client";

import { useEffect, useState } from "react";
import { listConfiguration } from "@/api/ConfigurationApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Spinner } from "@/components/Spinner";
import { NftData } from "@/lib/types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

const PAGE_SIZE = 20;

export default function Content() {
  const [page, setPage] = useState(0);
  const [nfts, setNfts] = useState<NftData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { metaplexConnection } = useSolanaNetwork();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    const fetchConfigurations = async () => {
      setLoading(true);
      const { nfts, totalCount } = await listConfiguration(
        metaplexConnection,
        page,
        PAGE_SIZE,
      );
      setNfts(nfts);
      setTotalCount(totalCount);
      setLoading(false);
    };

    fetchConfigurations();
  }, [page]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {nfts.map((nft, idx) => (
            <Card key={idx} className="overflow-hidden">
              <Image src={nft.image} alt={nft.name} className="object-cover w-full h-full" />
              <CardHeader>
                <CardTitle className="text-lg truncate">{nft.name}</CardTitle>
                {nft.description && (
                  <CardDescription className="line-clamp-2">
                    {nft.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  isActive={page === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(0);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {page > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i)
                .filter(
                  (i) =>
                    i !== 0 && i !== totalPages - 1 && Math.abs(i - page) <= 1,
                )
                .map((i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i === page}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {page < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={page === totalPages - 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(totalPages - 1);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
