import { overlock } from "@overlocknetwork/api";

export type Cluster = "devnet" | "testnet" | "mainnet-beta";
export type SolanaNetwork = { name: Cluster; icon: React.ElementType };

export type Network = { name: string; icon: React.ElementType };

export type NetworkMeta = {
  chain_name: string;
  status: string;
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

export type ListTableData = {
  id: string;
  name: string | undefined;
};

export interface NftData {
  name: string;
  image: string;
  description?: string;
}
