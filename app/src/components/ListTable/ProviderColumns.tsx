"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Provider } from "@/lib/types";

export const providerColumns = (): ColumnDef<Provider>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate">{row.original.id}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="truncate">{row.original.name}</div>,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
    cell: ({ row }) => <div className="truncate">{row.original.ip}</div>,
  },
  {
    accessorKey: "port",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Port" />
    ),
    cell: ({ row }) => row.original.port,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => row.original.country,
  },
  {
    accessorKey: "environmentType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Environment" />
    ),
    cell: ({ row }) => row.original.environmentType,
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
    cell: ({ row }) => (row.original.availability ? "Yes" : "No"),
  },
];
