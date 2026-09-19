"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import NexusLogo from "@/components/NexusLogo";

// ─── Seed Credentials ────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    email: "alex.chen@enterprise.io",
    password: "Nexus@2025!",
    name: "Alex Chen",
    role: "Principal SRE",
    org: "Acme Enterprise",
  },
  {
    email: "admin@nexus.cloud",
    password: "admin1234",
    name: "NEXUS Admin",
    role: "Platform Admin",
    org: "NEXUS Cloud Systems",
  },
];

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));

    const user = SEED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      // Store session in localStorage for demo
      localStorage.setItem("nexus_user", JSON.stringify(user));
      router.push(nextPath);
    } else {
      setError("Invalid email or password. Use the seed credentials below.");
      setLoading(false);
    }
  };

  const fillSeedUser = (user: typeof SEED_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(75,127,239,0.12) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(61,214,140,0.05) 0%, transparent 55%), #070A0D",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* Ambient orbs */}
      <div
        className="absolute w-[600px] h-[600px] top-[-200px] left-[-100px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(75,127,239,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-50px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(61,214,140,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo + Back to Landing */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <NexusLogo className="h-7 w-auto" />
            <span
              className="text-sm font-bold tracking-tight text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              NEXUS
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "#6B7585" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F0F4FF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#6B7585")}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to home
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#0D1117",
            border: "1px solid rgba(30,38,48,0.9)",
            boxShadow: "0 0 0 1px rgba(75,127,239,0.05), 0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Card Header */}
          <div
            className="px-8 pt-8 pb-6"
            style={{ borderBottom: "1px solid rgba(30,38,48,0.8)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#3DD68C",
                  boxShadow: "0 0 0 3px rgba(61,214,140,0.15)",
                  animation: "pulse-green 2s ease-in-out infinite",
                }}
              />
              <span className="text-[11px] font-mono" style={{ color: "#3DD68C" }}>
                Control Plane · prod-cluster-us-east
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "#9BA5B4" }}>
              Sign in to your NEXUS control plane dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#6B7585" }}>
                Email address
              </label>
              <div
                className="relative rounded-xl overflow-hidden transition-all"
                style={{
                  border: focusedField === "email"
                    ? "1px solid rgba(75,127,239,0.5)"
                    : error
                    ? "1px solid rgba(224,92,92,0.4)"
                    : "1px solid rgba(30,38,48,0.9)",
                  boxShadow: focusedField === "email" ? "0 0 0 3px rgba(75,127,239,0.08)" : "none",
                }}
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@company.io"
                  required
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-[#4B5568] bg-transparent focus:outline-none font-mono"
                  style={{ background: "#070A0D" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#6B7585" }}>
                Password
              </label>
              <div
                className="relative rounded-xl overflow-hidden transition-all"
                style={{
                  border: focusedField === "password"
                    ? "1px solid rgba(75,127,239,0.5)"
                    : error
                    ? "1px solid rgba(224,92,92,0.4)"
                    : "1px solid rgba(30,38,48,0.9)",
                  boxShadow: focusedField === "password" ? "0 0 0 3px rgba(75,127,239,0.08)" : "none",
                }}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-[#4B5568] bg-transparent focus:outline-none font-mono"
                  style={{ background: "#070A0D" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6B7585" }}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 p-3 rounded-xl text-xs"
                style={{
                  background: "rgba(224,92,92,0.08)",
                  border: "1px solid rgba(224,92,92,0.2)",
                  color: "#E05C5C",
                }}
              >
                <span className="material-symbols-outlined text-base shrink-0 mt-px">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(75,127,239,0.5)"
                  : "linear-gradient(135deg, #4B7FEF 0%, #3560BE 100%)",
                boxShadow: loading ? "none" : "0 2px 20px rgba(75,127,239,0.35)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating…
                </>
              ) : (
                <>
                  Sign in to NEXUS
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Seed Credentials Panel */}
          <div
            className="mx-8 mb-8 rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(75,127,239,0.15)" }}
          >
            <div
              className="px-4 py-2.5 flex items-center gap-2"
              style={{ background: "rgba(75,127,239,0.08)", borderBottom: "1px solid rgba(75,127,239,0.1)" }}
            >
              <span className="material-symbols-outlined text-sm" style={{ color: "#6B9AF8" }}>
                key
              </span>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider" style={{ color: "#6B9AF8" }}>
                Demo Credentials — click to fill
              </span>
            </div>
            <div className="flex flex-col divide-y" style={{ divideColor: "rgba(30,38,48,0.8)" }}>
              {SEED_USERS.map((user, i) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => fillSeedUser(user)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors group"
                  style={{ background: "#070A0D" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0D1117")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#070A0D")}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                      style={{
                        background: i === 0
                          ? "linear-gradient(135deg, #4B7FEF, #3560BE)"
                          : "linear-gradient(135deg, #28A866, #1D7A4A)",
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                      <div className="text-[10px] font-mono truncate" style={{ color: "#6B7585" }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-0.5">
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background: i === 0 ? "rgba(75,127,239,0.1)" : "rgba(61,214,140,0.1)",
                        border: i === 0 ? "1px solid rgba(75,127,239,0.2)" : "1px solid rgba(61,214,140,0.2)",
                        color: i === 0 ? "#6B9AF8" : "#3DD68C",
                      }}
                    >
                      {user.role}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: "#4B5568" }}>
                      pw: {user.password}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] font-mono mt-6" style={{ color: "#4B5568" }}>
          This is a demonstration environment. No real authentication is performed.
        </p>
      </div>
    </div>
  );
}

// Suspense boundary required for useSearchParams in Next.js App Router
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#070A0D" }}>
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid rgba(75,127,239,0.2)", borderTopColor: "#4B7FEF" }} />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
