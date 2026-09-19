"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * AuthGuard — wraps any layout/page that requires authentication.
 * Checks localStorage for a valid `nexus_user` session.
 * If none exists, redirects immediately to /signin.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("nexus_user");
    if (!user) {
      // Not authenticated — send to sign in, preserving the intended destination
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // While checking, render a full-screen splash so there's no flash of protected content
  if (!authorized) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{
          background: "#070A0D",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Animated spinner */}
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "2px solid rgba(75,127,239,0.15)",
              borderTopColor: "#4B7FEF",
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: "#4B7FEF" }}
          >
            NEXUS
          </span>
          <span className="text-[11px] font-mono" style={{ color: "#4B5568" }}>
            Verifying session…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
