import { Inset } from "@/components/AppSidebar";
import { Content } from "./content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gas Collection NFT",
  description: "List of Collection NFT.",
};

export default async function GasCollectionPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full items-center flex-col p-8">
        <Content />
      </div>
    </Inset>
  );
}
