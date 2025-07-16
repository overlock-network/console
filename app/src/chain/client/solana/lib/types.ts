import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import { IdlAccounts } from "@coral-xyz/anchor";

export type ChainProvider = IdlAccounts<ProviderProgram>["provider"];

export type ChainEnvironment = IdlAccounts<EnvironmentProgram>["environment"];

export type Cluster = "devnet" | "testnet" | "mainnet-beta" | "localnet";
export type Network = { name: Cluster; icon: React.ElementType };
