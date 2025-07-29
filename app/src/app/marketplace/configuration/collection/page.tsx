import { Inset } from "@/components/AppSidebar";
import { Content } from "./content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection Configurations",
  description: "List of Collection Configurations.",
};

export default async function CollectionConfigurationsPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full items-center flex-col p-8 relative">
        <Content />
      </div>
    </Inset>
  );
}
