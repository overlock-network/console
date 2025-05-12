"use client";

import React from "react";
import { AppSidebar } from "../AppSidebar";
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar";

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ShadcnSidebarProvider>
      <AppSidebar />
      {children}
    </ShadcnSidebarProvider>
  );
};
