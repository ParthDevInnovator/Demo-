import React from "react";
import ConsoleSidebar from "@/components/ConsoleSidebar";
import ConsoleHeader from "@/components/ConsoleHeader";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/motion/PageTransition";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-on-surface">
        {/* Sidebar is pinned — gets view-transition-name so it stays put */}
        <div style={{ viewTransitionName: "nexus-sidebar" }}>
          <ConsoleSidebar />
        </div>
        <div className="pl-64">
          {/* Header is pinned — gets view-transition-name so it stays put */}
          <div style={{ viewTransitionName: "nexus-header" }}>
            <ConsoleHeader />
          </div>
          <main className="relative pt-16 bg-background w-full px-gutter-lg py-space-lg min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
