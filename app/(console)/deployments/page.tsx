"use client";

import React, { useState } from "react";

export default function DeploymentsPage() {
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedEnvFilter, setSelectedEnvFilter] = useState("All Envs");
  const [deployNotification, setDeployNotification] = useState<string | null>(null);

  const deployments = [
    {
      id: "rel_01J8F9",
      service: "nexus-core-api",
      branch: "main",
      message: "feat: optimize API caching and distributed lock",
      author: "Alex Chen",
      env: "Production",
      strategy: "Canary (100%)",
      status: "Success ● Live",
      statusColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      duration: "1m 42s",
      timeAgo: "2 mins ago",
    },
    {
      id: "rel_01J8E4",
      service: "auth-matrix-service",
      branch: "main",
      message: "fix: session expiry token leak on rotation",
      author: "Sarah Jenkins",
      env: "Production",
      strategy: "Blue/Green",
      status: "Success ● Live",
      statusColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      duration: "2m 14s",
      timeAgo: "14 mins ago",
    },
    {
      id: "rel_01J8D1",
      service: "telemetry-collector",
      branch: "staging",
      message: "chore: update opentelemetry sdk v1.28",
      author: "David K",
      env: "Staging",
      strategy: "Rolling",
      status: "Success",
      statusColor: "text-[#5B8DEF] bg-[#131B2A] border border-[#1E3A6E]",
      duration: "48s",
      timeAgo: "1h ago",
    },
    {
      id: "rel_01J8C2",
      service: "billing-stripe-worker",
      branch: "main",
      message: "fix: webhook retry idempotency lock",
      author: "Marcus Vance",
      env: "Production",
      strategy: "Canary (100%)",
      status: "Success ● Live",
      statusColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      duration: "1m 05s",
      timeAgo: "3h ago",
    },
  ];

  const triggerDeploy = () => {
    setDeployNotification("Pipeline #PIPE-8842 triggered. Compiling container artifacts...");
    setTimeout(() => {
      setDeployNotification(null);
    }, 3500);
  };

  const filteredDeploys = deployments.filter((d) => {
    if (selectedEnvFilter === "All Envs") return true;
    if (selectedEnvFilter === "Canary Only") return d.strategy.includes("Canary");
    return d.env === selectedEnvFilter;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="console-enter console-delay-0 flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#252B33]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#6F7782]">
            <span className="text-[#5B8DEF] font-medium uppercase">Continuous Delivery Engine</span>
            <span>/</span>
            <span>v4.18-rollout-mesh</span>
            <span>/</span>
            <span className="text-[#43B581] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" />
              GitOps In Sync
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl text-[#F2F4F7] tracking-tight font-semibold">
            Deployment Pipelines
          </h1>
          <p className="text-xs text-[#A0A7B0]">
            Zero-downtime canary deployments, blue-green cutovers, and automated GitOps rollouts.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <button
            onClick={() => setShowRollbackModal(true)}
            className="px-3 py-1.5 rounded bg-[#14181D] hover:bg-[#191E24] text-[#D95C5C] text-xs font-medium border border-[#252B33] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            <span>Rollback</span>
          </button>
          <button
            onClick={triggerDeploy}
            className="px-3.5 py-1.5 rounded bg-[#5B8DEF] hover:bg-[#729FF5] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            <span>Trigger Deploy</span>
          </button>
        </div>
      </div>

      {deployNotification && (
        <div className="p-3 rounded-md bg-[#0F1216] text-[#F2F4F7] border border-[#5B8DEF] font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
          <span>{deployNotification}</span>
        </div>
      )}

      {/* Horizontal Pipeline Stages Card */}
      <div className="rounded-md bg-[#0F1216] p-4 border border-[#252B33] flex flex-col gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#252B33]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#43B581]" />
            <span className="text-xs font-semibold text-[#F2F4F7]">
              Active Pipeline: <span className="text-[#5B8DEF]">nexus-core-api</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#090B0E] text-[#6F7782] border border-[#252B33]">
              #PIPE-8841
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#6F7782] text-[11px]">
            <span>Duration: <strong className="text-[#F2F4F7]">1m 42s</strong></span>
            <span>Target: <strong className="text-[#43B581]">&lt; 3m SLA</strong></span>
          </div>
        </div>

        {/* 6-Stage Timeline as requested: Build ✓, Tests ✓, Security Scan ✓, Canary ✓, Global Sync ✓, Production ✓ */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
          {[
            { stage: "Build", desc: "Docker OCI 38s", status: "✓", state: "complete" },
            { stage: "Tests", desc: "142 suites 28s", status: "✓", state: "complete" },
            { stage: "Security Scan", desc: "0 CVEs found 14s", status: "✓", state: "complete" },
            { stage: "Canary", desc: "10% verification", status: "✓", state: "complete" },
            { stage: "Global Sync", desc: "12 regions synced", status: "✓", state: "complete" },
            { stage: "Production", desc: "100% live cutover", status: "✓", state: "active" },
          ].map((item) => (
            <div
              key={item.stage}
              className={`p-3 rounded-md flex flex-col gap-1 border ${
                item.state === "active"
                  ? "bg-[#131B2A] border-[#5B8DEF] text-[#F2F4F7]"
                  : "bg-[#090B0E] border-[#252B33] text-[#A0A7B0]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F2F4F7]">{item.stage}</span>
                <span className="text-[#43B581] font-bold">{item.status}</span>
              </div>
              <span className="text-[10px] text-[#6F7782]">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Telemetry Bar below pipeline */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-[#090B0E] border border-[#252B33] text-[11px] text-[#6F7782]">
          <div className="flex items-center gap-3">
            <span className="text-[#F2F4F7]">Envoy Mesh: Active</span>
            <span>|</span>
            <span>Error Rate: <strong className="text-[#43B581]">0.001%</strong></span>
            <span>|</span>
            <span>P99: <strong className="text-[#5B8DEF]">18.4ms</strong></span>
          </div>
          <span>Cluster: <strong className="text-[#F2F4F7]">us-east-prod-eks-01</strong></span>
        </div>
      </div>

      {/* Recent Deployments Audit Table */}
      <div className="flex flex-col gap-3 rounded-md bg-[#0F1216] p-4 border border-[#252B33] font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#252B33]">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[#F2F4F7]">Recent Deployments Audit</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#090B0E] text-[#6F7782] border border-[#252B33]">
              {filteredDeploys.length} releases logged
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1">
            {["All Envs", "Production", "Staging", "Canary Only"].map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnvFilter(env)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedEnvFilter === env
                    ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                    : "text-[#6F7782] hover:text-[#F2F4F7]"
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-[#6F7782] uppercase bg-[#090B0E] border-b border-[#252B33]">
                <th className="py-2.5 px-3">Release ID</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Commit</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Env</th>
                <th className="py-2.5 px-3">Strategy</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Deployed</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B33]">
              {filteredDeploys.map((dep) => (
                <tr key={dep.id} className="hover:bg-[#14181D] transition-colors">
                  <td className="py-2.5 px-3 text-[#5B8DEF] font-medium">{dep.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#F2F4F7]">{dep.service}</td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-[#A0A7B0]">
                    <span className="text-[#6F7782] mr-1">{dep.branch}:</span>
                    {dep.message}
                  </td>
                  <td className="py-2.5 px-3 text-[#6F7782]">{dep.author}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-[#090B0E] text-[#A0A7B0] border border-[#252B33] text-[10px]">
                      {dep.env}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#A0A7B0]">{dep.strategy}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${dep.statusColor}`}>
                      {dep.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#6F7782]">{dep.duration}</td>
                  <td className="py-2.5 px-3 text-[#6F7782]">{dep.timeAgo}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setShowRollbackModal(true)}
                      className="text-xs text-[#D95C5C] hover:underline"
                    >
                      Rollback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rollback Modal */}
      {showRollbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 font-mono">
          <div className="w-full max-w-md bg-[#0F1216] rounded-md p-5 border border-[#252B33] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#252B33]">
              <span className="text-xs text-[#D95C5C] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">warning</span> Confirm Rollback
              </span>
              <button
                onClick={() => setShowRollbackModal(false)}
                className="text-[#6F7782] hover:text-[#F2F4F7] text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#A0A7B0] leading-relaxed">
              Rollback to previous stable release (<code className="text-[#F2F4F7]">#rel_01J8E4</code>)?
              Traffic will cut over immediately via Envoy mesh with zero downtime.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#252B33]">
              <button
                onClick={() => setShowRollbackModal(false)}
                className="px-3 py-1 rounded bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] text-xs border border-[#252B33] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRollbackModal(false);
                  setDeployNotification("Rollback executed. Traffic redirected to #rel_01J8E4.");
                  setTimeout(() => setDeployNotification(null), 3500);
                }}
                className="px-3 py-1 rounded bg-[#D95C5C] hover:bg-[#D95C5C]/80 text-white text-xs font-medium transition-colors"
              >
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
