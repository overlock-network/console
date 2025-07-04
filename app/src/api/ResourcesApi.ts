import type { Provider, Resource } from "@/lib/types";
import type { CompositeResourceDefinition } from "@/lib/types";
import {
  KubernetesObject,
  KubernetesListObject,
} from "@kubernetes/client-node";

export async function listResources(
  provider: Provider,
  token: string
): Promise<Resource[]> {
  const result: Resource[] = [];

  const baseUrl = `https://${provider.ip}:${provider.port}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const xrdRes = await fetch(
    `${baseUrl}/apis/apiextensions.crossplane.io/v1/compositeresourcedefinitions`,
    { headers }
  );

  if (!xrdRes.ok) {
    throw new Error("Failed to fetch XRDs");
  }

  const xrdData: KubernetesListObject<CompositeResourceDefinition> =
    await xrdRes.json();

  for (const item of xrdData.items) {
    const kind = item.spec.names.kind;
    const plural = item.spec.names.plural;
    const group = item.spec.group;
    const version = item.spec.versions[0]?.name;

    if (!version) continue;

    try {
      const res = await fetch(
        `${baseUrl}/apis/${group}/${version}/${plural}`,
        { headers }
      );

      if (!res.ok) {
        console.warn(`Skipping ${kind}: fetch failed`);
        continue;
      }

      const json: KubernetesListObject<KubernetesObject> = await res.json();

      const resources: Resource[] = json.items
        .map((i) => i.metadata?.name)
        .filter((name): name is string => !!name)
        .map((name) => ({
          kind,
          group,
          version,
          plural,
          resource: name,
        }));

      result.push(...resources);
    } catch (err) {
      console.error(`Failed to fetch resources for ${kind}:`, err);
    }
  }

  return result;
}
