"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNft, useWallet, useWalletModal } from "@/chain/client";

const MintConfigurationSchema = z.object({
  name: z.string().min(2),
  crossplaneVersion: z.string().min(2),
  configurationImage: z.string().min(2),
});

type MintForm = z.infer<typeof MintConfigurationSchema>;

export function MintConfigurationDialog({
  contractId,
}: {
  contractId: string;
}) {
  const form = useForm<MintForm>({
    resolver: zodResolver(MintConfigurationSchema),
    defaultValues: { name: "", crossplaneVersion: "", configurationImage: "" },
  });
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { mintNft } = useNft<MintForm>();

  const onSubmit = async () => {
    const tokenId = crypto.randomUUID();

    await mintNft({ contractAddress: contractId, tokenId });
    form.reset();
  };

  return (
    <>
      {connected ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Mint <CirclePlus className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Mint configuration</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-xl mx-auto w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crossplaneVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crossplane Version</FormLabel>
                      <FormControl>
                        <Input placeholder="Crossplane Version" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="configurationImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration Image</FormLabel>
                      <FormControl>
                        <Input placeholder="Configuration Image" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  type="submit"
                  disabled={!form.formState.isDirty}
                >
                  Save
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={() => setVisible(true)}>
          Mint <CirclePlus className="ml-2 h-4 w-4" />
        </Button>
      )}
    </>
  );
}
