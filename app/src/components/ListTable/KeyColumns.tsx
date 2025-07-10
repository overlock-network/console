"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Key } from "@/lib/types";
import { RowActions } from "./RowActions";

export const keyColumns = (
  actions?: Array<{
    label: string;
    path?: (row: Key) => string;
    onClick?: (row: Key) => void;
    shortcut?: string;
  }>,
): ColumnDef<Key>[] => [
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
    accessorKey: "environment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Environment" />
    ),
    cell: ({ row }) => {
      return row.original.environment;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
  },
];
