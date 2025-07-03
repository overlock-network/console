import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";

export const metadata: Metadata = {
  title: "Resources",
  description: "List of available resources.",
};

export default function ResourcesListPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full flex-1 flex-col p-8 items-center">
        <Content />
      </div>
    </Inset>
  );
}
