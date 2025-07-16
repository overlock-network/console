"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { AccountMenu } from "@/components/AccountMenu";
import { NetworkSelector } from "@/components/NetworkSelector";
import Link from "next/link";
import {
  CirclePlus,
  Container,
  KeyRound,
  LibraryBig,
  SquareStack,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
  },
  {
    title: "Environments",
    url: "/environments",
    icon: Container,
  },
  {
    title: "Providers",
    url: "/providers",
    icon: LibraryBig,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: SquareStack,
  },
  {
    title: "Key Rings",
    url: "/keyrings",
    icon: KeyRound,
  },
];

export function AppSidebar() {
  const { leftSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        <NetworkSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarSeparator className="mb-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/create">
                  <SidebarMenuButton
                    className={cn(
                      "mb-5 w-full bg-primary",
                      leftSidebar.open && "justify-center",
                    )}
                  >
                    <CirclePlus /> Create
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AccountMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
