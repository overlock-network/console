import { Metadata } from "next";
import { Inset } from "@/components/AppSidebar";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "Gas Collections Marketplace",
  description: "List of available Gas Collections on marketplace.",
};

export default function GasPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full items-center flex-col p-8">
        <Content />
      </div>
    </Inset>
  );
}
