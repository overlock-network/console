import React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useNetwork } from "@/chain/client";

export function NetworkSelector() {
  const sidebar = useSidebar();
  const { currentNetwork, networks, setCurrentNetwork } = useNetwork();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/images/overlock_galaxy_icon.png"
                    alt="Overlock Logo"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
                <div className="text-md grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">
                    Overlock Console
                  </span>
                  <span className="truncate text-xs">
                    {currentNetwork.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={sidebar.leftSidebar.isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Networks
              </DropdownMenuLabel>
              {networks.map((network) => (
                <DropdownMenuItem
                  key={network.name}
                  onClick={() => setCurrentNetwork(network)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <network.icon className="size-4 shrink-0" />
                  </div>
                  {network.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
