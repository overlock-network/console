"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Environment } from "@/lib/types";

export const environmentColumns = (): ColumnDef<Environment>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
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
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner ID" />
    ),
    cell: ({ row }) => <div className="truncate">{row.original.ownerId}</div>,
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider ID" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.original.providerId}</div>
    ),
  },
];
