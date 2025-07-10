import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Plus, XCircle } from "lucide-react";

const EditKeySchema = z.object({
  entries: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    }),
  ),
});

type EditKeyFormData = {
  entries: { key: string; value: string }[];
};

type EditKeyCardProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
  initialData: EditKeyFormData;
  isLoading?: boolean;
};

export function EditKeyCard({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: EditKeyCardProps) {
  const form = useForm<EditKeyFormData>({
    resolver: zodResolver(EditKeySchema),
    defaultValues: {
      entries: initialData.entries ?? [],
    },
  });

  const handleSubmit = async (data: EditKeyFormData) => {
    const result: Record<string, string> = {};
    data.entries.forEach(({ key, value }) => {
      result[key] = value;
    });

    await onSubmit(result);
    form.reset({ entries: data.entries });
  };

  const entries = form.watch("entries") ?? [];

  const addEntry = () => {
    form.setValue("entries", [...entries, { key: "", value: "" }]);
  };

  const removeEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    form.setValue("entries", newEntries);
  };

  if (!open) return null;

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Key</CardTitle>
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {entries.map((_, index) => (
              <div key={index} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`entries.${index}.key`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
