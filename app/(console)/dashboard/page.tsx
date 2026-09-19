"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface LogEntry {
  time: string;
  level: string;
  color: string;
  msg: string;
}

export default function CloudOverviewDashboard() {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d" | "30d">("1h");
  const [nodeFilter, setNodeFilter] = useState<"All" | "Datastores" | "Routing">("All");
  const [cmdInput, setCmdInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      time: "10:48:02.104",
      level: "INFO",
      color: "text-[#5B8DEF]",
      msg: "mesh.route: gRPC ingress balanced 14,209 conn across 12 instances [us-east-1]",
    },
    {
      time: "10:48:04.882",
      level: "DEBUG",
      color: "text-[#A0A7B0]",
      msg: "cache.redis.l2: memory slab compaction finished in 0.44ms. Hit ratio stable at 99.41%",
    },
    {
      time: "10:48:09.319",
      level: "INFO",
      color: "text-[#5B8DEF]",
      msg: "cert-manager: automatic handshake verified for *.nexus.internal with Let's Encrypt Root X1",
    },
    {
      time: "10:48:14.002",
      level: "AUDIT",
      color: "text-[#A0A7B0]",
      msg: "identity.saml: session granted to alex.chen@enterprise.io via SSO Okta with RBAC: PrincipalArchitect",
    },
    {
      time: "10:48:19.450",
      level: "HEALTH",
      color: "text-[#43B581]",
      msg: "heartbeat received from all 12 global CDN PoPs. Latency variance delta: ±0.4ms",
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = cmdInput.trim();
    if (!val) return;

    const now = new Date().toISOString().substring(11, 23);
    const newLogs = [...logs, { time: now, level: "EXEC", color: "text-[#F2F4F7]", msg: `$ ${val}` }];
    setLogs(newLogs);
    setCmdInput("");

    setTimeout(() => {
      const respTime = new Date().toISOString().substring(11, 23);
      if (val.includes("status")) {
        setLogs((prev) => [
          ...prev,
          {
            time: respTime,
            level: "STATUS",
            color: "text-[#43B581]",
            msg: "Fleet 12/12 online. 128 cores active. P99 latency: 24.2ms.",
          },
        ]);
      } else if (val.includes("ping")) {
        setLogs((prev) => [
          ...prev,
          {
            time: respTime,
            level: "PING",
            color: "text-[#5B8DEF]",
            msg: "12 regions reachable. Mean response: 38ms. Packet loss: 0.00%.",
          },
        ]);
      } else if (val.includes("deploy")) {
        setLogs((prev) => [
          ...prev,
          {
            time: respTime,
            level: "DEPLOY",
            color: "text-[#5B8DEF]",
            msg: "Dispatched canary container build #902ac3. Queued on worker cluster.",
          },
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            time: respTime,
            level: "ACK",
            color: "text-[#43B581]",
            msg: `Command '${val}' registered and dispatched to cluster daemon.`,
          },
        ]);
      }
    }, 250);
  };

  const handleClearLogs = () => {
    const now = new Date().toISOString().substring(11, 23);
    setLogs([{ time: now, level: "CONSOLE", color: "text-[#6F7782]", msg: "Log buffer cleared by operator." }]);
  };

  return (
    <div className="flex flex-col w-full gap-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Command Header & Operational Status HUD */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: '#6B7585' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C', boxShadow: '0 0 0 2px rgba(61,214,140,0.2)' }} />
            <span className="font-medium" style={{ color: '#3DD68C' }}>Mesh Synced</span>
            <span>/</span>
            <span>NODE_ID: US-EAST-CORE-09</span>
            <span>/</span>
            <span>KERNEL 6.8.4-NEXUS-RT</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Good morning, Alex.
            </h1>
            <span className="text-sm" style={{ color: '#9BA5B4' }}>
              Principal Cloud Infrastructure Architect
            </span>
          </div>
        </div>

        {/* Status Capsule */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#3DD68C' }} />
            <span className="text-white font-semibold">All systems operational</span>
          </div>
          <span style={{ color: '#2A3344' }}>|</span>
          <span style={{ color: '#9BA5B4' }}>12/12 Regions Healthy</span>
          <span style={{ color: '#2A3344' }}>|</span>
          <span style={{ color: '#9BA5B4' }}>99.99% SLA Target</span>
        </div>
      </div>

      {/* Top Operational Metrics Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Fleet Reliability', val: '99.99%', delta: '+0.01%', deltaColor: '#3DD68C', bar: '99.99%', barColor: '#3DD68C', sub: null, dot: true },
          { label: 'CPU Usage', val: '42%', delta: '▼ 3.2%', deltaColor: '#4B7FEF', bar: '42%', barColor: '#4B7FEF', sub: '128 vCPU', dot: false },
          { label: 'Memory Pool', val: '61%', delta: '78.2 GB', deltaColor: '#9BA5B4', bar: '61%', barColor: '#4B7FEF', sub: '128 GB', dot: false },
          { label: 'Requests', val: '2.4M', delta: '24.8k/s', deltaColor: '#3DD68C', bar: '74%', barColor: '#3DD68C', sub: 'HTTP/3', dot: false },
          { label: 'Active Services', val: '8 / 8', delta: '100%', deltaColor: '#3DD68C', bar: '100%', barColor: '#3DD68C', sub: 'SYNCED', dot: false },
        ].map((metric) => (
          <div key={metric.label} className="p-4 rounded-xl flex flex-col gap-2 transition-all" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#6B7585' }}>{metric.label}</span>
              {metric.dot
                ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C', boxShadow: '0 0 0 2px rgba(61,214,140,0.2)' }} />
                : <span className="text-[10px] font-mono" style={{ color: '#6B7585' }}>{metric.sub}</span>
              }
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-bold text-white">{metric.val}</span>
              <span className="text-xs font-semibold" style={{ color: metric.deltaColor }}>{metric.delta}</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,38,48,0.8)' }}>
              <div className="h-full rounded-full" style={{ width: metric.bar, background: `linear-gradient(90deg, ${metric.barColor}88, ${metric.barColor})` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Telemetry & Vector Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Traffic & Compute Waveforms (2 cols) */}
        <div className="xl:col-span-2 p-5 rounded-2xl flex flex-col gap-4" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base" style={{ color: '#4B7FEF' }}>monitoring</span>
              <div>
                <h2 className="text-xs font-semibold text-white">Mesh Ingress &amp; Latency Vectors</h2>
                <p className="text-[11px]" style={{ color: '#6B7585' }}>Real-time p50 / p95 / p99 distribution across global edge nodes</p>
              </div>
            </div>
            <div className="flex items-center p-0.5 rounded-lg text-xs font-mono" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
              {(["1h", "6h", "24h", "7d", "30d"] as const).map((r) => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className="px-2.5 py-1 rounded-md transition-colors"
                  style={timeRange === r ? { background: '#1E2630', color: 'white' } : { color: '#6B7585' }}
                >{r}</button>
              ))}
            </div>
          </div>

          {/* SVG Waveform Chart */}
          <div className="relative w-full h-44 rounded-xl p-3 flex flex-col justify-between overflow-hidden" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
            <svg className="w-full h-32" preserveAspectRatio="none" viewBox="0 0 700 130">
              <defs>
                <linearGradient id="dashGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4B7FEF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4B7FEF" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <line stroke="rgba(30,38,48,0.7)" strokeWidth="1" x1="0" x2="700" y1="30" y2="30" />
              <line stroke="rgba(30,38,48,0.7)" strokeWidth="1" x1="0" x2="700" y1="65" y2="65" />
              <line stroke="rgba(30,38,48,0.7)" strokeWidth="1" x1="0" x2="700" y1="100" y2="100" />
              <polyline fill="none" points="0,110 50,100 100,105 150,88 200,92 250,78 300,82 350,65 400,72 450,55 500,60 550,42 600,48 650,32 700,22" stroke="rgba(155,165,180,0.4)" strokeDasharray="4 3" strokeWidth="1" />
              <polygon fill="url(#dashGrad)" points="0,120 50,115 100,108 150,100 200,102 250,92 300,96 350,80 400,85 450,68 500,72 550,52 600,58 650,40 700,28 700,130 0,130" />
              <polyline fill="none" points="0,120 50,115 100,108 150,100 200,102 250,92 300,96 350,80 400,85 450,68 500,72 550,52 600,58 650,40 700,28" stroke="#4B7FEF" strokeWidth="2" />
              <circle cx="700" cy="28" fill="#4B7FEF" r="4" />
              <circle cx="700" cy="28" fill="rgba(75,127,239,0.25)" r="8" />
            </svg>
            <div className="flex justify-between items-center text-[10px] font-mono px-1" style={{ color: '#6B7585' }}>
              <span>00:00 UTC</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
              <span className="text-white font-semibold">NOW</span>
            </div>
          </div>

          {/* Breakdown footnote */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {[
              { label: 'Median Ingress (p50)', val: '18,420 req/s', color: 'white' },
              { label: 'High-Percentile (p95)', val: '22,110 req/s', color: 'white' },
              { label: 'P99 Edge Latency', val: '24.2 ms', color: '#4B7FEF' },
            ].map((s) => (
              <div key={s.label} className="p-2.5 rounded-lg" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="text-[10px]" style={{ color: '#6B7585' }}>{s.label}</div>
                <div className="font-semibold mt-0.5" style={{ color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Quotas (1 col) */}
        <div className="p-5 rounded-2xl flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base" style={{ color: '#9BA5B4' }}>pie_chart</span>
              <h2 className="text-xs font-semibold text-white">Resource Quotas</h2>
            </div>
            <span className="text-[10px] font-mono" style={{ color: '#6B7585' }}>RACK 04</span>
          </div>

          {/* Radial Allocation Gauge */}
          <div className="flex items-center justify-center my-4 relative">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" fill="none" r="48" stroke="rgba(30,38,48,0.8)" strokeWidth="7" />
              <circle cx="60" cy="60" fill="none" r="48" stroke="#4B7FEF" strokeDasharray="301" strokeDashoffset="117" strokeLinecap="round" strokeWidth="7" />
              <circle cx="60" cy="60" fill="none" r="36" stroke="rgba(30,38,48,0.8)" strokeWidth="5" />
              <circle cx="60" cy="60" fill="none" r="36" stroke="#3DD68C" strokeDasharray="226" strokeDashoffset="131" strokeLinecap="round" strokeWidth="5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
              <span className="text-2xl font-bold text-white">61%</span>
              <span className="text-[10px]" style={{ color: '#6B7585' }}>RAM PEAK</span>
            </div>
          </div>

          {/* Resource Legends */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            {[
              { color: '#4B7FEF', label: 'Memory Pool', val: '78.2 / 128 GB' },
              { color: '#3DD68C', label: 'CPU Cores', val: '54 / 128 Cores' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                  <span style={{ color: '#9BA5B4' }}>{r.label}</span>
                </div>
                <span className="text-white font-semibold">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Clusters Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold text-white">Infrastructure Mesh &amp; Core Clusters</h2>
            <p className="text-[11px]" style={{ color: '#6B7585' }}>Distributed multi-region topology nodes reporting telemetry over gRPC stream</p>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-[11px]" style={{ color: '#6B7585' }}>Filter:</span>
            {(["All", "Datastores", "Routing"] as const).map((filter) => (
              <button key={filter} onClick={() => setNodeFilter(filter)}
                className="px-2.5 py-1 rounded-lg text-xs transition-colors"
                style={nodeFilter === filter ? { background: '#1E2630', color: 'white' } : { color: '#6B7585' }}
              >{filter === "All" ? "All (6 Nodes)" : filter}</button>
            ))}
          </div>
        </div>

        {/* Cluster Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { name: "NEXUS-API-GATEWAY", region: "us-east-1 · Envoy v1.30", tag: "PROD", pods: "12 Act", cpu: "38%", rtt: "1.8ms" },
            { name: "NEXUS-AUTH-SERVICE", region: "eu-central-1 · OAuth2/mTLS", tag: "PROD", pods: "6 Act", cpu: "24%", rtt: "3.8k tok/s" },
            { name: "PG-PRIMARY-CLUSTER", region: "us-east-1 · PG-16 HA Patroni", tag: "HA-PAIR", pods: "1.2 TB", cpu: "0.02ms lag", rtt: "412/1k conn" },
            { name: "REDIS-CACHE-L2", region: "us-east-1 · In-Memory Shards", tag: "99.4% HIT", pods: "64 GB", cpu: "184k ops/s", rtt: "0 evict" },
            { name: "WORKER-PIPELINE", region: "ap-south-1 · BullMQ / RabbitMQ", tag: "18 WRK", pods: "0 backlog", cpu: "1.4M/hr", rtt: "0.00% fail" },
            { name: "CDN-EDGE-GLOBAL", region: "12 PoPs · Anycast DNS Mesh", tag: "ANYCAST", pods: "12 Act", cpu: "99.99% cache", rtt: "88 Gbps" },
          ].map((cluster) => (
            <div key={cluster.name} className="p-4 rounded-xl flex flex-col gap-3 transition-all cursor-pointer"
              style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(75,127,239,0.25)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30,38,48,0.9)'; }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C', boxShadow: '0 0 0 2px rgba(61,214,140,0.15)' }} />
                    <span className="text-xs font-bold text-white">{cluster.name}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: '#6B7585' }}>{cluster.region}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: '#1A2030', color: '#9BA5B4', border: '1px solid rgba(30,38,48,0.8)' }}>
                  {cluster.tag}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg text-[11px]" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                <div>
                  <span className="block text-[9px] uppercase tracking-wide" style={{ color: '#6B7585' }}>Capacity</span>
                  <span className="text-white font-semibold">{cluster.pods}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wide" style={{ color: '#6B7585' }}>Utilization</span>
                  <span className="font-semibold" style={{ color: '#4B7FEF' }}>{cluster.cpu}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wide" style={{ color: '#6B7585' }}>Throughput</span>
                  <span className="font-semibold" style={{ color: '#3DD68C' }}>{cluster.rtt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Operations & Recent Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Alerts (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <div>
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: '#4B7FEF' }}>emergency</span>
                <h2 className="text-xs font-semibold text-white">Health Advisories</h2>
              </div>
              <span className="badge-green">0 CRITICAL</span>
            </div>

            <div className="p-3.5 rounded-xl flex flex-col gap-2 mb-3" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-semibold" style={{ color: '#4B7FEF' }}>SCHEDULED MAINTENANCE</span>
                <span style={{ color: '#6B7585' }}>T-03:00 UTC</span>
              </div>
              <p className="text-xs text-white font-medium">Live kernel patch scheduled for cluster eu-west-3</p>
              <p className="text-[11px]" style={{ color: '#6B7585' }}>Zero-downtime rolling container migration will redirect workloads automatically.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { label: 'DDoS Shield', val: 'ARMED', color: '#3DD68C' },
                { label: 'TLS Expiry', val: '>30 days', color: 'white' },
              ].map((s) => (
                <div key={s.label} className="p-2.5 rounded-lg flex justify-between items-center" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                  <span style={{ color: '#6B7585' }}>{s.label}</span>
                  <span className="font-semibold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 mt-3" style={{ borderTop: '1px solid rgba(30,38,48,0.8)' }}>
            <button className="flex-1 py-2 rounded-lg text-white text-xs font-medium transition-colors hover:bg-[#1A2030]" style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}>
              Run Diagnostics
            </button>
            <Link href="/compute" className="flex-1 py-2 rounded-lg text-white text-xs font-medium text-center transition-colors" style={{ background: 'linear-gradient(135deg, #4B7FEF, #3560BE)', boxShadow: '0 1px 8px rgba(75,127,239,0.25)' }}>
              Scale Fleet
            </Link>
          </div>
        </div>

        {/* Deployments (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl flex flex-col justify-between" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <div>
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: '#4B7FEF' }}>deployed_code</span>
                <h2 className="text-xs font-semibold text-white">Recent Deployments</h2>
              </div>
              <Link href="/deployments" className="text-xs font-mono font-semibold transition-colors" style={{ color: '#4B7FEF' }}>View all →</Link>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              {[
                { id: "#8b3f1a9", env: "PROD", title: "feat: optimize API caching and distributed lock", author: "Alex Chen", time: "1m ago", status: "LIVE ✓", statusColor: '#3DD68C' },
                { id: "#3e99d40", env: "STAGE", title: "fix: handle edge timeout on socket pool", author: "Sarah Jenkins", time: "14m ago", status: "READY", statusColor: '#4B7FEF' },
                { id: "#901cc4e", env: "CANARY", title: "test: canary deployment for v2.4 telemetry", author: "David K", time: "42m ago", status: "84% VERIFIED", statusColor: '#9BA5B4' },
              ].map((dep) => (
                <div key={dep.id} className="p-3 rounded-xl flex items-center justify-between gap-2" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: '#1A2030', color: '#9BA5B4', border: '1px solid rgba(30,38,48,0.8)' }}>
                      {dep.env}
                    </span>
                    <div className="truncate">
                      <span className="text-xs text-white font-medium truncate block">{dep.title}</span>
                      <span className="text-[10px]" style={{ color: '#6B7585' }}>{dep.id} by {dep.author} ({dep.time})</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: dep.statusColor }}>{dep.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Terminal Console */}
      <div className="p-5 rounded-2xl flex flex-col gap-3 font-mono" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(30,38,48,0.8)' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: '#E05C5C' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#E8AC3B' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#3DD68C' }} />
            </div>
            <span className="text-xs text-white font-semibold">nexus-shell</span>
            <span className="text-[11px] font-mono" style={{ color: '#6B7585' }}>root@us-east-1a:~$</span>
          </div>
          <button onClick={handleClearLogs}
            className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
            style={{ color: '#6B7585', background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'white'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6B7585'; }}
          >Clear</button>
        </div>

        <div className="h-36 overflow-y-auto p-3 rounded-xl flex flex-col gap-1" style={{ background: '#070A0D', border: '1px solid rgba(30,38,48,0.8)' }}>
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="text-[10px]" style={{ color: '#6B7585' }}>{log.time}</span>
              <span className={`${log.color} font-bold text-[10px]`}>[{log.level}]</span>
              <span className="text-white">{log.msg}</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <span className="font-bold text-sm" style={{ color: '#4B7FEF' }}>&gt;</span>
          <input
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-[#4B5568] focus:outline-none"
            placeholder="Type a nexus command (e.g., 'nexus fleet status', 'nexus ping --all')..."
            type="text"
          />
          <button type="submit" className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #4B7FEF, #3560BE)', boxShadow: '0 1px 8px rgba(75,127,239,0.25)' }}>
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}
