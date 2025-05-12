"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, Copy, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Spinner } from "../Spinner";
import { useRouter } from "next/navigation";

export function AccountMenu() {
  const { toast } = useToast();
  const signerAddress = "cosmos1d5q6t64ht8jnrzpepgyff5klk96j847pkv6a75";
  const router = useRouter();

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(signerAddress || "").finally(() => {
      toast({
        title: "Address copied to clipboard",
      });
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="text-ellipsis font-semibold whitespace-nowrap overflow-hidden text-right"
                  style={{ direction: "rtl" }}
                >
                  {!signerAddress ? <Spinner /> : signerAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex gap-2 px-1 py-1.5 text-left text-sm items-center">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span
                    className="text-ellipsis font-semibold whitespace-nowrap overflow-hidden text-right"
                    style={{ direction: "rtl" }}
                  >
                    {!signerAddress ? <Spinner /> : signerAddress}
                  </span>
                </div>
                <Copy
                  width={15}
                  height={15}
                  className="cursor-pointer"
                  onClick={handleCopyAddress}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel className="px-0 pb-0 pt-2 font-normal">
              <span className="text-xs px-2">Wallet balance</span>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>denom</TableCell>
                    <TableCell align="right">99999999</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
