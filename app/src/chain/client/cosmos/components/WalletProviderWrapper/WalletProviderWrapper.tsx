import { WalletProvider } from "../WalletProvider";
import { ChainProvider } from "@cosmos-kit/react";
import { useNetwork } from "../NetworkProvider";
import {
  KeplrExtensionWallet,
  keplrExtensionInfo,
} from "@cosmos-kit/keplr-extension";
import { DefaultModal } from "@cosmos-kit/react";
import {
  getOverlockChain,
  getOverlockAssetList,
} from "@/chain/client/cosmos/lib/utils";

export function WalletProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { networkMeta: meta, currentNetwork } = useNetwork();
  const wallets = [new KeplrExtensionWallet(keplrExtensionInfo)];

  const chain = getOverlockChain(meta, currentNetwork);
  const assetList = getOverlockAssetList(meta);

  return (
    <ChainProvider
      chains={[chain]}
      wallets={wallets}
      throwErrors={false}
      assetLists={[assetList]}
      walletModal={DefaultModal}
      endpointOptions={{
        endpoints: {
          [meta.chain_name]: {
            rpc: meta.apis.rpc.map((api) => api.address),
            rest: meta.apis.rest.map((api) => api.address),
          },
        },
      }}
    >
      <WalletProvider>{children}</WalletProvider>
    </ChainProvider>
  );
}
