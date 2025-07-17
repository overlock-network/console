"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet, useProviders } from "@/chain/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CompositeResourceDefinition } from "@/lib/types";
import { createResource, listXrds } from "@/api/ResourcesApi";
import { ConnectWallet } from "@/components/ConnectWallet";
import validator from "@rjsf/validator-ajv8";
import { IChangeEvent } from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";
import { withTheme } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { useEnvironment } from "@/components/EnvironmentProvider";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";

const Form = withTheme(shadcnTheme);

export default function Content() {
  const { toast } = useToast();
  const { token, selectedEnv, environments } = useEnvironment();

  const [xrds, setXrds] = useState<CompositeResourceDefinition[] | null>(null);
  const [selectedXrd, setSelectedXrd] = useState<CompositeResourceDefinition>();
  const [selectedVersion, setSelectedVersion] = useState<string>();
  const { connected } = useWallet();

  const selectedEnvAccount = environments.find((e) => e.id === selectedEnv);

  const providerId = selectedEnvAccount?.providerId;
  const { provider } = useProviders(providerId);

  const versionSchema = selectedXrd?.spec.versions.find(
    (v) => v.name === selectedVersion,
  )?.schema.openAPIV3Schema as RJSFSchema | undefined;

  const handleSelectXrd = (value: string) => {
    const found = xrds?.find((x) => x.metadata.name === value);
    setSelectedXrd(found);
    setSelectedVersion(undefined);
  };

  const handleSubmit = async (data: IChangeEvent<RJSFSchema>) => {
    if (!selectedXrd || !token || !provider || !data.formData) return;
    try {
      await createResource(provider, token, selectedXrd, data.formData);
      toast({
        title: "Success",
        description: "Resource created successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: `Failed to create resource`,
        variant: "destructive",
      });
    }
  };

  const fetchXrds = useCallback(async () => {
    if (!provider || !token || !selectedEnv) return;
    try {
      const data = await listXrds(provider, token);
      setXrds(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch XRD resources.",
        variant: "destructive",
      });
    }
  }, [provider, token, selectedEnv, toast]);

  useEffect(() => {
    fetchXrds();
  }, [fetchXrds]);

  if (!connected) {
    return <ConnectWallet entitiesName="resources" />;
  }

  return (
    <div className="max-w-[1400px] w-full">
      <Card>
        <CardHeader>
          <CardTitle>Create resource</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-1 gap-5 xl:grid-cols-3">
          <EnvironmentSelector />

          {xrds && xrds.length > 0 && (
            <Select
              value={selectedXrd?.metadata.name ?? ""}
              onValueChange={handleSelectXrd}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select XRD" />
              </SelectTrigger>
              <SelectContent>
                {xrds
                  .filter((x) => !!x.metadata.name)
                  .map((x) => (
                    <SelectItem key={x.metadata.uid} value={x.metadata.name!}>
                      {x.metadata.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}

          {selectedXrd && (
            <Select
              value={selectedVersion ?? ""}
              onValueChange={setSelectedVersion}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {selectedXrd.spec.versions.map((version) => (
                  <SelectItem key={version.name} value={version.name}>
                    {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {versionSchema && (
            <Form
              className="flex flex-col gap-5 sm:col-span-1 xl:col-span-2"
              schema={versionSchema}
              validator={validator}
              uiSchema={{
                spec: {
                  "ui:options": {
                    label: false,
                  },
                },
              }}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
