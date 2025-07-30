import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Contract, Nft } from "@/lib/types";
import { overlock } from "@overlocknetwork/api";
import { TokensResponse } from "@/../../generated/Cw721base.types";

export type Network = { name: string; icon: React.ElementType };

export type NetworkMeta = {
  chain_name: string;
  status: "live" | "upcoming" | "killed" | undefined;
  network_type: string;
  pretty_name: string;
  chain_id: string;
  bech32_prefix: string;
  daemon_name: string;
  node_home: string;
  codebase: {
    genesis: {
      genesis_url: string;
    };
    git_repo: string;
    recommended_version: string;
    compatible_versions: string[];
    binaries: {
      "darwin/amd64": string;
      "darwin/arm64": string;
      "linux/amd64": string;
      "linux/arm64": string;
    };
  };
  fees: {
    fee_tokens: [
      {
        denom: string;
        fixed_min_gas_price: number;
        low_gas_price: number;
        average_gas_price: number;
        high_gas_price: number;
      },
    ];
  };
  peers: {
    seeds: [];
    persistent_peers: [
      {
        id: string;
        address: string;
      },
      {
        id: string;
        address: string;
      },
      {
        id: string;
        address: string;
      },
      {
        id: string;
        address: string;
      },
    ];
  };
  apis: {
    rpc: [
      {
        address: string;
      },
    ];
    rest: [
      {
        address: string;
        provider: string;
      },
    ];
    grpc: [
      {
        address: string;
        provider: string;
      },
    ];
  };
};

export type LCDClient = {
  overlock: {
    crossplane: {
      v1beta1: InstanceType<typeof overlock.crossplane.v1beta1.LCDQueryClient>;
    };
    storage: {
      v1beta1: InstanceType<typeof overlock.storage.v1beta1.LCDQueryClient>;
    };
  };
};

export interface ContractsContextType {
  contracts: Contract[];
  loading: boolean;
}

export interface NftContextType<T> {
  getCollectionNft: (
    address: string,
    startAfter?: string,
    limit?: number,
  ) => Promise<{
    nft: Nft<T>[];
    nextStartAfter?: string;
  }>;
  mintNft: (params: {
    contractAddress: string;
    tokenId: string;
    tokenUri?: string;
  }) => Promise<void>;
}

export interface ContractsProviderProps<T> {
  queryClientClass: QueryClientConstructor<T>;
  fetchInfo: (instance: T) => Promise<Contract>;
  children: React.ReactNode;
  contractCodeId: string;
}

export type QueryClientConstructor<T> = new (
  client: CosmWasmClient,
  address: string,
) => T;

export interface NftProviderProps<T> {
  queryClientClass: QueryClientConstructor<T>;
  fetchNft: (
    instance: T,
    limit: number,
    startAfter?: string,
  ) => Promise<TokensResponse>;
  fetchInfo: (
    instance: T,
    tokenId: string,
  ) => Promise<{ token_uri?: string | null }>;
  children: React.ReactNode;
  contractId: string;
}
