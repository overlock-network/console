"use client";

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/Spinner";

interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
  loading?: boolean;
}

export function Pagination({
  page,
  hasNextPage,
  onPageChange,
  loading = false,
}: PaginationProps) {
  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page - 1);
            }}
            isActive={page === 0}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={page === 0}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(0);
            }}
          >
            {loading && page === 0 ? <Spinner size={"small"} /> : "1"}
          </PaginationLink>
        </PaginationItem>

        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {[page - 1, page, page + 1]
          .filter((p) => p > 0)
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {loading && p === page ? <Spinner size={"small"} /> : p + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

        {hasNextPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page + 1);
            }}
            isActive={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
