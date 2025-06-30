import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";

export const metadata: Metadata = {
  title: "Providers",
  description: "List of available providers.",
};

export default function ProvidersListPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full flex-1 flex-col">
        <Content />
      </div>
    </Inset>
  );
}
