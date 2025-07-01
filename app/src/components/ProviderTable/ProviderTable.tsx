import { DataTable } from "@/components/ListTable/DataTable";
import { providerColumns } from "@/components/ListTable/ProviderColumns";
import type { Provider } from "@/lib/types";
import type { ProgramAccount } from "@coral-xyz/anchor";

interface Props {
  providers: ProgramAccount<Provider>[];
  onSelect: (provider: Provider) => void;
}

export const ProviderTable = ({ providers, onSelect }: Props) => (
  <div className="flex flex-col items-start justify-between gap-2 w-full">
    <h2 className="text-2xl font-bold tracking-tight">Providers</h2>
    <p className="text-muted-foreground">
      Here&apos;s a list of available providers!
    </p>
    <DataTable<ProgramAccount<Provider>>
      columns={providerColumns()}
      data={providers}
      isLoading={false}
      onRowClick={(row) => onSelect(row.account)}
    />
  </div>
);
