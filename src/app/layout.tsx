import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider as ShadcnThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/SidebarProvider";
import { NetworkProvider } from "@/components/NetworkProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import { AppWalletProvider } from "@/components/AppWalletProvider";

export const metadata: Metadata = {
  title: "Overlock",
  description: "by Web Seven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <ShadcnThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppWalletProvider>
            <NetworkProvider>
              <SidebarProvider>{children}</SidebarProvider>
              <Toaster />
            </NetworkProvider>
          </AppWalletProvider>
        </ShadcnThemeProvider>
      </body>
    </html>
  );
}
