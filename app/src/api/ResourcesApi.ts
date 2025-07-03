import type { K8sObject, Provider, Resource } from "@/lib/types";
import type {
  CompositeResourceDefinition,
  KubernetesListResponse,
} from "@/lib/types";

export async function listResources(
  provider: Provider,
  token: string
): Promise<Resource[]> {
  const result: Resource[] = [];

  const xrdRes = await fetch(
    `https://${provider.ip}:${provider.port}/apis/apiextensions.crossplane.io/v1/compositeresourcedefinitions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!xrdRes.ok) {
    throw new Error("Failed to fetch XRDs");
  }

  const xrdData: KubernetesListResponse<CompositeResourceDefinition> =
    await xrdRes.json();

  for (const item of xrdData.items) {
    const kind = item.spec.names.kind;
    const plural = item.spec.names.plural;
    const group = item.spec.group;
    const version = item.spec.versions[0].name;

    try {
      const res = await fetch(
        `https://${provider.ip}:${provider.port}/apis/${group}/${version}/${plural}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) continue;

      const json: KubernetesListResponse<K8sObject> = await res.json();

      const resources = json.items
        .map((i) => i.metadata.name)
        .filter((name): name is string => !!name)
        .map(
          (name): Resource => ({
            kind,
            group,
            version,
            plural,
            resource: name,
          })
        );

      result.push(...resources);
    } catch (err) {
      console.error(`Failed to fetch ${kind}:`, err);
    }
  }

  return result;
}
