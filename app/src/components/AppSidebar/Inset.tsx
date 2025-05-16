"use client";

import React, { ReactNode } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export function Inset({
  pageTitle,
  children,
}: {
  pageTitle?: string;
  children: ReactNode;
}) {
  const params = useParams();

  let configurationId: string | undefined;

  if (params?.id) {
    configurationId = Array.isArray(params.id) ? params.id[0] : params.id;
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" side="left" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {pageTitle == "Editor" && configurationId ? (
            <>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <SidebarTrigger side="right" />
            </>
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {pageTitle ? (
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {pageTitle && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </header>
      {children}
    </SidebarInset>
  );
}
