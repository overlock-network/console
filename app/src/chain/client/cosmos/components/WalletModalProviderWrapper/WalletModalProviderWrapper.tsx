"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { useNetwork } from "../NetworkProvider";

interface WalletModalContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletModalContext = createContext<WalletModalContextType | null>(null);

const WalletModalProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const { networkMeta } = useNetwork();
  const { openView, closeView, status } = useChain(networkMeta.chain_name);

  useEffect(() => {
    if (visible) {
      openView();
    } else {
      closeView();
    }
  }, [visible, openView, closeView]);

  useEffect(() => {
    if (status === "Connected") {
      setVisible(false);
    }
  }, [status]);

  return (
    <WalletModalContext.Provider value={{ visible, setVisible }}>
      {children}
    </WalletModalContext.Provider>
  );
};

export const useWalletModal = (): WalletModalContextType => {
  const context = useContext(WalletModalContext);
  if (!context)
    throw new Error("useWalletModal must be used within WalletModalProvider");
  return context;
};

export { WalletModalProviderWrapper };
