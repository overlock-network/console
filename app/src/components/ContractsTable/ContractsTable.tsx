import { useContracts } from "@/chain/client";
import { DataTable } from "../ListTable/DataTable";
import { Contract } from "@/lib/types";
import { ContractInfoColumns } from "../ListTable/ContractInfoColumns";

export function ContractsTable({
  onRowClick,
}: {
  onRowClick?: (row: Contract) => void;
}) {
  const { contracts, loading } = useContracts();

  return (
    <div className="max-w-[1400px] w-full">
      <DataTable<Contract>
        columns={ContractInfoColumns()}
        data={contracts}
        isLoading={loading}
        onRowClick={(row) => onRowClick && onRowClick(row)}
      />
    </div>
  );
}
