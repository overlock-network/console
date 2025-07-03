"use client";

import { resourceColumns } from "@/components/ListTable/ResourceColumns";
import { DataTable } from "@/components/ListTable/DataTable";
import { useEffect, useState } from "react";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import type { Environment as EnvironmentProgram } from "@anchor/target/types/environment";
import environmentIdl from "@anchor/target/idl/environment.json";
import providerIdl from "@anchor/target/idl/provider.json";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import { Environment, Provider, Resource } from "@/lib/types";
import { ConnectWallet } from "@/components/ConnectWallet";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { listResources } from "@/api/ResourcesApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Content() {
  const [environments, setEnvironments] = useState<
    ProgramAccount<Environment>[]
  >([]);
  const [selectedEnv, setSelectedEnv] = useState<string | undefined>(undefined);
  const [tableData, setTableData] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [environmentProvider, setEnvironmentProvider] = useState<
    Provider | undefined
  >();
  const [token, setToken] = useState("");
  const [tempToken, setTempToken] = useState("");
  const { anchorProvider } = useSolanaNetwork();
  const { toast } = useToast();

  useEffect(() => {
    if (!anchorProvider) return;

    const environmentProgram = new Program<EnvironmentProgram>(
      environmentIdl,
      anchorProvider,
    );

    environmentProgram.account.environment
      .all()
      .then((envs) => {
        setEnvironments(envs);
      })
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to fetch environments.",
          variant: "destructive",
        }),
      );
  }, [anchorProvider]);

  useEffect(() => {
    setIsLoading(false);
    if (!selectedEnv || !anchorProvider) {
      setTableData([]);
      return;
    }

    setIsLoading(true);

    const providerProgram = new Program<ProviderProgram>(
      providerIdl,
      anchorProvider,
    );

    const env = environments.find(
      (e) => e.publicKey.toBase58() === selectedEnv,
    );
    if (!env) {
      setTableData([]);
      setIsLoading(false);
      return;
    }

    const providerPubkey = env.account.provider;

    providerProgram.account.provider
      .fetch(providerPubkey)
      .then(setEnvironmentProvider);
  }, [selectedEnv, anchorProvider, environments]);

  useEffect(() => {
    if (environmentProvider && token.length) {
      setIsLoading(true);
      listResources(environmentProvider, token)
        .then(setTableData)
        .catch(() =>
          toast({
            title: "Error",
            description: "Failed to fetch resources.",
            variant: "destructive",
          }),
        )
        .finally(() => setIsLoading(false));
    }
  }, [environmentProvider, token]);

  if (!anchorProvider) {
    return <ConnectWallet entitiesName="resources" />;
  }

  return (
    <>
      <div className="max-w-[1400px] w-full">
        <div className="flex items-end justify-between gap-2 mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Resources
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of available resources!
            </p>
          </div>
          <Select
            value={selectedEnv ?? ""}
            onValueChange={(value) => {
              setSelectedEnv(value);
              setDialogOpen(true);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {environments.map((env) => (
                <SelectItem
                  key={env.publicKey.toBase58()}
                  value={env.publicKey.toBase58()}
                >
                  {env.account.name ?? env.publicKey.toBase58()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable<Resource>
          columns={resourceColumns()}
          data={tableData}
          isLoading={isLoading}
        />
      </div>
      <Dialog open={dialogOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Set Kubernetes Token</DialogTitle>
          </DialogHeader>
          <p
            id="token-dialog-description"
            className="text-sm text-muted-foreground mb-2"
          >
            Paste your Kubernetes Bearer token to access cluster resources.
          </p>
          <Input
            type="text"
            placeholder="Enter Bearer token..."
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={() => {
                setToken(tempToken);
                setDialogOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
