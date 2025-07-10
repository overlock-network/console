"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface RowActionsProps<TData> {
  row: Row<TData>;
  actions?: Action<TData>[];
}

interface Action<TData> {
  label: string;
  path?: (row: TData) => string;
  onClick?: (row: TData) => void;
  shortcut?: string;
}

export function RowActions<TData>({ row, actions }: RowActionsProps<TData>) {
  if (actions) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(event) => event.stopPropagation()}
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick?.(row.original);
              }}
              className="cursor-pointer"
            >
              {action.path ? (
                <Link
                  className="w-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick?.(row.original);
                  }}
                  href={action.path(row.original)}
                >
                  {action.label}
                </Link>
              ) : (
                <>
                  {action.label}
                  {action.shortcut && (
                    <DropdownMenuShortcut>
                      {action.shortcut}
                    </DropdownMenuShortcut>
                  )}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
