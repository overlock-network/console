import { V1ObjectMeta } from "@kubernetes/client-node";
import { RJSFSchema } from "@rjsf/utils";

export interface Environment {
  id: string;
  name: string;
  ownerId: string;
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  ip: string;
  port: number;
  country: string;
  environmentType: string;
  availability: boolean;
}

export interface NftData {
  name: string;
  image: string;
  description?: string;
}

export interface CompositeResourceDefinitionVersion {
  name: string;
  served: boolean;
  storage: boolean;
  schema: RJSFSchema;
}

export interface CompositeResourceDefinitionSpecNames {
  kind: string;
  plural: string;
}

export interface CompositeResourceDefinitionSpec {
  names: CompositeResourceDefinitionSpecNames;
  group: string;
  versions: CompositeResourceDefinitionVersion[];
}

export interface CompositeResourceDefinition {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: CompositeResourceDefinitionSpec;
}

export interface Resource {
  kind: string;
  group: string;
  version: string;
  plural: string;
  resource: string;
}

export type Key = {
  name: string;
  environment: string;
  namespace: string;
  data?: Record<string, string>;
};

export type Coin = {
  denom: string;
  amount: string;
};

export interface Contract {
  name: string;
  symbol: string;
  address: string;
}

export interface Nft {
  tokenId: string;
  tokenUri: string;
  name: string;
  image: string;
  description: string;
}
