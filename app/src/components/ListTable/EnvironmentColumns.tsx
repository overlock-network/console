"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Environment } from "@/lib/types";
import { ProgramAccount } from "@coral-xyz/anchor";

export const environmentColumns = (): ColumnDef<
  ProgramAccount<Environment>
>[] => [
  {
    accessorKey: "publicKey",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate">
        {row.original.publicKey.toBase58()}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.account.name}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner ID" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.account.owner.toBase58()}</div>
    ),
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider ID" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.account.provider.toBase58()}</div>
    ),
  },
];
