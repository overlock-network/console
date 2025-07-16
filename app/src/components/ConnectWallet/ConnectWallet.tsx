"use client";

import { Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { useWalletModal } from "@/chain/client";

export const ConnectWallet = ({ entitiesName }: { entitiesName: string }) => {
  const { setVisible } = useWalletModal();

  return (
    <div className="flex justify-center flex-col gap-3 items-center h-full">
      <div className="text-xl font-bold">No {entitiesName} yet.</div>
      <p>
        If you are expecting to see some, you may need to sign-in or connect a
        wallet
      </p>
      <Button
        variant="outline"
        className="mt-5"
        onClick={() => {
          setVisible(true);
        }}
      >
        <Wallet /> Connect Wallet
      </Button>
    </div>
  );
};
