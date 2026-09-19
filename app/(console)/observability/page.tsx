"use client";

import React, { useState } from "react";

export default function ObservabilityPage() {
  const [activeTab, setActiveTab] = useState("Metrics");
  const [timeRange, setTimeRange] = useState("1H");
  const [logSeverity, setLogSeverity] = useState("ALL");
  const [selectedService, setSelectedService] = useState("all");

  const logEntries = [
    {
      time: "10:42:01.291",
      level: "INFO",
      service: "api-gateway",
      content: "GET /v1/fleet/status HTTP/2.0  status=200",
      duration: "182ms",
    },
    {
      time: "10:42:02.102",
      level: "INFO",
      service: "postgres",
      content: "query completed: SELECT count(*) FROM telemetry_events",
      duration: "41ms",
    },
    {
      time: "10:42:02.441",
      level: "WARN",
      service: "redis",
      content: "cache miss on key:tenant:config:9421 (fallback to DB)",
      duration: "12ms",
    },
    {
      time: "10:42:03.012",
      level: "INFO",
      service: "worker",
      content: "job processed: EVT_TELEMETRY_SYNC offset=9821420",
      duration: "82ms",
    },
    {
      time: "10:42:04.184",
      level: "INFO",
      service: "auth-service",
      content: "JWT verification claims=[read, write, telemetry:export]",
      duration: "1.2ms",
    },
    {
      time: "10:42:05.789",
      level: "ERROR",
      service: "edge-proxy",
      content: "upstream connect timeout on 10.0.4.12:8443 (retried 1/3)",
      duration: "502ms",
    },
  ];

  const filteredLogs = logEntries.filter((item) => {
    if (logSeverity !== "ALL" && item.level !== logSeverity) return false;
    if (selectedService !== "all" && item.service !== selectedService) return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Telemetry Command Strip */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0F1216] p-3 rounded-md border border-[#252B33] font-mono text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#090B0E] border border-[#252B33]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" />
            <span className="text-[#F2F4F7] uppercase tracking-wider font-medium">
              Production (Global Fleet)
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-[#090B0E] p-0.5 rounded border border-[#252B33]">
            {["Metrics", "Logs", "Distributed Traces", "Alert Rules"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === tab
                    ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                    : "text-[#6F7782] hover:text-[#F2F4F7]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Time & Live Polling Selector */}
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-[#090B0E] rounded p-0.5 border border-[#252B33]">
            {["15m", "1H", "24H"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  timeRange === t
                    ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                    : "text-[#6F7782] hover:text-[#F2F4F7]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#090B0E] border border-[#252B33]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" />
            <span className="text-[#A0A7B0]">LIVE: 5s</span>
          </div>
        </div>
      </section>

      {/* Key Telemetry KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {/* Throughput */}
        <div className="p-3.5 rounded-md bg-[#0F1216] border border-[#252B33] flex flex-col justify-between">
          <span className="text-[11px] text-[#6F7782] uppercase">Throughput</span>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#F2F4F7]">24,850</div>
            <div className="text-[11px] text-[#A0A7B0] mt-0.5">
              req/sec · <span className="text-[#43B581]">+4.8%</span>
            </div>
          </div>
          <span className="text-[10px] text-[#6F7782] pt-1 border-t border-[#252B33]">
            Peak: 31,240 req/s
          </span>
        </div>

        {/* Latency P99 */}
        <div className="p-3.5 rounded-md bg-[#0F1216] border border-[#252B33] flex flex-col justify-between">
          <span className="text-[11px] text-[#6F7782] uppercase">Global P99</span>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#F2F4F7]">24.8 ms</div>
            <div className="text-[11px] text-[#A0A7B0] mt-0.5">
              P50: 6.2 ms · <span className="text-[#43B581]">-0.4ms</span>
            </div>
          </div>
          <div className="w-full bg-[#191E24] h-1 rounded overflow-hidden">
            <div className="bg-[#5B8DEF] h-full w-[28%]" />
          </div>
        </div>

        {/* Error Rate */}
        <div className="p-3.5 rounded-md bg-[#0F1216] border border-[#252B33] flex flex-col justify-between">
          <span className="text-[11px] text-[#6F7782] uppercase">Error Rate</span>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#43B581]">0.0018%</div>
            <div className="text-[11px] text-[#6F7782] mt-0.5">3 / 100k requests</div>
          </div>
          <span className="text-[10px] text-[#6F7782] pt-1 border-t border-[#252B33]">
            SLO Target: &lt; 0.05%
          </span>
        </div>

        {/* Saturation */}
        <div className="p-3.5 rounded-md bg-[#0F1216] border border-[#252B33] flex flex-col justify-between">
          <span className="text-[11px] text-[#6F7782] uppercase">Saturated Nodes</span>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#F2F4F7]">0 / 142</div>
            <div className="text-[11px] text-[#43B581] mt-0.5">ALL NOMINAL</div>
          </div>
          <div className="w-full bg-[#191E24] h-1 rounded overflow-hidden">
            <div className="bg-[#43B581] h-full w-full" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-3.5 rounded-md bg-[#0F1216] border border-[#252B33] flex flex-col justify-between">
          <span className="text-[11px] text-[#6F7782] uppercase">Active Alerts</span>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#F2F4F7]">0 firing</div>
            <div className="text-[11px] text-[#6F7782] mt-0.5">2 pending silent</div>
          </div>
          <span className="text-[10px] text-[#6F7782] pt-1 border-t border-[#252B33]">
            MTTR 30d: 1.4 min
          </span>
        </div>
      </section>

      {/* Telemetry Charts & Heatmap */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Multi-Line Telemetry Chart (7 cols) */}
        <div className="xl:col-span-7 flex flex-col p-4 rounded-md bg-[#0F1216] border border-[#252B33]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <div>
              <div className="text-xs font-semibold text-[#F2F4F7]">
                Traffic Volume &amp; Status Trajectory
              </div>
              <div className="text-[11px] text-[#6F7782] font-mono">
                Synchronized egress &amp; response status metrics
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#5B8DEF]" />
                <span className="text-[#A0A7B0]">2xx OK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#D9A441]" />
                <span className="text-[#A0A7B0]">4xx Client</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#D95C5C]" />
                <span className="text-[#A0A7B0]">5xx Server</span>
              </div>
            </div>
          </div>

          {/* Vector Chart */}
          <div className="w-full h-52 bg-[#090B0E] rounded p-2 flex flex-col justify-between overflow-hidden border border-[#252B33]">
            <svg
              className="w-full h-40"
              preserveAspectRatio="none"
              viewBox="0 0 700 160"
            >
              {/* Neutral grid lines */}
              <line stroke="#191E24" strokeWidth="1" x1="0" x2="700" y1="40" y2="40" />
              <line stroke="#191E24" strokeWidth="1" x1="0" x2="700" y1="80" y2="80" />
              <line stroke="#191E24" strokeWidth="1" x1="0" x2="700" y1="120" y2="120" />

              {/* 2xx Primary Series (Blue) */}
              <polygon
                fill="#5B8DEF"
                fillOpacity="0.08"
                points="0,110 Q70,75 140,90 T280,50 T420,35 T560,55 T700,25 L700,160 L0,160 Z"
              />
              <path
                d="M0,110 Q70,75 140,90 T280,50 T420,35 T560,55 T700,25"
                fill="none"
                stroke="#5B8DEF"
                strokeWidth="1.5"
              />

              {/* 4xx Warning Series (Yellow) */}
              <path
                d="M0,145 Q80,142 160,138 T320,140 T480,135 T640,138 T700,132"
                fill="none"
                stroke="#D9A441"
                strokeWidth="1"
              />

              {/* 5xx Error Series (Red) */}
              <path
                d="M0,156 Q100,156 200,155 T400,154 T600,155 T700,153"
                fill="none"
                stroke="#D95C5C"
                strokeWidth="1"
              />

              <circle cx="700" cy="25" fill="#5B8DEF" r="3" />
            </svg>

            {/* White/gray axis labels */}
            <div className="flex items-center justify-between text-[#6F7782] text-[10px] font-mono px-1">
              <span>10:00 AM</span>
              <span>10:15 AM</span>
              <span>10:30 AM</span>
              <span>10:45 AM</span>
              <span className="text-[#F2F4F7]">11:00 AM (NOW)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-xs">
            <div className="bg-[#090B0E] p-2 rounded border border-[#252B33]">
              <span className="text-[10px] text-[#6F7782] block">Avg Throughput</span>
              <span className="text-[#F2F4F7] font-medium">24,310 req/s</span>
            </div>
            <div className="bg-[#090B0E] p-2 rounded border border-[#252B33]">
              <span className="text-[10px] text-[#6F7782] block">Bandwidth In/Out</span>
              <span className="text-[#F2F4F7] font-medium">18.4 / 42.1 Gbps</span>
            </div>
            <div className="bg-[#090B0E] p-2 rounded border border-[#252B33]">
              <span className="text-[10px] text-[#6F7782] block">Payload Drop</span>
              <span className="text-[#43B581] font-medium">0.00%</span>
            </div>
          </div>
        </div>

        {/* 48-Node Saturation Heatmap (5 cols) */}
        <div className="xl:col-span-5 flex flex-col p-4 rounded-md bg-[#0F1216] border border-[#252B33] justify-between font-mono text-xs">
          <div className="flex items-center justify-between pb-2">
            <div>
              <div className="text-xs font-semibold text-[#F2F4F7]">
                Cluster Fleet Saturation
              </div>
              <div className="text-[11px] text-[#6F7782]">
                48 Microservices Nodes (CPU &amp; RAM matrix)
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#090B0E] text-[#A0A7B0] border border-[#252B33] text-[10px]">
              48 Nodes Active
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-8 sm:grid-cols-12 xl:grid-cols-8 gap-1.5 my-2 p-2 bg-[#090B0E] rounded border border-[#252B33]">
            {Array.from({ length: 48 }).map((_, i) => {
              const num = (i + 1).toString().padStart(2, "0");
              const loads = [22, 34, 18, 64, 41, 28, 52, 72, 19, 44, 31, 83, 39, 25, 48, 14, 33, 58, 21, 37, 61, 29, 15, 46, 27, 30, 79, 12, 54, 38, 23, 68, 18, 42, 65, 21, 35, 51, 29, 16, 36, 49, 20, 57, 76, 32, 19, 24];
              const load = loads[i] || 25;
              const bgClass =
                load > 75
                  ? "bg-[#2A1E14] text-[#D9A441] border border-[#422C19]"
                  : load > 50
                  ? "bg-[#1B293D] text-[#5B8DEF] border border-[#243A59]"
                  : "bg-[#14181D] text-[#A0A7B0] border border-[#252B33]";
              return (
                <div
                  key={i}
                  className={`h-6 rounded ${bgClass} hover:border-[#5B8DEF] transition-colors cursor-pointer flex items-center justify-center text-[10px] font-mono`}
                  title={`node-${num}: ${load}%`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[#6F7782] text-[10px] pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#14181D] border border-[#252B33]" /> &lt; 25% Idle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#1B293D] border border-[#243A59]" /> 50% Optimal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#2A1E14] border border-[#422C19]" /> &gt; 75% Heavy
            </span>
          </div>
        </div>
      </section>

      {/* Real-Time Log Stream Viewer */}
      <section className="flex flex-col rounded-md bg-[#0F1216] border border-[#252B33] overflow-hidden font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#14181D] border-b border-[#252B33]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F2F4F7]">
              Real-Time Ingestion Logs
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#090B0E] text-[#43B581] border border-[#252B33]">
              STREAMING
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#090B0E] rounded px-2 py-1 border border-[#252B33] text-xs">
              <span className="text-[#6F7782] mr-2">SERVICE:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-transparent text-[#F2F4F7] focus:outline-none"
              >
                <option value="all" className="bg-[#090B0E]">ALL SERVICES (142)</option>
                <option value="api-gateway" className="bg-[#090B0E]">api-gateway</option>
                <option value="postgres" className="bg-[#090B0E]">postgres</option>
                <option value="redis" className="bg-[#090B0E]">redis</option>
                <option value="worker" className="bg-[#090B0E]">worker</option>
                <option value="auth-service" className="bg-[#090B0E]">auth-service</option>
                <option value="edge-proxy" className="bg-[#090B0E]">edge-proxy</option>
              </select>
            </div>

            <div className="flex items-center bg-[#090B0E] rounded p-0.5 border border-[#252B33]">
              {["ALL", "INFO", "WARN", "ERROR"].map((s) => (
                <button
                  key={s}
                  onClick={() => setLogSeverity(s)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    logSeverity === s
                      ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                      : "text-[#6F7782] hover:text-[#F2F4F7]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Monospace log list matching user specification */}
        <div className="p-3 bg-[#090B0E] flex flex-col gap-1 overflow-x-auto text-[11px]">
          {filteredLogs.map((item, i) => {
            const levelColor =
              item.level === "ERROR"
                ? "text-[#D95C5C]"
                : item.level === "WARN"
                ? "text-[#D9A441]"
                : "text-[#5B8DEF]";
            return (
              <div
                key={i}
                className="flex items-center gap-4 hover:bg-[#14181D] px-2 py-0.5 rounded transition-colors"
              >
                <span className="text-[#6F7782] select-none shrink-0">{item.time}</span>
                <span className={`${levelColor} font-semibold w-12 shrink-0`}>{item.level}</span>
                <span className="text-[#F2F4F7] w-28 shrink-0">{item.service}</span>
                <span className="text-[#A0A7B0] flex-1 truncate">{item.content}</span>
                <span className="text-[#6F7782] shrink-0">{item.duration}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Distributed Trace Waterfall */}
      <section className="flex flex-col p-4 rounded-md bg-[#0F1216] border border-[#252B33] font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252B33]">
          <div>
            <div className="text-xs font-semibold text-[#F2F4F7]">Distributed Trace Waterfall</div>
            <div className="text-[11px] text-[#6F7782]">
              Trace: <span className="text-[#5B8DEF]">#tr-8f2a1c0d-global-http</span> (Total: 8.8ms across 5 spans)
            </div>
          </div>
          <button className="px-3 py-1 rounded bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] border border-[#252B33] transition-colors">
            Export JSON
          </button>
        </div>

        <div className="flex flex-col gap-1.5 bg-[#090B0E] p-3 rounded mt-3 border border-[#252B33]">
          <div className="grid grid-cols-12 gap-2 text-[#6F7782] text-[10px] pb-1 border-b border-[#252B33]">
            <div className="col-span-4 uppercase">Service Span</div>
            <div className="col-span-8 flex justify-between">
              <span>0.0ms</span>
              <span>2.2ms</span>
              <span>4.4ms</span>
              <span>6.6ms</span>
              <span>8.8ms</span>
            </div>
          </div>

          {[
            { service: "Edge CDN", span: "us-east-edge-4", time: "8.8ms", left: "0%", width: "100%", color: "bg-[#5B8DEF]" },
            { service: "API Gateway", span: "envoy-ingress", time: "7.1ms", left: "8%", width: "80%", color: "bg-[#456BB8]" },
            { service: "Auth Service", span: "jwt-verify", time: "1.6ms", left: "14%", width: "18%", color: "bg-[#43B581]" },
            { service: "PostgreSQL", span: "cluster-replica", time: "2.1ms", left: "36%", width: "24%", color: "bg-[#5B8DEF]" },
            { service: "Buffer Out", span: "http2-stream", time: "2.1ms", left: "64%", width: "24%", color: "bg-[#A0A7B0]" },
          ].map((item) => (
            <div
              key={item.service}
              className="grid grid-cols-12 gap-2 items-center hover:bg-[#14181D] p-1 rounded transition-colors text-[11px]"
            >
              <div className="col-span-4 flex items-center gap-2 truncate">
                <span className="text-[#F2F4F7] font-medium">{item.service}</span>
                <span className="text-[#6F7782] text-[10px]">{item.span}</span>
              </div>
              <div className="col-span-8 relative h-5 bg-[#14181D] rounded flex items-center">
                <div
                  className={`absolute h-3.5 rounded flex items-center justify-end px-1.5 text-[10px] text-white font-medium ${item.color}`}
                  style={{ left: item.left, width: item.width }}
                >
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
