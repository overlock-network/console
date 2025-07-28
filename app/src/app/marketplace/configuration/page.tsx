import { Metadata } from "next";
import { Inset } from "@/components/AppSidebar";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "Configuration Collections Marketplace",
  description: "List of available Configuration Collections on marketplace.",
};

export default function ConfigurationsPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full items-center flex-col p-8">
        <Content />
      </div>
    </Inset>
  );
}
