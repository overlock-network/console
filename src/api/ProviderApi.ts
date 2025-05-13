import { LCDClient } from "@/lib/types";
import { ProviderSDKType } from "@overlocknetwork/api/dist/overlock/crossplane/v1beta1/provider";

export async function listProvider(
  client: LCDClient,
): Promise<ProviderSDKType[]> {
  return (await client.overlock.crossplane.v1beta1.listProvider({})).Providers;
}

export async function getProvider(params: {
  client: LCDClient;
  id: bigint;
}): Promise<ProviderSDKType | undefined> {
  return (
    await params.client.overlock.crossplane.v1beta1.showProvider({
      id: params.id,
    })
  ).Provider;
}
