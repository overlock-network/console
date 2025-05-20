"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProvidersTableColumnHeader } from "./ColumnHeader";
import { ProgramAccount } from "@coral-xyz/anchor";

export const columns = (): ColumnDef<
  ProgramAccount<{
    name: string;
    ip: string;
    port: number;
    country: string;
    environmentType: string;
    availability: boolean;
  }>
>[] => [
  {
    accessorKey: "publicKey",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="Id" />
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
      <ProvidersTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.account.name}</div>
    ),
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="IP" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.account.ip}</div>
    ),
  },
  {
    accessorKey: "port",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="Port" />
    ),
    cell: ({ row }) => row.original.account.port,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => row.original.account.country,
  },
  {
    accessorKey: "environmentType",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="Environment" />
    ),
    cell: ({ row }) => row.original.account.environmentType,
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <ProvidersTableColumnHeader column={column} title="Available" />
    ),
    cell: ({ row }) => (row.original.account.availability ? "✅ Yes" : "❌ No"),
  },
];
