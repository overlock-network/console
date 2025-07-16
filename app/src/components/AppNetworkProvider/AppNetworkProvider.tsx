"use client";

import { NetworkProvider } from "@/chain/client";

export function AppNetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NetworkProvider>{children}</NetworkProvider>;
}
