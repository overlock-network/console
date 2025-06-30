import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/types";

interface Props {
  provider: Provider;
  onBack: () => void;
}

export const ProviderDetails = ({ provider, onBack }: Props) => {
  const formatKey = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full max-w-3xl gap-6">
        <Card className="bg-sidebar">
          <CardContent className="flex items-center justify-between gap-2 pt-6">
            <h2 className="text-xl font-bold tracking-tight">
              {provider.name}
            </h2>
            <Button onClick={onBack}>Back</Button>
          </CardContent>
        </Card>
        <Card className="bg-sidebar">
          <CardHeader>Details</CardHeader>
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
  );
};
