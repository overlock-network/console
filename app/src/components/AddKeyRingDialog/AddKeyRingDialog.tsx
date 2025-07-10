"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, XCircle } from "lucide-react";

const AddKeyRingSchema = z.object({
  namespace: z.string().min(1, "Namespace is required"),
  keyName: z.string().min(1, "Key Name is required"),
  entries: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    }),
  ),
});

type AddKeyRingFormData = z.infer<typeof AddKeyRingSchema>;

type AddKeyRingDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddKeyRingFormData) => Promise<void> | void;
  isLoading?: boolean;
};

export function AddKeyRingDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: AddKeyRingDialogProps) {
  const form = useForm<AddKeyRingFormData>({
    resolver: zodResolver(AddKeyRingSchema),
    defaultValues: {
      namespace: "",
      keyName: "",
      entries: [],
    },
  });

  const handleSubmit = async (data: AddKeyRingFormData) => {
    await onSubmit(data);
    form.reset();
  };

  const addEntry = () => {
    const newEntry = { key: "", value: "" };
    form.setValue("entries", [...form.getValues("entries"), newEntry]);
  };

  const removeEntry = (index: number) => {
    const entries = [...form.getValues("entries")];
    entries.splice(index, 1);
    form.setValue("entries", entries);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Key Ring</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="namespace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namespace</FormLabel>
                  <FormControl>
                    <Input placeholder="Namespace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Key Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("entries").map((_, index) => (
              <div key={index} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`entries.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="mb-auto"
                  onClick={() => removeEntry(index)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
