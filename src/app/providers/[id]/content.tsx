"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProvider } from "@/api/ProviderApi";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useNetwork } from "@/components/NetworkProvider";
import { ProviderSDKType } from "@overlocknetwork/api/dist/overlock/crossplane/v1beta1/provider";

const EditFormSchema = z.object({
  providerName: z
    .string()
    .regex(
      new RegExp(/^[a-z][a-z0-9-]{0,38}[a-z0-9]$/),
      "The provider name must start with a letter, contain only letters, numbers, and hyphens, end with a letter or number, and be between 2 and 40 characters long.",
    ),
});

export default function Content() {
  const [provider, setProvider] = useState<ProviderSDKType | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const { toast } = useToast();
  const { LCDClient } = useNetwork();

  const params = useParams();

  const form = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: { providerName: "" },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const providerId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  if (!providerId) return;

  const fetchData = async () => {
    setIsProviderLoading(true);
    if (LCDClient) {
      try {
        const provider = await getProvider({
          client: LCDClient,
          id: BigInt(providerId),
        });
        if (!provider) {
          toast({
            title: "Error",
            description: "Provider not found.",
            variant: "destructive",
          });
        } else {
          setProvider(provider);
          form.reset({ providerName: provider.metadata?.name });
        }
      } finally {
        setIsProviderLoading(false);
      }
    }
  };

  return (
    <>
      {!isProviderLoading && provider ? (
        <div className="flex w-full justify-center">
          <div className="flex flex-col w-full max-w-3xl gap-6">
            <Card className="bg-sidebar">
              <CardContent className="flex items-center justify-between gap-2 pt-6">
                <h2 className="text-xl font-bold tracking-tight">
                  {provider.metadata?.name}
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
                    {Object.entries(provider).map(([key, value]) => {
                      if (key != "metadata") {
                        return (
                          <TableRow key={key}>
                            <TableCell className="font-medium pl-0">
                              {key}
                            </TableCell>
                            <TableCell className="text-right pr-0">
                              {String(value)}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
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
