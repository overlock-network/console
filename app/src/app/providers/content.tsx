"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ListTable/DataTable";
import { providerColumns } from "@/components/ListTable/ProviderColumns";
import { Program, ProgramAccount } from "@coral-xyz/anchor";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";
import idl from "@anchor/target/idl/provider.json";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import type { Provider } from "@/lib/types";

export default function Content() {
  const [providers, setProviders] = useState<ProgramAccount<Provider>[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { anchorProvider } = useSolanaNetwork();

  useEffect(() => {
    if (anchorProvider) {
      const program = new Program<ProviderProgram>(idl, anchorProvider);
      setIsLoading(true);
      program.account.provider
        .all()
        .then(setProviders)
        .finally(() => setIsLoading(false));
    }
  }, [anchorProvider]);

  const handleRowClick = async (provider: ProgramAccount<Provider>) => {
    const program = new Program<ProviderProgram>(idl, anchorProvider);
    try {
      const data = await program.account.provider.fetch(provider.publicKey);
      setSelectedProvider(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch provider details.",
        variant: "destructive",
      });
    }
  };

  const formatKey = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  if (isLoading) return <Spinner />;

  return (
    <>
      {!selectedProvider ? (
        <>
          <div className="flex items-end justify-between gap-2 space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Providers</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of available providers!
              </p>
            </div>
          </div>
          <DataTable<ProgramAccount<Provider>>
            columns={providerColumns()}
            data={providers}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </>
      ) : (
        <div className="flex w-full justify-center">
          <div className="flex flex-col w-full max-w-3xl gap-6">
            <Card className="bg-sidebar">
              <CardContent className="flex items-center justify-between gap-2 pt-6">
                <h2 className="text-xl font-bold tracking-tight">
                  {selectedProvider.name}
                </h2>
              </CardContent>
            </Card>
            <Card className="bg-sidebar">
              <CardHeader className="flex flex-row items-center justify-between">
                Details
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(selectedProvider).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium pl-0">
                          {formatKey(key)}
                        </TableCell>
                        <TableCell className="text-right pr-0">
                          {String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
