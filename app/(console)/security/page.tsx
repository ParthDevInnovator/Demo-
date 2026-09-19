'use client';

import React, { useState } from 'react';

interface ApiKeyItem {
  id: string;
  name: string;
  hash: string;
  scope: string;
  created: string;
  lastUsed: string;
  ipRestrictions: string;
  revoked?: boolean;
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 'k1',
    name: 'k8s-telemetry-collector',
    hash: 'nx_live_58c7••••••••••39ad',
    scope: 'metrics:write',
    created: '2025-01-14',
    lastUsed: 'Just now (12ms ago)',
    ipRestrictions: '10.0.0.0/16',
  },
  {
    id: 'k2',
    name: 'argocd-deployment-sync',
    hash: 'nx_prod_a912••••••••••77ef',
    scope: 'cluster:deploy',
    created: '2025-02-01',
    lastUsed: '18 mins ago',
    ipRestrictions: '172.16.4.0/24',
  },
  {
    id: 'k3',
    name: 'staging-ci-bot',
    hash: 'nx_stag_229f••••••••••bb41',
    scope: 'read:all, write:stage',
    created: '2024-11-20',
    lastUsed: '14 hours ago',
    ipRestrictions: 'Any (VPC Only)',
  },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'rbac' | 'keys' | 'secrets' | 'audit' | 'network'>('rbac');
  const [keyFilter, setKeyFilter] = useState('');
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [isRotating, setIsRotating] = useState(false);
  const [lockdownActive, setLockdownActive] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('metrics:write');
  const [drillRunning, setDrillRunning] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRevoke = (id: string, name: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, revoked: true } : k));
    showToast(`Token for '${name}' revoked successfully.`);
  };

  const handleRotateRootKeys = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      showToast('KMS Root Keys rotated successfully. New envelope shard active.');
    }, 1500);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyItem = {
      id: `k-${Date.now()}`,
      name: newKeyName.trim(),
      hash: `nx_${Math.random().toString(36).substring(2, 6)}••••••••••${Math.random().toString(36).substring(2, 6)}`,
      scope: newKeyScope,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      ipRestrictions: '10.0.0.0/16',
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowNewKeyModal(false);
    showToast(`API Token generated: ${newKey.name}`);
  };

  const handleRedTeamDrill = () => {
    setDrillRunning(true);
    showToast('Executing automated Red-Team sandbox drill across 12 regions...');
    setTimeout(() => {
      setDrillRunning(false);
      showToast('Drill complete: 0 vulnerabilities found, zero privilege escalations.');
    }, 2500);
  };

  const filteredKeys = keys.filter(k =>
    k.name.toLowerCase().includes(keyFilter.toLowerCase()) ||
    k.hash.toLowerCase().includes(keyFilter.toLowerCase()) ||
    k.scope.toLowerCase().includes(keyFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#14181D] border border-[#303741] text-[#F2F4F7] shadow-xl text-xs font-mono">
          <span className="material-symbols-outlined text-[#5B8DEF] text-sm">verified</span>
          <span>{notification}</span>
        </div>
      )}

      {/* TOP STATS & POSTURE HERO BANNER */}
      <section className="relative overflow-hidden rounded-lg bg-[#0F1216] border border-[#252B33] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#5B8DEF] uppercase tracking-wider px-2 py-0.5 rounded bg-[#131B2A] border border-[#1E3A6E]">
                Zero-Trust Shield Active
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#43B581]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]"></span>
                Enforcement Tier 1
              </span>
            </div>

            <h1 className="text-xl font-semibold text-[#F2F4F7] tracking-tight">
              Security &amp; Access Control
            </h1>
            <p className="text-xs text-[#A0A7B0] leading-relaxed">
              Real-time perimeter monitoring, role-delegated cryptographic governance, and immutable hardware-backed audit synchronization across 12 distributed regions.
            </p>

            {/* Compliance Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14181D] border border-[#252B33] text-[#A0A7B0] font-mono text-xs">
                <span className="material-symbols-outlined text-[#43B581] text-sm">verified_user</span>
                <span>SOC2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14181D] border border-[#252B33] text-[#A0A7B0] font-mono text-xs">
                <span className="material-symbols-outlined text-[#43B581] text-sm">lock</span>
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14181D] border border-[#252B33] text-[#A0A7B0] font-mono text-xs">
                <span className="material-symbols-outlined text-[#43B581] text-sm">health_and_safety</span>
                <span>HIPAA Ready</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14181D] border border-[#252B33] text-[#A0A7B0] font-mono text-xs">
                <span className="material-symbols-outlined text-[#43B581] text-sm">policy</span>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Posture Score & Direct Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-5 bg-[#090B0E] p-4 rounded-md border border-[#252B33]">
            {/* SVG Radial Gauge */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#252B33] fill-none"
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="5"
                  />
                  <circle
                    className="text-[#5B8DEF] fill-none transition-all duration-1000"
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeDasharray="264"
                    strokeDashoffset="5.28"
                    strokeLinecap="round"
                    strokeWidth="5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-[#F2F4F7]">98</span>
                  <span className="text-[10px] font-mono text-[#6F7782]">/100</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#43B581]">A+ Posture Grade</span>
                <span className="text-xs text-[#A0A7B0]">Zero Critical CVEs</span>
                <span className="text-[11px] text-[#6F7782] font-mono mt-0.5">Audit: #7f89c2</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => showToast('Compliance report downloaded: SOC2-ISO27001-2025Q1.pdf')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5B8DEF] hover:bg-[#729FF5] text-white text-xs font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-sm">file_download</span>
                <span>Generate Compliance Report</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleRotateRootKeys}
                  disabled={isRotating}
                  className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] border border-[#252B33] text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm text-[#A0A7B0] ${isRotating ? 'animate-spin' : ''}`}>
                    published_with_changes
                  </span>
                  <span>{isRotating ? 'Rotating...' : 'Rotate Keys'}</span>
                </button>
                <button
                  onClick={() => setShowNewKeyModal(true)}
                  className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#5B8DEF] border border-[#252B33] text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>New Key</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Matrix Tabs */}
        <div className="mt-5 pt-3 flex overflow-x-auto gap-2 no-scrollbar border-t border-[#252B33]">
          {[
            { id: 'rbac', label: 'Access Control (RBAC)', icon: 'admin_panel_settings' },
            { id: 'keys', label: 'API Keys & Tokens', icon: 'vpn_key' },
            { id: 'secrets', label: 'Secrets Vault', icon: 'enhanced_encryption' },
            { id: 'audit', label: 'Audit Trails', icon: 'receipt_long' },
            { id: 'network', label: 'Network Policies', icon: 'lan' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#131B2A] text-[#5B8DEF] border border-[#1E3A6E]'
                    : 'bg-transparent hover:bg-[#14181D] text-[#A0A7B0] hover:text-[#F2F4F7] border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* LIVE AUDIT LOGGING TERMINAL & HARDWARE VAULT STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Log Stream Terminal */}
        <div className="lg:col-span-8 flex flex-col rounded-lg bg-[#0F1216] border border-[#252B33] p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252B33]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D95C5C]/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#43B581]/60"></span>
              </div>
              <span className="text-xs font-mono text-[#F2F4F7] font-medium tracking-wider uppercase ml-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#5B8DEF]">terminal</span>
                Live Security Audit Feed // Immutable WORM
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6F7782]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]"></span>
              <span className="text-[#43B581]">MUTABLE: FALSE</span>
            </div>
          </div>

          {/* Monospace Stream */}
          <div className="bg-[#090B0E] border border-[#252B33] rounded p-3 flex flex-col gap-2 overflow-x-auto font-mono text-xs">
            <div className="flex items-start gap-3 text-[#F2F4F7] hover:bg-[#14181D]/40 py-1 rounded px-1.5 transition-colors">
              <span className="text-[#6F7782] select-none">[10:14:18]</span>
              <span className="text-[#5B8DEF] font-medium">admin@company.com</span>
              <span className="text-[#F2F4F7] flex-1 min-w-[240px]">Production deployment (v2.18.4)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px]">
                AUTHORIZED (2FA)
              </span>
            </div>
            <div className="flex items-start gap-3 text-[#F2F4F7] hover:bg-[#14181D]/40 py-1 rounded px-1.5 transition-colors">
              <span className="text-[#6F7782] select-none">[10:11:02]</span>
              <span className="text-[#5B8DEF] font-medium">dev@company.com</span>
              <span className="text-[#F2F4F7] flex-1 min-w-[240px]">API key created (Scope: read:telemetry)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px]">
                AUTHORIZED
              </span>
            </div>
            <div className="flex items-start gap-3 text-[#F2F4F7] hover:bg-[#14181D]/40 py-1 rounded px-1.5 transition-colors">
              <span className="text-[#6F7782] select-none">[09:58:44]</span>
              <span className="text-[#A0A7B0] font-medium">svc_deployer</span>
              <span className="text-[#F2F4F7] flex-1 min-w-[240px]">Secret rotated: DB_PRIMARY_CLUSTER_PASSWORD</span>
              <span className="px-1.5 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px]">
                AUTHORIZED
              </span>
            </div>
            <div className="flex items-start gap-3 bg-[#2A1315]/40 border border-[#441C20]/40 py-1 rounded px-1.5 transition-colors">
              <span className="text-[#6F7782] select-none">[09:12:30]</span>
              <span className="text-[#D95C5C] font-medium">198.51.100.42 (Unknown IP)</span>
              <span className="text-[#F2F4F7] flex-1 min-w-[240px]">SSH handshake payload rejection</span>
              <span className="px-1.5 py-0.5 rounded bg-[#2A1315] border border-[#441C20] text-[#D95C5C] font-mono text-[10px]">
                BLOCKED Geo-Fence
              </span>
            </div>
            <div className="flex items-start gap-3 text-[#F2F4F7] hover:bg-[#14181D]/40 py-1 rounded px-1.5 transition-colors">
              <span className="text-[#6F7782] select-none">[08:45:12]</span>
              <span className="text-[#43B581] font-medium">sec_scanner</span>
              <span className="text-[#F2F4F7] flex-1 min-w-[240px]">Vulnerability scan: 0 High, 0 Critical</span>
              <span className="px-1.5 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px]">
                PASSED
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#6F7782]">
            <span>SHA-256: e9b56f821...6a81</span>
            <button
              onClick={() => showToast('Exporting syslog to audit-2025-02.jsonl')}
              className="text-[#5B8DEF] hover:underline flex items-center gap-1"
            >
              <span>Export raw syslog (.jsonl)</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* KMS Hardware Security Vault Card */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-lg bg-[#0F1216] border border-[#252B33] p-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6F7782] uppercase tracking-wider">HSM Core</span>
              <span className="px-2 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px] font-medium">
                FIPS 140-2 LEVEL 3
              </span>
            </div>

            <h3 className="text-sm font-semibold text-[#F2F4F7]">KMS Secrets Vault</h3>
            <p className="text-xs text-[#A0A7B0] leading-relaxed">
              Hardware-rooted key management system. Automatic 30-day envelope rotation active on primary cluster shards.
            </p>

            <div className="my-2 p-3 rounded-md bg-[#090B0E] border border-[#252B33] flex flex-col gap-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#A0A7B0]">Algorithm:</span>
                <span className="text-[#5B8DEF] font-medium">AES-256-GCM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A7B0]">Rotation Cycle:</span>
                <span className="text-[#43B581]">Every 30 Days (Active)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A7B0]">Next Rotation:</span>
                <span className="text-[#F2F4F7]">In 4 Days, 11 Hours</span>
              </div>
              <div className="w-full bg-[#14181D] h-1 rounded overflow-hidden mt-1">
                <div className="bg-[#5B8DEF] h-full w-[86%] rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleRotateRootKeys}
              className="flex-1 py-1.5 px-3 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] border border-[#252B33] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Force Re-encrypt</span>
            </button>
            <button
              onClick={() => showToast('KMS Vault Hardware Config: Primary HSM active (HSM-US-EAST-01)')}
              className="p-1.5 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#A0A7B0] hover:text-[#F2F4F7] border border-[#252B33] transition-colors"
              title="Vault Config"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE API KEYS & SECRET MANAGERS */}
      <section className="flex flex-col gap-4 rounded-lg bg-[#0F1216] border border-[#252B33] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#F2F4F7]">Active API Keys &amp; Credentials</h2>
            <p className="text-xs text-[#A0A7B0]">Active bearer credentials authenticated via IAM mesh with IP fencing constraints.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
              className="bg-[#090B0E] text-[#F2F4F7] placeholder-[#6F7782] text-xs px-3 py-1.5 rounded-md border border-[#252B33] focus:outline-none focus:border-[#5B8DEF]"
              placeholder="Filter by prefix..."
              type="text"
            />
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5B8DEF] hover:bg-[#729FF5] text-white text-xs font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-sm">key</span>
              <span>Generate Token</span>
            </button>
          </div>
        </div>

        {/* API Table */}
        <div className="overflow-x-auto border border-[#252B33] rounded-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#14181D] text-[#6F7782] font-mono text-[11px] uppercase tracking-wider border-b border-[#252B33]">
                <th className="py-2.5 px-3">Identifier &amp; Hash</th>
                <th className="py-2.5 px-3">Role Scope</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Last Used</th>
                <th className="py-2.5 px-3">IP Restrictions</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B33]">
              {filteredKeys.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-[#14181D]/50 transition-colors ${item.revoked ? 'opacity-40 line-through' : ''}`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#5B8DEF] text-base">token</span>
                      <div>
                        <div className="text-xs text-[#F2F4F7] font-medium">{item.name}</div>
                        <div className="text-[11px] text-[#6F7782] font-mono">{item.hash}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#14181D] border border-[#252B33] text-[#A0A7B0] text-[11px] font-mono">
                      {item.scope}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#A0A7B0] font-mono">
                    {item.created}
                  </td>
                  <td className="py-3 px-3 text-xs text-[#43B581] font-mono">
                    {item.lastUsed}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#090B0E] border border-[#252B33] text-[#A0A7B0] text-[11px] font-mono">
                      {item.ipRestrictions}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.revoked ? (
                      <span className="text-[11px] text-[#6F7782] font-mono">REVOKED</span>
                    ) : (
                      <button
                        onClick={() => handleRevoke(item.id, item.name)}
                        className="px-2.5 py-1 rounded bg-[#2A1315] hover:bg-[#3D1A1F] text-[#D95C5C] border border-[#441C20] text-[11px] font-medium transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ZERO-TRUST RBAC MATRIX & NETWORK PEERING ALLOWLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Role-Based Access Matrix */}
        <div className="lg:col-span-7 flex flex-col rounded-lg bg-[#0F1216] border border-[#252B33] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F2F4F7]">Role-Based Access Matrix (RBAC)</h2>
              <p className="text-xs text-[#A0A7B0]">Granular privilege segmentation across operational vectors.</p>
            </div>
            <button
              onClick={() => showToast('Audit scan complete: 100% role-based permissions aligned with IAM policy.')}
              className="px-2.5 py-1 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] border border-[#252B33] text-xs font-medium transition-colors"
            >
              Audit Roles
            </button>
          </div>

          <div className="overflow-x-auto border border-[#252B33] rounded-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14181D] text-[#6F7782] font-mono text-[11px] border-b border-[#252B33]">
                  <th className="py-2 px-3">Role Tier</th>
                  <th className="py-2 px-2 text-center">DNS/Mesh</th>
                  <th className="py-2 px-2 text-center">Prod Deploy</th>
                  <th className="py-2 px-2 text-center">DB Root</th>
                  <th className="py-2 px-2 text-center">Audit Logs</th>
                  <th className="py-2 px-2 text-center">Revocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252B33] font-mono text-xs">
                <tr className="hover:bg-[#14181D]/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#F2F4F7] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B8DEF]"></span>
                    Owner
                  </td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                </tr>
                <tr className="hover:bg-[#14181D]/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#F2F4F7] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B8DEF]"></span>
                    Admin
                  </td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                </tr>
                <tr className="hover:bg-[#14181D]/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-[#A0A7B0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6F7782]"></span>
                    Developer
                  </td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                </tr>
                <tr className="hover:bg-[#14181D]/50 transition-colors">
                  <td className="py-2.5 px-3 font-normal text-[#6F7782] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#252B33]"></span>
                    Viewer
                  </td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                </tr>
                <tr className="hover:bg-[#14181D]/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#43B581] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43B581]"></span>
                    Service Account
                  </td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="material-symbols-outlined text-[#43B581] text-sm">check</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                  <td className="text-center py-2.5"><span className="text-[#303741] font-sans">—</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IP Allowlist & VPC Peering */}
        <div className="lg:col-span-5 flex flex-col rounded-lg bg-[#0F1216] border border-[#252B33] p-5 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#F2F4F7]">Network Perimeter</h2>
              <span className="px-2 py-0.5 rounded bg-[#13241B] border border-[#1A3828] text-[#43B581] font-mono text-[10px] font-medium">
                100% ISOLATED
              </span>
            </div>
            <p className="text-xs text-[#A0A7B0]">Zero-Trust geo-fenced ingress filters and VPC peer conduits.</p>

            {/* Peer list */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between p-3 rounded-md bg-[#090B0E] border border-[#252B33]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#5B8DEF] text-base">hub</span>
                  <div>
                    <div className="text-xs font-medium text-[#F2F4F7]">vpc-peer-us-east-1</div>
                    <div className="text-[11px] text-[#6F7782] font-mono">10.100.0.0/16 · AWS DirectConnect</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#43B581]">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-[#090B0E] border border-[#252B33]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#5B8DEF] text-base">hub</span>
                  <div>
                    <div className="text-xs font-medium text-[#F2F4F7]">vpc-peer-eu-west-1</div>
                    <div className="text-[11px] text-[#6F7782] font-mono">10.200.0.0/16 · Cloudflare Magic WAN</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#43B581]">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-[#090B0E] border border-[#252B33]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#6F7782] text-base">shield</span>
                  <div>
                    <div className="text-xs font-medium text-[#F2F4F7]">Corporate Gateway Allowlist</div>
                    <div className="text-[11px] text-[#6F7782] font-mono">6 CIDR ranges allowed</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#A0A7B0]">ENFORCED</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 flex items-center justify-between border-t border-[#252B33]">
            <span className="text-[11px] font-mono text-[#6F7782]">mTLS: TLS 1.3 Strict</span>
            <button
              onClick={() => showToast('CIDR rule modal opened')}
              className="px-2.5 py-1 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#5B8DEF] border border-[#252B33] text-xs font-medium transition-colors"
            >
              + Add CIDR Rule
            </button>
          </div>
        </div>
      </div>

      {/* SRE SECURITY DRILL DISPATCH FOOTER STRIP */}
      <section className="rounded-lg bg-[#0F1216] border border-[#252B33] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#131B2A] border border-[#1E3A6E] flex items-center justify-center text-[#5B8DEF]">
            <span className="material-symbols-outlined text-lg">security_update_good</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#F2F4F7]">Automated Threat Mitigation Active</span>
            <span className="text-xs text-[#A0A7B0]">
              All perimeter vectors continuously audited against CIS Kubernetes Benchmarks v1.8.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRedTeamDrill}
            disabled={drillRunning}
            className="flex-1 md:flex-none px-3 py-1.5 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#F2F4F7] border border-[#252B33] text-xs font-medium transition-colors disabled:opacity-50"
          >
            {drillRunning ? 'Executing Drill...' : 'Run Red-Team Sandbox Drill'}
          </button>
          <button
            onClick={() => {
              setLockdownActive(!lockdownActive);
              showToast(lockdownActive ? 'Perimeter lockdown lifted.' : 'CRITICAL: Perimeter lockdown ENGAGED. All ingress gated.');
            }}
            className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              lockdownActive
                ? 'bg-[#2A1315] text-[#D95C5C] border border-[#441C20]'
                : 'bg-[#5B8DEF] hover:bg-[#729FF5] text-white'
            }`}
          >
            {lockdownActive ? 'Lift Lockdown' : 'Lockdown Perimeter'}
          </button>
        </div>
      </section>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F1216] border border-[#303741] rounded-lg p-5 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5B8DEF] text-base">vpn_key</span>
                <h3 className="text-sm font-semibold text-[#F2F4F7]">Generate API Token</h3>
              </div>
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="text-[#6F7782] hover:text-[#F2F4F7] p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#A0A7B0]">Key Identifier / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. k8s-argo-sync-agent"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-[#090B0E] text-[#F2F4F7] px-3 py-1.5 rounded-md border border-[#252B33] text-xs focus:outline-none focus:border-[#5B8DEF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#A0A7B0]">Role Scope</label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="bg-[#090B0E] text-[#F2F4F7] px-3 py-1.5 rounded-md border border-[#252B33] text-xs focus:outline-none focus:border-[#5B8DEF]"
                >
                  <option value="metrics:write">metrics:write</option>
                  <option value="cluster:deploy">cluster:deploy</option>
                  <option value="read:all, write:stage">read:all, write:stage</option>
                  <option value="admin:full">admin:full</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewKeyModal(false)}
                  className="px-3 py-1.5 rounded-md bg-[#14181D] hover:bg-[#191E24] text-[#A0A7B0] border border-[#252B33] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-[#5B8DEF] hover:bg-[#729FF5] text-white text-xs font-medium"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
