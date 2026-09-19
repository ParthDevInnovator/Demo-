import React from "react";
import ConsoleSidebar from "@/components/ConsoleSidebar";
import ConsoleHeader from "@/components/ConsoleHeader";
import AuthGuard from "@/components/AuthGuard";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-on-surface">
        <ConsoleSidebar />
        <div className="pl-64">
          <ConsoleHeader />
          <main className="relative pt-16 bg-background w-full px-gutter-lg py-space-lg min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
