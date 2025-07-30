export * from "./components";
export * from "./lib/types";
export * from "./hooks";
export { WalletProviderWrapper } from "./components/WalletProviderWrapper";
export { useWallet } from "./components/WalletProvider";
export { useNft, NftProvider } from "./components/NftProvider";
export class GasContractClient {
  nftInfo = async ({}: {
    tokenId: string;
  }): Promise<{ token_uri?: string | null | undefined }> => {
    return { token_uri: undefined };
  };

  allTokens = async ({}: {
    limit?: number;
    startAfter?: string;
  }): Promise<{ tokens: string[] }> => {
    return { tokens: [] };
  };
}

export class ConfigurationContractClient {
  nftInfo = async ({}: {
    tokenId: string;
  }): Promise<{ token_uri?: string | null | undefined }> => {
    return { token_uri: undefined };
  };

  allTokens = async ({}: {
    limit?: number;
    startAfter?: string;
  }): Promise<{ tokens: string[] }> => {
    return { tokens: [] };
  };
}
