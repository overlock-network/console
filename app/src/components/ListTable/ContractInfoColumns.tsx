"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Contract } from "@/lib/types";

export const ContractInfoColumns = (): ColumnDef<Contract>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return row.original.name;
    },
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => {
      return row.original.symbol;
    },
  },
];
