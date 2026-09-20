"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NexusLogo from "@/components/NexusLogo";
import ThreeTopology from "@/components/ThreeTopology";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { useCountUp } from "@/components/motion/useCountUp";

// ── Metric Counter component ─────────────────────────────────────────────────
function AnimatedMetric({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1400,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const { ref, formatted } = useCountUp({ target, suffix, prefix, decimals, duration });
  return <span ref={ref as React.Ref<HTMLSpanElement>}>{formatted}</span>;
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,38,48,0.8)' }}>
      <div
        className="h-full rounded-full"
        style={{
          width: started ? `${pct}%` : '0%',
          background: `linear-gradient(90deg, ${color}77, ${color})`,
          transition: started ? 'width 0.9s cubic-bezier(0.22,1,0.36,1)' : 'none',
        }}
      />
    </div>
  );
}

// ── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div ref={barRef} className="scroll-progress-bar" />;
}

// ── Hero scroll parallax hook ─────────────────────────────────────────────────
function useHeroScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrollY;
}

// ── Deployment pipeline animation ────────────────────────────────────────────
const PIPELINE_STEPS = [
  { step: "1. Build", desc: "Cached Docker layer", status: "✓" },
  { step: "2. Tests", desc: "142 QA suites passed", status: "✓" },
  { step: "3. Security", desc: "0 CVEs detected", status: "✓" },
  { step: "4. Canary", desc: "10% traffic verified", status: "✓" },
  { step: "5. Production", desc: "12 regions live", status: "✓", active: true },
];

function DeploymentPipeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        // Sequentially activate each step
        PIPELINE_STEPS.forEach((_, i) => {
          setTimeout(() => setActiveStep(i), i * 420);
        });
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
      {PIPELINE_STEPS.map((item, i) => (
        <div
          key={item.step}
          className={`pipeline-step p-4 rounded-xl flex flex-col gap-2${activeStep >= i ? ' is-active' : ''}`}
          style={{
            background: item.active && activeStep >= i
              ? 'linear-gradient(145deg, #111B2E 0%, #0D1520 100%)'
              : activeStep >= i ? '#0D1117' : 'rgba(13,17,23,0.4)',
            border: item.active && activeStep >= i
              ? '1px solid rgba(75,127,239,0.3)'
              : activeStep >= i ? '1px solid rgba(30,38,48,0.8)' : '1px solid rgba(30,38,48,0.4)',
            boxShadow: item.active && activeStep >= i ? '0 0 20px rgba(75,127,239,0.08)' : 'none',
            opacity: activeStep >= i ? 1 : 0.35,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-white">{item.step}</span>
            <span style={{ color: activeStep >= i ? '#3DD68C' : '#4B5568' }}>
              {activeStep >= i ? item.status : '○'}
            </span>
          </div>
          <span className="text-[10px] text-[#6B7585]">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}

export default function PlatformOverviewPage() {
  const [activeConsoleTab, setActiveConsoleTab] = useState("Overview");
  const [activeTelemetryTab, setActiveTelemetryTab] = useState("Metrics");
  const heroScrollY = useHeroScrollParallax();
  // topology scroll progress (0-1 over first ~600px)
  const topoScrollProgress = Math.min(heroScrollY / 600, 1);

  // Hero exit parallax — subtle scale+opacity+blur as user scrolls
  const heroExitScale = 1 - Math.min(heroScrollY / 1200, 0.04);
  const heroExitOpacity = 1 - Math.min(heroScrollY / 800, 0.35);
  const heroExitBlur = Math.min(heroScrollY / 400, 1.5);

  return (
    <div className="bg-[#070A0D] text-[#F0F4FF] antialiased min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Scroll progress indicator */}
      <ScrollProgressBar />
      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: 'rgba(7,10,13,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
        <div className="h-14 w-full px-6 flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <NexusLogo className="h-6 w-auto object-contain" />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-sm font-bold tracking-tight text-white">
                NEXUS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(75,127,239,0.12)', border: '1px solid rgba(75,127,239,0.2)', color: '#6B9AF8' }}>
                v4.1
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-xs">
              {["Platform", "Compute", "Observability", "Deployments", "Security"].map((item, i) => (
                <Link
                  key={item}
                  href={i === 0 ? "/" : `/${item.toLowerCase()}`}
                  className={`transition-colors ${i === 0 ? "text-white font-medium" : "text-[#6B7585] hover:text-[#F0F4FF]"}`}
                >
                  {item}
                </Link>
              ))}
              <a href="#pricing" className="text-[#6B7585] hover:text-[#F0F4FF] transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/signin" className="text-[#6B7585] hover:text-[#F0F4FF] px-3 py-1.5 rounded-md hover:bg-[#131920] transition-colors">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center font-semibold px-4 py-1.5 rounded-lg text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #4B7FEF 0%, #3560BE 100%)', boxShadow: '0 1px 12px rgba(75,127,239,0.3)' }}
            >
              Start building →
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-14">
        {/* SECTION 1: HERO */}
        <section
          className="relative w-full overflow-hidden px-6 pb-20 pt-12"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% -5%, rgba(75,127,239,0.15) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 85% 60%, rgba(61,214,140,0.06) 0%, transparent 60%), #070A0D',
            transform: `scale(${heroExitScale})`,
            opacity: heroExitOpacity,
            filter: `blur(${heroExitBlur}px)`,
            transformOrigin: 'center top',
            willChange: 'transform, opacity, filter',
          }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

          <div className="relative mx-auto max-w-7xl flex flex-col gap-10">
            {/* Status bar */}
            <div className="hero-enter hero-delay-0 mx-auto w-full max-w-3xl rounded-xl overflow-hidden" style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(30,38,48,0.9)', backdropFilter: 'blur(10px)' }}>
              <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(30,38,48,0.8)' }}>
                <div className="flex items-center gap-2">
                  <span className="dot-live" />
                  <span className="text-xs font-mono text-[#F0F4FF] font-medium">NEXUS</span>
                  <span className="text-[11px] font-mono text-[#6B7585]">Control plane initializing</span>
                </div>
                <span className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: '#3DD68C' }}>
                  ✓ All systems operational
                </span>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7585]">Regions connected</span>
                  <span className="text-[#F0F4FF]">Mumbai ✓ &nbsp;Singapore ✓ &nbsp;Frankfurt ✓ &nbsp;Virginia ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7585]">Services online</span>
                  <span className="text-[#F0F4FF]">API Gateway ✓ &nbsp;Database ✓ &nbsp;Redis ✓ &nbsp;CDN ✓</span>
                </div>
              </div>
            </div>

            {/* Hero: Left + Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left: Headline, CTA */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="hero-enter hero-delay-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit" style={{ background: 'rgba(75,127,239,0.1)', border: '1px solid rgba(75,127,239,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4B7FEF]" />
                  <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#6B9AF8' }}>
                    Zero-Trust Control Plane · v4.1
                  </span>
                </div>

                <h1 className="hero-enter hero-delay-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '3.2rem', lineHeight: '1.08', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
                  Your infrastructure.{" "}
                  <span className="text-gradient-blue">One control plane.</span>
                </h1>

                <p className="hero-enter hero-delay-3 text-[#9BA5B4] text-base leading-relaxed">
                  Deploy, monitor, secure, and scale your entire distributed cloud fabric from one
                  unified command workspace — with zero operational drag.
                </p>

                <div className="hero-enter hero-delay-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="btn-nexus-primary inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #4B7FEF 0%, #3560BE 100%)', boxShadow: '0 2px 20px rgba(75,127,239,0.35)' }}
                  >
                    Start building
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                  <Link
                    href="/compute"
                    className="btn-nexus-outline inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-lg text-[#F0F4FF] text-sm hover:bg-[#131920]"
                    style={{ border: '1px solid rgba(30,38,48,0.9)' }}
                  >
                    View live demo
                    <span className="material-symbols-outlined text-base">play_circle</span>
                  </Link>
                </div>

                {/* KPIs */}
                <div className="hero-enter hero-delay-5 grid grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
                  {[
                    { val: "99.999%", label: "Guaranteed SLA" },
                    { val: "12 Regions", label: "Active Fabric" },
                    { val: "14.2ms", label: "p99 Edge Latency" },
                  ].map((kpi) => (
                    <div key={kpi.val} className="flex flex-col gap-0.5">
                      <span className="text-lg font-bold text-white font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpi.val}</span>
                      <span className="text-[11px] text-[#6B7585]">{kpi.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: 3D Topology */}
              <div className="hero-enter-scale hero-delay-2 lg:col-span-7 relative w-full h-[520px] rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)', boxShadow: '0 0 0 1px rgba(75,127,239,0.05), 0 24px 80px rgba(0,0,0,0.6)' }}>
                <ThreeTopology scrollProgress={topoScrollProgress} />

                {/* HUD overlays */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {[
                    { label: "KUBERNETES", sub: "Primary Shard" },
                    { label: "POSTGRES", sub: "HA Synchronized" },
                  ].map((item) => (
                    <div key={item.label} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(7,10,13,0.85)', border: '1px solid rgba(30,38,48,0.9)', backdropFilter: 'blur(8px)' }}>
                      <span className="dot-live" />
                      <span className="text-[11px] font-mono text-[#F0F4FF] font-medium">{item.label}</span>
                      <span className="text-[11px] font-mono text-[#6B7585]">{item.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(7,10,13,0.85)', border: '1px solid rgba(30,38,48,0.9)', backdropFilter: 'blur(8px)' }}>
                  <span className="text-[11px] font-mono text-[#6B7585]">1,024 nodes synchronized</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: '#3DD68C' }}>● Live</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST TICKER */}
        <section className="w-full py-6" style={{ background: '#0D1117', borderTop: '1px solid rgba(30,38,48,0.6)', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <ScrollReveal direction="left" className="text-[11px] font-mono uppercase tracking-widest text-[#6B7585]" as="span">
              Trusted by frontier infrastructure teams
            </ScrollReveal>
            <ScrollReveal direction="right" className="flex flex-wrap items-center gap-8 font-mono text-xs">
              {["CYBERDYNE", "AETHER CLOUD", "HYPERION", "SYNAPSE IO", "CHRONOS", "VORTEX"].map((brand, i) => (
                <span key={brand} className={`${i % 2 === 0 ? "font-bold text-[#F0F4FF]" : "text-[#4B5568]"}`}>{brand}</span>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 3: PRODUCT CONSOLE PREVIEW */}
        <section className="w-full py-20" style={{ background: '#070A0D', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <ScrollReveal direction="left" className="flex flex-col gap-2 max-w-xl">
                <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#4B7FEF' }}>
                  Unified Operational Layer
                </span>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-white">
                  One platform. Every layer.
                </h2>
                <p className="text-sm text-[#9BA5B4] leading-relaxed">
                  From cluster hypervisors to edge proxy gateways, coordinate zero-trust workloads
                  without juggling disparate provider dashboards.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="right" className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#6B7585]">Active Plane:</span>
                <span className="text-[#F0F4FF] font-medium">global-west-edge.nexus.internal</span>
              </ScrollReveal>
            </div>

            {/* Console Mockup */}
            <ScrollReveal direction="up" threshold={0.05}>
            <div className="w-full rounded-2xl overflow-hidden flex flex-col" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(75,127,239,0.04)' }}>
              {/* Window Chrome */}
              <div className="h-11 px-4 flex items-center justify-between" style={{ background: '#131920', borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#E05C5C]" />
                  <span className="h-3 w-3 rounded-full bg-[#E8AC3B]" />
                  <span className="h-3 w-3 rounded-full bg-[#3DD68C]" />
                  <span className="ml-3 text-[11px] font-mono text-[#4B5568] hidden sm:inline-block">
                    https://console.nexus.cloud/clusters/prod-global-01
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7585] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#3DD68C]" />
                  <span>Connected (TLS 1.3)</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 flex items-center gap-1 overflow-x-auto" style={{ background: '#0D1117', borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
                {["Overview", "Compute", "Deployments", "Observability", "Security"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveConsoleTab(tab)}
                    className={`px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap ${
                      activeConsoleTab === tab
                        ? "text-white border-b-2 border-[#4B7FEF]"
                        : "text-[#6B7585] hover:text-[#F0F4FF]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 bg-[#070A0D] grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "P99 LATENCY", val: "14.2 ms", delta: "−4.1%", color: "#4B7FEF", bar: "75%" },
                      { label: "GLOBAL REQUEST RATE", val: "24,190 /s", delta: "+12.8%", color: "#3DD68C", bar: "80%" },
                      { label: "ACTIVE CLUSTERS", val: "48 / 48", delta: "100% HEALTH", color: "#3DD68C", bar: "100%" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl flex flex-col gap-2" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                        <span className="text-[10px] font-mono text-[#6B7585] uppercase tracking-wider">{stat.label}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-bold text-white font-mono">{stat.val}</span>
                          <span className="text-xs font-mono font-semibold" style={{ color: stat.color }}>{stat.delta}</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(30,38,48,0.8)' }}>
                          <div className="h-full rounded-full" style={{ width: stat.bar, background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sparkline chart */}
                  <div className="p-4 rounded-xl flex flex-col gap-3" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-white">Global Traffic Ingestion</h3>
                        <p className="text-[11px] text-[#6B7585]">Monitored every 250ms across 12 edge nodes</p>
                      </div>
                      <span className="badge-green">LIVE STREAM</span>
                    </div>
                    <div className="w-full h-36 rounded-lg p-3 relative overflow-hidden" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.6)' }}>
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 140">
                        <defs>
                          <linearGradient id="blueGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#4B7FEF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4B7FEF" stopOpacity="0.01" />
                          </linearGradient>
                        </defs>
                        <line stroke="rgba(30,38,48,0.6)" strokeWidth="1" x1="0" x2="800" y1="35" y2="35" />
                        <line stroke="rgba(30,38,48,0.6)" strokeWidth="1" x1="0" x2="800" y1="70" y2="70" />
                        <line stroke="rgba(30,38,48,0.6)" strokeWidth="1" x1="0" x2="800" y1="105" y2="105" />
                        <path
                          d="M0,110 Q100,50 200,80 T400,30 T600,65 T800,15 L800,140 L0,140 Z"
                          fill="url(#blueGrad)"
                        />
                        <path
                          d="M0,110 Q100,50 200,80 T400,30 T600,65 T800,15"
                          fill="none"
                          stroke="#4B7FEF"
                          strokeWidth="2"
                        />
                        <circle cx="800" cy="15" fill="#4B7FEF" r="4" />
                        <circle cx="800" cy="15" fill="rgba(75,127,239,0.3)" r="8" />
                      </svg>
                      <span className="absolute top-2 right-3 text-[10px] font-mono text-[#9BA5B4]">
                        Peak: 29.4 Gbps
                      </span>
                    </div>
                  </div>
                </div>

                {/* Side info */}
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl flex flex-col gap-2" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                    <span className="text-[10px] font-mono text-[#6B7585] uppercase tracking-wider">ACTIVE DEPLOYMENTS</span>
                    <div className="flex flex-col gap-1.5 text-xs font-mono">
                      {["api-gateway-v4", "auth-matrix", "kv-sync-daemon"].map((svc, i) => (
                        <div key={svc} className="p-2 rounded-lg flex items-center justify-between" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.6)' }}>
                          <span className="text-[#F0F4FF]">{svc}</span>
                          <span className="text-[#6B7585] text-[10px]">{["3m ago","14m ago","1h ago"][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl flex flex-col gap-2 text-xs font-mono" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                    <span className="text-[10px] text-[#6B7585] uppercase tracking-wider">FAILOVER POLICIES</span>
                    {[
                      ["Auto-Drain Zone", "#3DD68C", "ENABLED"],
                      ["BGP Anycast", "#3DD68C", "ACTIVE"],
                      ["mTLS Strict", "#3DD68C", "ENFORCED"],
                    ].map(([label, color, val]) => (
                      <div key={label as string} className="flex justify-between">
                        <span className="text-[#9BA5B4]">{label as string}</span>
                        <span className="font-semibold" style={{ color: color as string }}>{val as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 4: INFRASTRUCTURE TOPOLOGY */}
        <section className="w-full py-20" style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(75,127,239,0.06) 0%, transparent 60%), #0D1117', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-10">
            <ScrollReveal direction="left" className="max-w-xl flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#4B7FEF' }}>Zero-Latency Topology</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-white">
                See your entire infrastructure at a glance.
              </h2>
              <p className="text-sm text-[#9BA5B4] leading-relaxed">
                Real-time dynamic visualization of interconnected microservices, managed datastores, and ingress edge conduits.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Node Grid */}
              <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-5" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
                  <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">DISTRIBUTED FABRIC TOPOLOGY</span>
                  <span className="badge-green">Mesh Online</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { title: "API GATEWAY", desc: "36 Replicas · Envoy 1.28", metric: "24.2k req/s", icon: "api" },
                    { title: "DATABASE", desc: "Postgres 16 Primary+3 HA", metric: "0.8ms latency", icon: "database" },
                    { title: "REDIS CLUSTER", desc: "12 Shards · In-Memory", metric: "99.8% Cache Hit", icon: "memory" },
                    { title: "WORKER POOL", desc: "Async Job Consumers", metric: "0 pending", icon: "precision_manufacturing" },
                    { title: "EDGE CDN", desc: "Anycast 310 Points", metric: "p99 12ms Edge", icon: "public" },
                    { title: "KUBERNETES", desc: "Managed K8s v1.29", metric: "Autoscale (42-120)", icon: "hub" },
                  ].map((node, i) => (
                    <ScrollReveal key={node.title} direction={i % 3 === 2 ? "right" : i % 2 === 0 ? "up" : "left"} delay={i * 60}>
                    <div
                      className="card-interactive p-3.5 rounded-xl flex flex-col gap-1.5 cursor-pointer group h-full"
                      style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(75,127,239,0.3)';
                        (e.currentTarget as HTMLDivElement).style.background = '#111B2E';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30,38,48,0.8)';
                        (e.currentTarget as HTMLDivElement).style.background = '#131920';
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-lg" style={{ color: '#4B7FEF' }}>{node.icon}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C' }} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-white mt-1">{node.title}</span>
                      <span className="text-[10px] text-[#6B7585]">{node.desc}</span>
                      <span className="text-[10px] font-mono text-[#9BA5B4] mt-0.5">{node.metric}</span>
                    </div>
                    </ScrollReveal>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-[#6B7585]" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
                  <span>Synchronized with Terraform &amp; Pulumi state</span>
                  <span style={{ color: '#3DD68C' }}>Zero Drift</span>
                </div>
              </div>

              {/* Health */}
              <ScrollReveal direction="right" className="rounded-2xl p-6 flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
                    <h3 className="text-xs font-semibold text-white">Infrastructure Health</h3>
                    <span className="badge-green">OPTIMAL</span>
                  </div>

                  <div className="flex flex-col gap-4 font-mono text-xs">
                    {[
                      { label: "CPU ALLOCATION", target: 42, suffix: "%", pct: 42, color: "#4B7FEF" },
                      { label: "MEMORY FOOTPRINT", target: 61, suffix: "%", pct: 61, color: "#4B7FEF" },
                      { label: "24H REQUEST VOLUME", target: 2.4, suffix: "M", decimals: 1, pct: 84, color: "#3DD68C" },
                      { label: "MONTHLY UPTIME", target: 99.99, suffix: "%", decimals: 2, pct: 99.99, color: "#3DD68C" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#6B7585]">{item.label}</span>
                          <span className="text-white font-semibold">
                            <AnimatedMetric target={item.target} suffix={item.suffix} decimals={item.decimals ?? 0} />
                          </span>
                        </div>
                        <AnimatedBar pct={item.pct} color={item.color} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl flex items-center justify-between" style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#6B7585]">Automated healing</span>
                    <span className="text-xs text-white font-medium">No interventions required</span>
                  </div>
                  <span className="material-symbols-outlined text-xl" style={{ color: '#3DD68C' }}>verified</span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* SECTION 5: CI/CD PIPELINE */}
        <section className="w-full py-20" style={{ background: '#070A0D', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-10">
            <ScrollReveal direction="up" className="max-w-xl flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#4B7FEF' }}>Instant CI/CD Delivery</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-white">
                From commit to production in minutes.
              </h2>
              <p className="text-sm text-[#9BA5B4] leading-relaxed">
                Push your code. NEXUS triggers parallel container compiles, runs ephemeral security
                test suites, and orchestrates zero-downtime blue/green rollouts.
              </p>
            </ScrollReveal>

            <DeploymentPipeline />

            <div className="p-5 rounded-2xl flex flex-col gap-5" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ color: '#4B7FEF' }}>merge</span>
                  <div>
                    <span className="text-xs font-semibold text-white font-mono block">Production Deployment #4892</span>
                    <span className="text-[11px] text-[#6B7585] font-mono">
                      commit: <code className="text-[#F0F4FF]">feat: optimize API caching</code> · main branch
                    </span>
                  </div>
                </div>
                <span className="badge-green">● DEPLOY LIVE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-4" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
                {[
                  ["BUILD TIME", "28s (Cached)"],
                  ["TEST SUITE", "142 passed"],
                  ["STRATEGY", "Blue/Green"],
                  ["TOTAL ELAPSED", "1m 42s"],
                ].map(([label, val], i) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#6B7585]">{label}</span>
                    <span className={`font-semibold ${i === 3 ? "" : "text-white"}`} style={i === 3 ? { color: '#4B7FEF' } : {}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: OBSERVABILITY */}
        <section className="w-full py-20" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(61,214,140,0.05) 0%, transparent 60%), #0D1117', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <ScrollReveal direction="left" className="max-w-xl flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#4B7FEF' }}>Telemetry &amp; Inspection</span>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-white">
                  Real-time operational observability.
                </h2>
                <p className="text-sm text-[#9BA5B4] leading-relaxed">
                  Correlate metrics, structured distributed logs, and OpenTelemetry spans across
                  global clusters with instant root cause analysis.
                </p>
              </ScrollReveal>
              <div className="flex items-center rounded-xl p-1 font-mono text-xs" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                {["Metrics", "Logs", "Traces", "Alerts"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTelemetryTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${activeTelemetryTab === tab ? "text-white" : "text-[#6B7585] hover:text-[#F0F4FF]"}`}
                    style={activeTelemetryTab === tab ? { background: '#1E2630' } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <ScrollReveal direction="up" threshold={0.08}>
            <div className="rounded-2xl p-5 flex flex-col gap-3 font-mono text-xs" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
              <div className="flex items-center justify-between pb-3 text-[11px]" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex items-center gap-2">
                  <span className="dot-live" />
                  <span className="text-white font-semibold">ingress-gateway-edge-01.syslog</span>
                </div>
                <span className="text-[#6B7585]">Filter: level &gt;= INFO</span>
              </div>
              <div className="flex flex-col gap-2 text-[11px] pt-1">
                {[
                  { time: "10:42:01.291", level: "INFO", levelColor: "#4B7FEF", svc: "api-gateway", msg: "request completed  182ms  client=184.22.91.12" },
                  { time: "10:42:02.102", level: "INFO", levelColor: "#4B7FEF", svc: "postgres", msg: "query completed    41ms  node=pg-shard-03" },
                  { time: "10:42:02.441", level: "WARN", levelColor: "#E8AC3B", svc: "redis", msg: "cache miss         12ms  key=session_tok_89a" },
                  { time: "10:42:03.012", level: "INFO", levelColor: "#4B7FEF", svc: "worker", msg: "job processed      82ms  queue=notifications" },
                ].map((log, i) => (
                  <div key={i} className={`log-enter flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-[#131920] transition-colors`} style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-[#6B7585]">{log.time}</span>
                    <span className="font-semibold" style={{ color: log.levelColor, minWidth: 32 }}>{log.level}</span>
                    <span className="text-white">{log.svc}</span>
                    <span className="text-[#9BA5B4]">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 7: PRICING */}
        <section id="pricing" className="w-full py-20" style={{ background: '#070A0D', borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-10">
            <ScrollReveal direction="up" className="max-w-xl flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#4B7FEF' }}>Predictable Capacity</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-white">
                Scale without surprise invoices.
              </h2>
              <p className="text-sm text-[#9BA5B4] leading-relaxed">
                Flat-rate control plane licensing combined with transparent pass-through bare-metal compute units.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Starter */}
              <ScrollReveal direction="left" delay={0} className="p-6 rounded-2xl flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7585]">STARTER</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold text-white font-mono" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>$0</span>
                      <span className="text-sm text-[#6B7585]">/ month</span>
                    </div>
                    <p className="text-sm text-[#9BA5B4] mt-2">Ideal for staging environments, development pods, and side projects.</p>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 text-sm text-[#9BA5B4]" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
                    {["3 Managed Regions", "10 Micro-instances", "7-Day Log Retention", "Community Support"].map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <span className="text-[#3DD68C] font-bold">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/dashboard" className="btn-nexus-outline mt-6 w-full py-2.5 text-center rounded-xl text-sm font-medium text-white hover:bg-[#1A2030]" style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}>
                  Get Started Free
                </Link>
              </ScrollReveal>

              {/* Professional — featured */}
              <ScrollReveal direction="up" delay={80} className="p-6 rounded-2xl flex flex-col justify-between relative" style={{ background: 'linear-gradient(145deg, #111B2E 0%, #0D1520 100%)', border: '1px solid rgba(75,127,239,0.3)', boxShadow: '0 0 40px rgba(75,127,239,0.1)' }}>
                <div className="absolute -top-3 right-5 px-3 py-1 rounded-full text-white text-[10px] font-mono font-bold" style={{ background: 'linear-gradient(135deg, #4B7FEF, #3560BE)', boxShadow: '0 2px 10px rgba(75,127,239,0.4)' }}>
                  RECOMMENDED
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#6B9AF8' }}>PROFESSIONAL</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold text-white font-mono" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>$490</span>
                      <span className="text-sm text-[#6B7585]">/ month</span>
                    </div>
                    <p className="text-sm text-[#9BA5B4] mt-2">Full production control plane for scaling engineering teams.</p>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 text-sm text-[#9BA5B4]" style={{ borderTop: '1px solid rgba(75,127,239,0.15)' }}>
                    {["All 12 Global Regions", "Unlimited Compute Nodes", "30-Day OpenTelemetry Retention", "Zero-Downtime Blue/Green Rollouts", "Automated Postgres Read Replicas"].map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <span className="font-bold" style={{ color: '#6B9AF8' }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/dashboard" className="btn-nexus-primary mt-6 w-full py-2.5 text-center rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #4B7FEF, #3560BE)', boxShadow: '0 2px 16px rgba(75,127,239,0.3)' }}>
                  Start Professional Trial
                </Link>
              </ScrollReveal>

              {/* Enterprise */}
              <ScrollReveal direction="right" delay={160} className="p-6 rounded-2xl flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7585]">ENTERPRISE</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Custom</span>
                    </div>
                    <p className="text-sm text-[#9BA5B4] mt-2">Dedicated VPC clusters, sovereign data residency, and custom SLAs.</p>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 text-sm text-[#9BA5B4]" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
                    {["Dedicated Bare-Metal Clusters", "99.999% Guaranteed SLA", "Dedicated Solutions Architect", "SOC2 Type II & HIPAA BAA"].map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <span className="text-[#3DD68C] font-bold">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/dashboard" className="btn-nexus-outline mt-6 w-full py-2.5 text-center rounded-xl text-sm font-medium text-white hover:bg-[#1A2030]" style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}>
                  Contact Enterprise Sales
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* SECTION 8: FINAL CTA */}
        <section className="w-full py-20 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(75,127,239,0.1) 0%, transparent 70%), #0D1117' }}>
          <ScrollReveal direction="up" className="mx-auto max-w-3xl px-6 text-center flex flex-col items-center gap-6">
            <ScrollReveal direction="up" delay={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(61,214,140,0.1)', border: '1px solid rgba(61,214,140,0.2)' }}>
              <span className="dot-live" />
              <span className="text-[11px] font-mono" style={{ color: '#3DD68C' }}>48 clusters running globally right now</span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={80}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }} className="text-white">
                Build infrastructure that disappears into the background.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={160} className="text-base text-[#9BA5B4] max-w-xl leading-relaxed" as="p">
              Spin up your next cluster in 60 seconds. Experience the speed of a modern developer control plane.
            </ScrollReveal>
            <ScrollReveal direction="up" delay={240} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="btn-nexus-primary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #4B7FEF 0%, #3560BE 100%)', boxShadow: '0 4px 24px rgba(75,127,239,0.35)' }}
              >
                Start building free
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                href="/compute"
                className="btn-nexus-outline inline-flex items-center gap-2 font-medium px-6 py-3 rounded-xl text-[#F0F4FF] text-sm hover:bg-[#131920]"
                style={{ border: '1px solid rgba(30,38,48,0.9)' }}
              >
                Talk to sales
              </Link>
            </ScrollReveal>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10" style={{ background: '#070A0D', borderTop: '1px solid rgba(30,38,48,0.6)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid rgba(30,38,48,0.6)' }}>
            <div className="flex items-center gap-2.5">
              <NexusLogo className="h-5 w-auto object-contain" />
              <span className="text-xs font-mono font-bold text-white">NEXUS CONTROL PLANE</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7585]">
              <span className="w-2 h-2 rounded-full bg-[#3DD68C]" />
              <span>All systems operational 99.99%</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B7585]">
            <span>© 2025 NEXUS Cloud Systems Inc.</span>
            <div className="flex items-center gap-6 text-[#9BA5B4]">
              {["Compute", "Observability", "Deployments", "Security"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
