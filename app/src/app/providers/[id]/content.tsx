"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Program } from "@coral-xyz/anchor";
import idl from "@anchor/target/idl/provider.json";
import type { Provider as ProviderProgram } from "@anchor/target/types/provider";
import { useSolanaNetwork } from "@/components/SolanaNetworkProvider";

export default function Content() {
  const [provider, setProvider] = useState<{
    name: string;
    ip: string;
    port: number;
    country: string;
    environmentType: string;
    availability: boolean;
  } | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const { toast } = useToast();
  const { anchorProvider } = useSolanaNetwork();

  const params = useParams();

  useEffect(() => {
    if (anchorProvider) {
      fetchData();
    }
  }, [anchorProvider]);

  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  if (!id) return;

  const fetchData = async () => {
    setIsProviderLoading(true);

    const program = new Program<ProviderProgram>(idl, anchorProvider);

    program.account.provider
      .fetch(id)
      .then((res) => {
        if (!res) {
          toast({
            title: "Error",
            description: "Provider not found.",
            variant: "destructive",
          });
        }
        setProvider(res);
      })
      .finally(() => {
        setIsProviderLoading(false);
      });
  };

  function formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <>
      {!isProviderLoading && provider ? (
        <div className="flex w-full justify-center">
          <div className="flex flex-col w-full max-w-3xl gap-6">
            <Card className="bg-sidebar">
              <CardContent className="flex items-center justify-between gap-2 pt-6">
                <h2 className="text-xl font-bold tracking-tight">
                  {provider.name}
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
                    {Object.entries(provider).map(([key, value]) => (
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
      ) : (
        <Spinner />
      )}
    </>
  );
}
