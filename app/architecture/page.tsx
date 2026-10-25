import type { Metadata } from "next";
import ArchitectureDiagram from "./ArchitectureDiagram";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "Interactive architecture map of Baclogged based on App Router pages, APIs, models and integrations.",
};

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-[#08090c] px-4 pb-10 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">System map</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Interactive architecture diagram</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
          Built from the current implementation (not the README Mermaid block). Select nodes to inspect concrete files,
          responsibilities, and flow direction across UI, server routes, integrations, database models, and async callbacks.
        </p>

        <div className="mt-8">
          <ArchitectureDiagram />
        </div>
      </div>
    </main>
  );
}
