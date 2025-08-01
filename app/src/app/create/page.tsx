import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";
import { EnvironmentProvider } from "@/components/EnvironmentProvider";

export const metadata: Metadata = {
  title: "Create Resource",
  description: "Create Resource",
};

export default function CreatePage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full flex-1 flex-col p-8 items-center">
        <EnvironmentProvider>
          <Content />
        </EnvironmentProvider>
      </div>
    </Inset>
  );
}
