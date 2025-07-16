import { WalletModalProvider as SolanaWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletModalProvider } from "../WalletModalProvider";

export function WalletModalProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletModalProvider>
      <WalletModalProvider>{children}</WalletModalProvider>
    </SolanaWalletModalProvider>
  );
}
