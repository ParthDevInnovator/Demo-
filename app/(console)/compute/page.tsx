"use client";

import React, { useState } from "react";

export default function ComputeFleetPage() {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedType, setSelectedType] = useState("Compute Opt");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("k8s-prod-us-east-1");

  const nodes = [
    {
      id: "k8s-prod-us-east-1",
      clusterId: "k8s-cluster-0x892a4",
      type: "K8s Cluster",
      region: "us-east-1a",
      arch: "K8s v1.29.2 · 24 Nodes",
      state: "Healthy",
      stateColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      cpuPct: 42.4,
      cpuRatio: "192/384",
      cpuBarColor: "bg-[#5B8DEF]",
      memPct: 68.1,
      memRatio: "1.04 TB",
      memBarColor: "bg-[#A0A7B0]",
      cost: "$1.420 / hr",
      sla: "99.99% SLA",
      icon: "hub",
    },
    {
      id: "api-worker-c6g-4xlarge",
      clusterId: "i-0e8df991a0b3e4",
      type: "Compute Opt",
      region: "eu-central-1b",
      arch: "c6g.4xlarge · Graviton3",
      state: "Active",
      stateColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      cpuPct: 88.9,
      cpuRatio: "14/16",
      cpuBarColor: "bg-[#D9A441]",
      memPct: 45.0,
      memRatio: "14.4 GB",
      memBarColor: "bg-[#5B8DEF]",
      cost: "$0.544 / hr",
      sla: "Up 44d 12h",
      icon: "memory",
    },
    {
      id: "ml-inference-g5-2xlarge",
      clusterId: "i-0a2b774cc981",
      type: "GPU Accelerated",
      region: "us-east-1d",
      arch: "g5.2xlarge · NVIDIA A10G",
      state: "Active",
      stateColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      cpuPct: 94.2,
      cpuRatio: "8 vCPU",
      cpuBarColor: "bg-[#5B8DEF]",
      memPct: 98.0,
      memRatio: "24 GB VRAM",
      memBarColor: "bg-[#D9A441]",
      cost: "$1.212 / hr",
      sla: "Up 12d 08h",
      isGpu: true,
      icon: "neurology",
    },
    {
      id: "redis-sentinel-01",
      clusterId: "r6g.xlarge",
      type: "Mem Opt",
      region: "ap-south-1a",
      arch: "In-Memory Store",
      state: "Optimal",
      stateColor: "text-[#43B581] bg-[#13241B] border border-[#1A3828]",
      cpuPct: 18.4,
      cpuRatio: "4 vCPU",
      cpuBarColor: "bg-[#5B8DEF]",
      memPct: 82.3,
      memRatio: "26.3 GB",
      memBarColor: "bg-[#A0A7B0]",
      cost: "$0.201 / hr",
      sla: "Up 190d",
      icon: "database",
    },
    {
      id: "edge-gateway-eu-04",
      clusterId: "c7i.2xlarge",
      type: "Compute Opt",
      region: "eu-central-1a",
      arch: "Intel Xeon Scalable",
      state: "Provisioning",
      stateColor: "text-[#5B8DEF] bg-[#131B2A] border border-[#1E3A6E]",
      cpuPct: 12.0,
      cpuRatio: "2/8",
      cpuBarColor: "bg-[#5B8DEF]",
      memPct: 15.0,
      memRatio: "4.8 GB",
      memBarColor: "bg-[#5B8DEF]",
      cost: "$0.380 / hr",
      sla: "Warming up",
      icon: "sync",
    },
  ];

  const filteredNodes = nodes.filter((n) => {
    if (selectedRegion !== "All Regions" && !n.region.startsWith(selectedRegion)) {
      return false;
    }
    if (searchQuery && !n.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header Banner */}
      <div className="w-full rounded-md bg-[#0F1216] p-5 border border-[#252B33]">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-[#191E24] text-[#F2F4F7] font-medium border border-[#252B33]">
                Orchestration Core
              </span>
              <span className="text-[#6F7782] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" />
                Fleet Auto-balancing Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl text-[#F2F4F7] tracking-tight font-semibold">
              Compute &amp; Cluster Fleet
            </h1>
            <p className="text-xs text-[#A0A7B0]">
              Manage bare-metal instances, distributed container runtimes, and managed Kubernetes
              clusters across tier-1 edge regions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setBatchMenuOpen(!batchMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] text-xs font-medium border border-[#252B33] transition-colors"
              >
                <span>Batch Actions</span>
                <span className="material-symbols-outlined text-sm text-[#6F7782]">expand_more</span>
              </button>
              {batchMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-md bg-[#14181D] shadow-xl p-1 z-30 flex flex-col gap-0.5 border border-[#252B33] font-mono text-xs">
                  <button className="w-full text-left px-2.5 py-1.5 rounded text-[#F2F4F7] hover:bg-[#191E24]">
                    Rolling Reboot
                  </button>
                  <button className="w-full text-left px-2.5 py-1.5 rounded text-[#F2F4F7] hover:bg-[#191E24]">
                    Bulk AMI Patch
                  </button>
                  <button className="w-full text-left px-2.5 py-1.5 rounded text-[#D95C5C] hover:bg-[#191E24]">
                    Cordon Nodes
                  </button>
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] text-xs font-medium border border-[#252B33] transition-colors">
              <span className="material-symbols-outlined text-sm">hub</span>
              <span>+ Provision K8s</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#5B8DEF] hover:bg-[#729FF5] text-white text-xs font-medium transition-colors">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Deploy Instance</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metric Row */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs pt-4 border-t border-[#252B33]">
          <div className="p-3 rounded bg-[#090B0E] border border-[#252B33] flex flex-col justify-between">
            <span className="text-[11px] text-[#6F7782]">RUNNING INSTANCES</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F7]">142</span>
              <span className="text-xs text-[#6F7782]">/ 148 CAP</span>
            </div>
            <span className="text-[10px] text-[#43B581]">+6 this hr</span>
          </div>

          <div className="p-3 rounded bg-[#090B0E] border border-[#252B33] flex flex-col justify-between">
            <span className="text-[11px] text-[#6F7782]">ACTIVE CLUSTERS</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F7]">4</span>
              <span className="text-xs text-[#6F7782]">Pools</span>
            </div>
            <span className="text-[10px] text-[#A0A7B0]">K8s v1.29</span>
          </div>

          <div className="p-3 rounded bg-[#090B0E] border border-[#252B33] flex flex-col justify-between">
            <span className="text-[11px] text-[#6F7782]">FLEET ALLOCATION</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F7]">1,136</span>
              <span className="text-xs text-[#6F7782]">vCPUs</span>
            </div>
            <div className="w-full bg-[#191E24] h-1 rounded overflow-hidden">
              <div className="bg-[#5B8DEF] h-full w-[74%]" />
            </div>
          </div>

          <div className="p-3 rounded bg-[#090B0E] border border-[#252B33] flex flex-col justify-between">
            <span className="text-[11px] text-[#6F7782]">PROVISIONED RAM</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F7]">4.5</span>
              <span className="text-xs text-[#6F7782]">TB</span>
            </div>
            <div className="w-full bg-[#191E24] h-1 rounded overflow-hidden">
              <div className="bg-[#A0A7B0] h-full w-[61%]" />
            </div>
          </div>

          <div className="p-3 rounded bg-[#090B0E] border border-[#252B33] flex flex-col justify-between">
            <span className="text-[11px] text-[#6F7782]">RUN RATE</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F7]">$4,280</span>
              <span className="text-xs text-[#6F7782]">/mo</span>
            </div>
            <span className="text-[10px] text-[#43B581]">$5.86/hr spot</span>
          </div>
        </div>
      </div>

      {/* Main Filter Strip */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-[#0F1216] p-3 rounded-md border border-[#252B33]">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6F7782] text-sm">
              filter_alt
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090B0E] text-[#F2F4F7] placeholder:text-[#6F7782] text-xs font-mono pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-[#5B8DEF] border border-[#252B33]"
              placeholder="Filter by fleet ID, tag, CIDR..."
              type="text"
            />
          </div>

          {/* Region Filter */}
          <div className="flex items-center bg-[#090B0E] rounded p-0.5 border border-[#252B33] font-mono text-xs">
            {["All Regions", "us-east-1", "eu-central-1", "ap-south-1"].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedRegion === reg
                    ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                    : "text-[#6F7782] hover:text-[#F2F4F7]"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="hidden sm:flex items-center bg-[#090B0E] rounded p-0.5 border border-[#252B33] font-mono text-xs">
            {["Compute Opt", "Mem Opt", "GPU Accelerated"].map((typ) => (
              <button
                key={typ}
                onClick={() => setSelectedType(typ)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedType === typ
                    ? "bg-[#252B33] text-[#F2F4F7] font-medium"
                    : "text-[#6F7782] hover:text-[#F2F4F7]"
                }`}
              >
                {typ}
              </button>
            ))}
          </div>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-3 font-mono text-xs text-[#A0A7B0]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]" /> 138 Running
          </span>
          <span className="text-[#252B33]">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B8DEF]" /> 3 Deploying
          </span>
          <span className="text-[#252B33]">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D95C5C]" /> 1 Faulted
          </span>
        </div>
      </div>

      {/* Fleet Table & Inspection Split */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-4 items-start">
        {/* Table (Span 8) */}
        <div className="2xl:col-span-8 overflow-x-auto rounded-md bg-[#0F1216] border border-[#252B33]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#090B0E] text-[11px] text-[#6F7782] uppercase border-b border-[#252B33]">
                <th className="py-2.5 px-3">Identifier / Topology</th>
                <th className="py-2.5 px-3">AZ / Arch</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">vCPU</th>
                <th className="py-2.5 px-3">Memory</th>
                <th className="py-2.5 px-3">Cost / SLA</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B33]">
              {filteredNodes.map((node) => {
                const isSelected = selectedRow === node.id;
                return (
                  <tr
                    key={node.id}
                    onClick={() => setSelectedRow(node.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#131B2A] border-l-2 border-[#5B8DEF]"
                        : "hover:bg-[#14181D]"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5B8DEF] text-base">
                          {node.icon}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-[#F2F4F7] flex items-center gap-1.5">
                            {node.id}
                            {node.isGpu && (
                              <span className="text-[10px] px-1 rounded bg-[#191E24] text-[#D9A441] border border-[#252B33]">
                                GPU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#6F7782]">{node.clusterId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-xs text-[#F2F4F7]">{node.region}</div>
                      <div className="text-[11px] text-[#6F7782]">{node.arch}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${node.stateColor}`}>
                        {node.state}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] text-[#6F7782] mb-0.5">
                          <span>{node.cpuPct}%</span>
                          <span>{node.cpuRatio}</span>
                        </div>
                        <div className="w-full h-1 rounded bg-[#191E24] overflow-hidden">
                          <div className={`h-full ${node.cpuBarColor}`} style={{ width: `${node.cpuPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] text-[#6F7782] mb-0.5">
                          <span>{node.memPct}%</span>
                          <span>{node.memRatio}</span>
                        </div>
                        <div className="w-full h-1 rounded bg-[#191E24] overflow-hidden">
                          <div className={`h-full ${node.memBarColor}`} style={{ width: `${node.memPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-xs text-[#F2F4F7]">{node.cost}</div>
                      <div className="text-[11px] text-[#43B581]">{node.sla}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-xs text-[#5B8DEF] hover:underline">Inspect</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Node Inspection (Span 4) */}
        <div className="2xl:col-span-4 rounded-md bg-[#0F1216] p-4 border border-[#252B33] flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#252B33]">
            <span className="text-xs font-semibold text-[#F2F4F7]">Node Inspection</span>
            <span className="text-[10px] text-[#43B581] px-1.5 py-0.5 rounded bg-[#13241B] border border-[#1A3828]">
              LIVE
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#F2F4F7] font-semibold">{selectedRow}</span>
            <span className="text-[11px] text-[#6F7782]">
              Runtime: containerd://v1.7.13 · Kernel: 6.8.0-45-generic
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#090B0E] p-2.5 rounded border border-[#252B33]">
            <div>
              <span className="text-[10px] text-[#6F7782] block">Ingress IP</span>
              <span className="text-xs text-[#F2F4F7]">198.51.100.14</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6F7782] block">VPC Subnet</span>
              <span className="text-xs text-[#F2F4F7]">subnet-0a42fbc1</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6F7782] block">IAM Profile</span>
              <span className="text-xs text-[#F2F4F7]">ClusterNodeRole</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6F7782] block">Auto-Healing</span>
              <span className="text-xs text-[#43B581]">ENABLED (5s)</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#252B33]">
            <button className="flex-1 py-1.5 rounded bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] text-xs border border-[#252B33] transition-colors">
              Restart Pods
            </button>
            <button className="flex-1 py-1.5 rounded bg-[#14181D] hover:bg-[#191E24] text-[#D95C5C] text-xs border border-[#252B33] transition-colors">
              Drain Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
