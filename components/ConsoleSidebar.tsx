"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NexusLogo from "./NexusLogo";

function SignOutButton() {
  const router = useRouter();
  const handleSignOut = () => {
    localStorage.removeItem("nexus_user");
    router.push("/signin");
  };
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1 text-xs font-medium transition-colors"
      style={{ color: '#6B7585' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E05C5C'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6B7585'; }}
      title="Sign Out"
    >
      <span className="material-symbols-outlined text-sm">logout</span>
      Sign Out
    </button>
  );
}

export default function ConsoleSidebar() {
  const pathname = usePathname();

  const controlVectors = [
    { name: "Overview", href: "/dashboard", icon: "grid_view", badge: "LIVE" },
    { name: "Compute", href: "/compute", icon: "developer_board", badge: "148" },
    { name: "Deployments", href: "/deployments", icon: "rocket_launch", badge: "SYNC" },
    { name: "Observability", href: "/observability", icon: "insights" },
    { name: "Security", href: "/security", icon: "shield_lock", badge: "OK" },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col justify-between"
      style={{
        background: '#070A0D',
        borderRight: '1px solid rgba(30,38,48,0.8)',
      }}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div
          className="h-14 px-4 flex items-center justify-between"
          style={{
            background: 'rgba(13,17,23,0.9)',
            borderBottom: '1px solid rgba(30,38,48,0.8)',
          }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <NexusLogo className="h-6 w-auto object-contain" />
            <span
              className="text-sm font-bold tracking-tight text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              NEXUS
            </span>
          </Link>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(61,214,140,0.1)',
              border: '1px solid rgba(61,214,140,0.2)',
              color: '#3DD68C',
            }}
          >
            PROD
          </span>
        </div>

        {/* Cluster Switcher */}
        <div className="p-3">
          <button
            className="w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left group"
            style={{
              background: '#0D1117',
              border: '1px solid rgba(30,38,48,0.9)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#131920'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0D1117'; }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: '#3DD68C', boxShadow: '0 0 0 3px rgba(61,214,140,0.15)' }}
              />
              <div className="truncate">
                <div className="text-xs text-white truncate font-semibold">Acme Enterprise</div>
                <div className="text-[10px] truncate font-mono" style={{ color: '#6B7585' }}>prod-cluster-us-east</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-base" style={{ color: '#4B5568' }}>unfold_more</span>
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-2 pb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#4B5568' }}>
            Control Plane
          </span>
        </div>

        {/* Nav Items */}
        <nav className="px-2 flex flex-col gap-0.5">
          {controlVectors.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 text-xs rounded-xl transition-all"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(75,127,239,0.15) 0%, rgba(53,96,190,0.1) 100%)',
                        border: '1px solid rgba(75,127,239,0.25)',
                        color: 'white',
                      }
                    : {
                        color: '#6B7585',
                        border: '1px solid transparent',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#0D1117';
                    (e.currentTarget as HTMLElement).style.color = '#F0F4FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#6B7585';
                  }
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ color: isActive ? '#6B9AF8' : '#4B5568' }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-xs">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold"
                    style={
                      isActive
                        ? { background: 'rgba(75,127,239,0.2)', color: '#6B9AF8' }
                        : { background: '#131920', color: '#4B5568' }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        className="p-3 flex flex-col gap-2"
        style={{ background: '#0D1117', borderTop: '1px solid rgba(30,38,48,0.8)' }}
      >
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="flex items-center gap-1 text-[10px] font-mono transition-colors"
            style={{ color: '#4B5568' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#9BA5B4'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#4B5568'; }}
          >
            <span className="material-symbols-outlined text-xs">home</span>
            Home
          </Link>
          <SignOutButton />
        </div>
        <div
          className="flex items-center justify-between p-2.5 rounded-xl"
          style={{ background: '#131920', border: '1px solid rgba(30,38,48,0.8)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Alex Chen"
              className="w-7 h-7 rounded-full object-cover"
              style={{ border: '2px solid rgba(75,127,239,0.25)' }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-CjXKdZbnNbaH2LWr58rRTINpzfnXWHDsltVDP6Nl40Ip3TMrvhyydDWURtLI-D2nQ9Kl79RZp3EjDNq2YlI1-0z7WJNZlBiA2IfEofXWj1JSjcre1uB5fXA2QOEFfXnyoo4Z-LSx_W043f3I3DJx6hdr25lhaJkO45EjHKA2CPCuqRkhg2C5J88cseSrjFbZn3U8nfTVRY0JzpLtWFC7JfNRuMwRN5fpoWQArvN0j7pUoQ7XMEOiOg"
            />
            <div className="truncate">
              <div className="text-xs text-white font-semibold truncate">Alex Chen</div>
              <div className="text-[10px] truncate font-mono" style={{ color: '#6B7585' }}>Principal SRE</div>
            </div>
          </div>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold"
            style={{ background: 'rgba(75,127,239,0.1)', border: '1px solid rgba(75,127,239,0.15)', color: '#6B9AF8' }}
          >
            Admin
          </span>
        </div>
      </div>
    </aside>
  );
}
