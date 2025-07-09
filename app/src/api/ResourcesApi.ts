import type { Provider, Resource } from "@/lib/types";
import type { CompositeResourceDefinition } from "@/lib/types";
import {
  KubernetesObject,
  KubernetesListObject,
} from "@kubernetes/client-node";
import { RJSFSchema } from "@rjsf/utils";

export async function listXrds(
  provider: Provider,
  token: string,
): Promise<CompositeResourceDefinition[]> {
  const xrdRes = await fetch(
    `https://${provider.ip}:${provider.port}/apis/apiextensions.crossplane.io/v1/compositeresourcedefinitions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!xrdRes.ok) {
    throw new Error("Failed to fetch XRDs");
  }

  const xrdData: KubernetesListObject<CompositeResourceDefinition> =
    await xrdRes.json();
  return xrdData.items;
}

export async function listResources(
  provider: Provider,
  token: string,
): Promise<Resource[]> {
  const result: Resource[] = [];

  const xrdData = await listXrds(provider, token);

  for (const item of xrdData) {
    const kind = item.spec.names.kind;
    const plural = item.spec.names.plural;
    const group = item.spec.group;
    const version = item.spec.versions[0]?.name;

    if (!version) continue;

    try {
      const res = await fetch(
        `https://${provider.ip}:${provider.port}/apis/${group}/${version}/${plural}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
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

export async function createResource(
  provider: Provider,
  token: string,
  xrd: CompositeResourceDefinition,
  formData: RJSFSchema,
): Promise<void> {
  const group = xrd.spec.group;
  const version = xrd.spec.versions[0].name;
  const kind = xrd.spec.names.kind;
  const plural = xrd.spec.names.plural;

  const name = formData?.metadata?.name ?? formData?.spec?.name;

  if (!name) throw new Error("Resource name is required");

  const metadata = {
    ...(formData?.metadata || {}),
    name,
  };

  const body = {
    apiVersion: `${group}/${version}`,
    kind,
    metadata,
    ...formData,
  };

  const response = await fetch(
    `https://${provider.ip}:${provider.port}/apis/${group}/${version}/${plural}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
}
