import React from "react";
import { Inset } from "@/components/AppSidebar";
import { BrainCog, Rocket, ScanSearch } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <Inset>
      <div className="flex h-full items-center flex-col p-8">
        <div className="w-full max-w-[1400px]">
          <div className="text-xl font-bold mb-5">
            Welcome to Overlock Console!
          </div>
          <div className="flex flex-col">
            <Link
              href="https://docs.overlock.network/#getting-started"
              className="mb-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-secondary min-w-12 w-12 h-12 text-primary">
                  <Rocket />
                </div>
                <div>
                  <p className="text-base font-bold">
                    Getting started with Overlock Console
                  </p>
                  <p className="text-sm">
                    Learn how to deploy your first control plane in a few clicks
                    using Console
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/marketplace" className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-secondary min-w-12 w-12 h-12 text-primary">
                  <ScanSearch />
                </div>
                <div>
                  <p className="text-base font-bold">Explore the marketplace</p>
                  <p className="text-sm">
                    Browse through the marketplace of pre-made solutions with
                    categories like blogs, blockchain nodes and more!
                  </p>
                </div>
              </div>
            </Link>
            <Link href="https://docs.overlock.network/" className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-secondary min-w-12 w-12 h-12 text-primary">
                  <BrainCog />
                </div>
                <div>
                  <p className="text-base font-bold">
                    Learn more about Overlock
                  </p>
                  <p className="text-sm">
                    Want to know about the advantages of using a decentralized
                    control planes marketplace?
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Inset>
  );
}
