"use client";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function AccountMenu() {
  const { toast } = useToast();
  const { publicKey, disconnect, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connection]);

  const handleCopyAddress = async () => {
    await navigator.clipboard
      .writeText(publicKey?.toString() || "")
      .finally(() => {
        toast({
          title: "Address copied to clipboard",
        });
      });
  };

  const handleDropdownOpenChange = (open: boolean) => {
    if (!connected) {
      setVisible(true);
      return;
    }
    setIsDropdownOpen(open);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          open={isDropdownOpen}
          onOpenChange={handleDropdownOpenChange}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="text-ellipsis font-semibold whitespace-nowrap overflow-hidden text-left"
                  style={{ direction: "rtl" }}
                >
                  {!publicKey ? "Connect" : publicKey.toString()}
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
                    className="text-ellipsis font-semibold whitespace-nowrap overflow-hidden text-left"
                    style={{ direction: "rtl" }}
                  >
                    {publicKey?.toString()}
                  </span>
                </div>
                {publicKey && (
                  <Copy
                    width={15}
                    height={15}
                    className="cursor-pointer"
                    onClick={handleCopyAddress}
                  />
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel className="px-0 pb-0 pt-2 font-normal">
              <span className="text-xs px-2">Wallet balance</span>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>SOL</TableCell>
                    <TableCell align="right">
                      {balance !== null ? balance.toFixed(4) : "Loading..."}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                await disconnect();
                setIsDropdownOpen(false);
              }}
            >
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
