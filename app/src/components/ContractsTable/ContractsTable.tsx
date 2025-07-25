import { useContracts } from "@/chain/client";
import { DataTable } from "../ListTable/DataTable";
import { Contract } from "@/lib/types";
import { ContractInfoColumns } from "../ListTable/ContractInfoColumns";
import { useRouter } from "next/navigation";

export function ContractsTable() {
  const { contracts, loading } = useContracts();
  const router = useRouter();

  return (
    <div className="max-w-[1400px] w-full">
      <DataTable<Contract>
        columns={ContractInfoColumns()}
        data={contracts}
        isLoading={loading}
        onRowClick={(row) =>
          router.push(`/marketplace/gas/collection?id=${row.address}`)
        }
      />
    </div>
  );
}
