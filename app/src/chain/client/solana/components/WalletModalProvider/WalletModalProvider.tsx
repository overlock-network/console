import React, { createContext, useContext } from "react";
import { useWalletModal as useSolanaWalletModal } from "@solana/wallet-adapter-react-ui";

interface WalletModalContextType {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const WalletModalContext = createContext<WalletModalContextType | null>(null);

const WalletModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { visible, setVisible } = useSolanaWalletModal();

  const contextValue: WalletModalContextType = {
    visible: visible,
    setVisible: setVisible,
  };

  return (
    <WalletModalContext.Provider value={contextValue}>
      {children}
    </WalletModalContext.Provider>
  );
};

const useWalletModal = () => {
  const context = useContext(WalletModalContext);
  if (!context) {
    throw new Error("useWalletModal must be used within a WalletModalProvider");
  }
  return context;
};

export { WalletModalProvider, useWalletModal };
