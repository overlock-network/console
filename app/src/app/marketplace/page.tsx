import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "List of available configurations on marketplace.",
};

export default function MarketplacePage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <Content />
      </div>
    </Inset>
  );
}
