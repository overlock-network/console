"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Resource } from "@/lib/types";

export const resourceColumns = (): ColumnDef<Resource>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return row.original.resource;
    },
  },
  {
    accessorKey: "kind",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kind" />
    ),
    cell: ({ row }) => {
      return row.original.kind;
    },
  },
  {
    accessorKey: "Group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    cell: ({ row }) => {
      return row.original.group;
    },
  },
  {
    accessorKey: "Version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Version" />
    ),
    cell: ({ row }) => {
      return row.original.version;
    },
  },
  {
    accessorKey: "Plural",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plural" />
    ),
    cell: ({ row }) => {
      return row.original.plural;
    },
  },
];
