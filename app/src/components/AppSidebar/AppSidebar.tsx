"use client";

import React from "react";
import { Code, Container, LibraryBig } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { AccountMenu } from "@/components/AccountMenu";
import { NetworkSelector } from "@/components/NetworkSelector";
import { SolanaNetworkSelector } from "../SolanaNetworkSelector";

const items = [
  {
    title: "Configurations",
    url: "/configurations",
    icon: Code,
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
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        <NetworkSelector />
        <SolanaNetworkSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarSeparator className="mb-2" />
          <SidebarGroupContent>
            <SidebarMenu>
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
