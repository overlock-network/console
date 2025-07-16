import { GeneratedType } from "@cosmjs/proto-signing";
import {
  overlockAminoConverters,
  overlockProtoRegistry,
} from "@overlocknetwork/api";
import {
  cosmosAminoConverters,
  cosmosProtoRegistry,
  cosmwasmAminoConverters,
  cosmwasmProtoRegistry,
  ibcAminoConverters,
  ibcProtoRegistry,
} from "interchain";
import type { AssetList, Chain } from "@chain-registry/types";
import { NetworkMeta } from "./types";

export const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ...cosmosProtoRegistry,
  ...cosmwasmProtoRegistry,
  ...ibcProtoRegistry,
  ...overlockProtoRegistry,
];

export const aminoConverters = {
  ...cosmosAminoConverters,
  ...cosmwasmAminoConverters,
  ...ibcAminoConverters,
  ...overlockAminoConverters,
};

export const COIN_DECIMALS = 6;

export function getOverlockChain(meta: NetworkMeta): Chain {
  return {
    chain_name: meta.chain_name,
    status: meta.status,
    network_type: "testnet",
    pretty_name: meta.pretty_name,
    chain_id: meta.chain_id,
    chain_type: "cosmos",
    bech32_prefix: meta.bech32_prefix,
    daemon_name: meta.daemon_name,
    node_home: meta.node_home,
    slip44: 118,
    codebase: {
      git_repo: meta.codebase.git_repo,
      recommended_version: meta.codebase.recommended_version,
      compatible_versions: meta.codebase.compatible_versions,
      binaries: meta.codebase.binaries,
      genesis: {
        genesis_url: meta.codebase.genesis.genesis_url,
      },
    },
    fees: {
      fee_tokens: meta.fees.fee_tokens.map((token) => ({
        denom: token.denom,
        fixed_min_gas_price: token.fixed_min_gas_price,
        low_gas_price: token.low_gas_price,
        average_gas_price: token.average_gas_price,
        high_gas_price: token.high_gas_price,
      })),
    },
    peers: {
      seeds: meta.peers.seeds || [],
      persistent_peers: meta.peers.persistent_peers || [],
    },
    apis: {
      rpc: meta.apis.rpc.map((api) => ({
        address: api.address,
      })),
      rest: meta.apis.rest.map((api) => ({
        address: api.address,
        provider: api.provider,
      })),
      grpc: meta.apis.grpc.map((api) => ({
        address: api.address,
        provider: api.provider,
      })),
    },
  };
}

export function getOverlockAssetList(meta: NetworkMeta): AssetList {
  const denom = meta.fees.fee_tokens[0].denom;

  return {
    chain_name: meta.chain_name,
    assets: [
      {
        denom_units: [
          {
            denom,
            exponent: COIN_DECIMALS,
          },
        ],
        base: denom,
        name: "Overlock Token",
        display: denom,
        symbol: denom,
        type_asset: "sdk.coin",
      },
    ],
  };
}
