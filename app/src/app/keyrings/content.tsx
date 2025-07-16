"use client";

import { createKey, removeKey, updateKeyData } from "@/api/ResourcesApi";
import { DataTable } from "@/components/ListTable/DataTable";
import { keyColumns } from "@/components/ListTable/KeyColumns";
import { useWallet, useEnvironments, useProviders } from "@/chain/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TokenDialog } from "@/components/TokenDialog";
import { CROSSPLANE_LABELS, ENV_TOKEN } from "@/lib/utils";
import { AddKeyRingDialog } from "@/components/AddKeyRingDialog/AddKeyRingDialog";
import { EditKeyCard } from "@/components/EditKeyCard";
import { useSessionToken } from "@/hooks/use-session-token";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useKeyRings } from "@/hooks/use-key-rings";

export default function Content() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { connected } = useWallet();
  const { toast } = useToast();
  const [selectedEnv, setSelectedEnv] = useState<string>();
  const { token } = useSessionToken(ENV_TOKEN);
  const [keyToEdit, setKeyToEdit] = useState<Key>();
  const { environments } = useEnvironments();

  const selectedEnvironment = environments.find((e) => e.id == selectedEnv);
  const providerKey = selectedEnvironment?.providerId;
  const { provider: environmentProvider } = useProviders(providerKey);

  const { keyRings, fetchKeyRings, isLoading } = useKeyRings(
    environmentProvider,
    token,
    selectedEnvironment?.name,
  );

  useEffect(() => {
    if (!environmentProvider || !token) return;
    fetchKeyRings();
  }, [environmentProvider, token, selectedEnv, environments]);

  const handleAddKey = async (data: {
    namespace: string;
    keyName: string;
    entries: { key: string; value: string }[];
  }) => {
    if (!selectedEnv || !environmentProvider || !token) return;

    try {
      const keyData = Object.fromEntries(
        data.entries.map(({ key, value }) => [key, value]),
      );

      await createKey(
        environmentProvider,
        token,
        data.namespace,
        data.keyName,
        keyData,
        CROSSPLANE_LABELS,
      );

      toast({
        title: "Success",
        description: "Key Ring created successfully.",
      });

      setAddDialogOpen(false);
      await fetchKeyRings();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create Key Ring.",
        variant: "destructive",
      });
    } finally {
    }
  };

  const handleEditKey = async (data: Record<string, string>) => {
    if (!environmentProvider || !token || !keyToEdit) return;
    try {
      await updateKeyData(environmentProvider, token, keyToEdit, data);
      toast({
        title: "Success",
        description: "Key updated successfully.",
      });
      await fetchKeyRings();
      setKeyToEdit(undefined);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update key.",
        variant: "destructive",
      });
    } finally {
    }
  };

  const handleDeleteKey = async (row: Key) => {
    if (!environmentProvider || !token) return;
    try {
      await removeKey(environmentProvider, token, row.namespace, row.name);
      toast({
        title: "Success",
        description: `Key Ring "${row.name}" deleted successfully.`,
      });
      await fetchKeyRings();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete Key Ring.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (key: Key) => setKeyToEdit(key);

  if (!connected) {
    return <ConnectWallet entitiesName="resources" />;
  }

  return (
    <>
      <div className="max-w-[1400px] w-full">
        {keyToEdit ? (
          <EditKeyCard
            open={true}
            onClose={() => setKeyToEdit(undefined)}
            initialData={{
              entries: keyToEdit.data
                ? Object.entries(keyToEdit.data).map(([key, value]) => ({
                    key,
                    value: atob(value),
                  }))
                : [],
            }}
            onSubmit={handleEditKey}
            isLoading={isLoading}
          />
        ) : (
          <>
            <div className="flex items-end gap-2 mb-10">
              <div className="mr-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Key Rings
                </h2>
                <p className="text-muted-foreground">
                  Here&apos;s a list of available Key Rings!
                </p>
              </div>
              <Select value={selectedEnv ?? ""} onValueChange={setSelectedEnv}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments.length > 0 ? (
                    environments.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name ?? env.id}
                      </SelectItem>
                    ))
                  ) : (
                    <span className="text-xs pl-2">environments not found</span>
                  )}
                </SelectContent>
              </Select>
              {selectedEnv && (
                <Button className="mt-5" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              )}
            </div>

            <DataTable<Key>
              columns={keyColumns([
                {
                  label: "Delete",
                  onClick: handleDeleteKey,
                },
              ])}
              data={keyRings}
              isLoading={isLoading}
              onRowClick={handleRowClick}
            />
          </>
        )}
      </div>

      <TokenDialog />

      <AddKeyRingDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddKey}
        isLoading={isLoading}
      />
    </>
  );
}
