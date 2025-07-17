import { Metadata } from "next";
import Content from "./content";
import { Inset } from "@/components/AppSidebar";
import { EnvironmentProvider } from "@/components/EnvironmentProvider";

export const metadata: Metadata = {
  title: "Key Rings Page",
  description: "List of Kubernetes keys.",
};

export default function KeyRingsPage() {
  return (
    <Inset pageTitle={metadata.title as string}>
      <div className="flex h-full items-center flex-col p-8 ">
        <EnvironmentProvider>
          <Content />
        </EnvironmentProvider>
      </div>
    </Inset>
  );
}
