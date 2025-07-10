import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";
import { EnvironmentsProvider } from "@/components/EnvironmentsProvider";

export const metadata: Metadata = {
  title: "Environments",
  description: "List of available environments.",
};

export default function EnvironmentsListPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <EnvironmentsProvider>
          <Content />
        </EnvironmentsProvider>
      </div>
    </Inset>
  );
}
