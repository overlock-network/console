"use client";

import { useEffect, useState, useCallback } from "react";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CompositeResourceDefinition,
  Environment,
  Provider,
} from "@/lib/types";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import idl from "@anchor/target/idl/environment.json";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import providerIdl from "@anchor/target/idl/provider.json";
import { createResource, listXrds } from "@/api/ResourcesApi";
import { TokenDialog } from "@/components/TokenDialog";
import { ConnectWallet } from "@/components/ConnectWallet";
import validator from "@rjsf/validator-ajv8";
import { IChangeEvent } from "@rjsf/core";
import { Theme as shadcnTheme } from "@rjsf/shadcn";
import { withTheme } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { ENV_TOKEN } from "@/lib/utils";

const Form = withTheme(shadcnTheme);

export default function Content() {
  const { anchorProvider } = useSolanaNetwork();
  const { toast } = useToast();

  const [selectedEnv, setSelectedEnv] = useState<string>();
  const [environments, setEnvironments] = useState<
    ProgramAccount<Environment>[]
  >([]);
  const [environmentProvider, setEnvironmentProvider] = useState<Provider>();
  const [xrds, setXrds] = useState<CompositeResourceDefinition[] | null>(null);
  const [selectedXrd, setSelectedXrd] = useState<CompositeResourceDefinition>();
  const [selectedVersion, setSelectedVersion] = useState<string>();
  const [token, setToken] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ENV_TOKEN);
    if (stored) {
      setToken(stored);
    }
  }, []);

  const handleSubmit = async (data: IChangeEvent<RJSFSchema>) => {
    const formData = data.formData;
    if (!selectedXrd || !token || !environmentProvider || !formData) return;

    try {
      await createResource(environmentProvider, token, selectedXrd, formData);
      toast({
        title: "Success",
        description: "Resource created successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to create resource: ${err}`,
        variant: "destructive",
      });
    }
  };

  const fetchEnvironments = useCallback(async () => {
    if (!anchorProvider) return;
    try {
      const program = new Program<EnvironmentProgram>(idl, anchorProvider);
      const envs = await program.account.environment.all();
      setEnvironments(envs);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch environments.",
        variant: "destructive",
      });
    }
  }, [anchorProvider, toast]);

  const fetchEnvironmentProvider = useCallback(async () => {
    if (!anchorProvider || !selectedEnv) return;

    const env = environments.find(
      (e) => e.publicKey.toBase58() === selectedEnv,
    );
    if (!env) return setXrds(null);

    try {
      const program = new Program<ProviderProgram>(providerIdl, anchorProvider);
      const provider = await program.account.provider.fetch(
        env.account.provider,
      );
      setEnvironmentProvider(provider);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch environment provider.",
        variant: "destructive",
      });
    }
  }, [anchorProvider, selectedEnv, environments, toast]);

  const fetchXrds = useCallback(async () => {
    if (!environmentProvider || !token) return;
    try {
      const data = await listXrds(environmentProvider, token);
      setXrds(data);
      sessionStorage.setItem("k8s_token", token);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch xrd resources.",
        variant: "destructive",
      });
    }
  }, [environmentProvider, token, toast]);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  useEffect(() => {
    fetchEnvironmentProvider();
  }, [fetchEnvironmentProvider]);

  useEffect(() => {
    fetchXrds();
  }, [fetchXrds]);

  const handleSelectEnvironment = (value: string) => {
    setSelectedEnv(value);
    setSelectedXrd(undefined);
    setSelectedVersion(undefined);
    if (!token) setDialogOpen(true);
  };

  const handleSelectXrd = (value: string) => {
    const found = xrds?.find((x) => x.metadata.name === value);
    setSelectedXrd(found);
    setSelectedVersion(undefined);
  };

  const versionSchema = selectedXrd?.spec.versions.find(
    (v) => v.name === selectedVersion,
  )?.schema.openAPIV3Schema;

  if (!anchorProvider) {
    return <ConnectWallet entitiesName="resources" />;
  }

  return (
    <div className="max-w-[1400px] w-full">
      <Card>
        <CardHeader>
          <CardTitle>Create resource</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-1 gap-5 xl:grid-cols-3">
          <Select
            value={selectedEnv ?? ""}
            onValueChange={handleSelectEnvironment}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {environments.length > 0 ? (
                environments.map((env) => (
                  <SelectItem
                    key={env.publicKey.toBase58()}
                    value={env.publicKey.toBase58()}
                  >
                    {env.account.name ?? env.publicKey.toBase58()}
                  </SelectItem>
                ))
              ) : (
                <span className="text-xs pl-2">environments not found</span>
              )}
            </SelectContent>
          </Select>

          {selectedEnv && (
            <Select
              value={selectedXrd?.metadata.name ?? ""}
              onValueChange={handleSelectXrd}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select XRD" />
              </SelectTrigger>
              <SelectContent>
                {xrds?.length ? (
                  xrds
                    .filter((x) => !!x.metadata.name)
                    .map((x) => (
                      <SelectItem key={x.metadata.uid} value={x.metadata.name!}>
                        {x.metadata.name}
                      </SelectItem>
                    ))
                ) : (
                  <span className="text-xs pl-2">xrds not found</span>
                )}
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
              className="flex flex-col gap-5"
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

      <TokenDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        token={token}
        setToken={setToken}
      />
    </div>
  );
}
