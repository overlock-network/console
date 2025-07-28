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
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AccountMenu } from "@/components/AccountMenu";
import { NetworkSelector } from "@/components/NetworkSelector";
import Link from "next/link";
import {
  CirclePlus,
  Container,
  Fuel,
  KeyRound,
  LibraryBig,
  SquareStack,
  ChevronDown,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

const marketplace = [
  {
    title: "Gas",
    url: "/marketplace/gas",
    icon: Fuel,
  },
  {
    title: "Configurations",
    url: "/marketplace/configuration",
    icon: Code,
  },
];

const items = [
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

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup className={"p-0"}>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex items-center w-full">
                      Marketplace
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      {marketplace.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <a href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
              <SidebarSeparator className="mb-2" />
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
