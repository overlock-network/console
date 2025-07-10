import { useCallback, useState } from "react";
import { listKeys } from "@/api/ResourcesApi";
import { Key, Provider } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { CROSSPLANE_LABEL_SELECTOR, ENV_TOKEN } from "@/lib/utils";

export function useKeyRings(
  provider?: Provider,
  token?: string,
  environmentName?: string,
) {
  const [keyRings, setKeyRings] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchKeyRings = useCallback(async () => {
    if (!provider || !token || !environmentName) return;

    setIsLoading(true);
    try {
      const keys = await listKeys(provider, token, CROSSPLANE_LABEL_SELECTOR);

      const filtered: Key[] = keys
        .filter(
          (
            s,
          ): s is {
            metadata: { name: string; namespace: string };
            data?: Record<string, string>;
          } => !!s.metadata?.name && !!s.metadata?.namespace,
        )
        .map((s) => ({
          name: s.metadata.name,
          environment: environmentName,
          namespace: s.metadata.namespace,
          data: s.data,
        }));

      setKeyRings(filtered);
      sessionStorage.setItem(ENV_TOKEN, token);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [provider, token, environmentName, toast]);

  return {
    keyRings,
    isLoading,
    fetchKeyRings,
  };
}
