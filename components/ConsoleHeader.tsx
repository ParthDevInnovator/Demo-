"use client";

import React, { useState } from "react";

export default function ConsoleHeader() {
  const [selectedEnv, setSelectedEnv] = useState<"Prod" | "Staging" | "Dev">("Prod");

  return (
    <header
      className="fixed top-0 left-64 right-0 h-14 z-40 flex items-center justify-between px-5"
      style={{
        background: 'rgba(7,10,13,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,38,48,0.8)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#6B7585] text-base pointer-events-none">
            search
          </span>
          <input
            className="text-[#F0F4FF] placeholder:text-[#4B5568] text-xs font-mono pl-8 pr-12 py-1.5 rounded-lg w-72 md:w-80 focus:outline-none transition-colors"
            placeholder="Search telemetry, pods, DNS, routes..."
            type="text"
            style={{
              background: '#0D1117',
              border: '1px solid rgba(30,38,48,0.9)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(75,127,239,0.4)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(30,38,48,0.9)'; }}
          />
          <span className="absolute right-2 text-[10px] font-mono px-1 py-0.5 rounded" style={{ background: '#1A2030', color: '#6B7585', border: '1px solid rgba(30,38,48,0.8)' }}>
            ⌘K
          </span>
        </div>

        {/* Environment Selector */}
        <div className="hidden xl:flex items-center p-0.5 rounded-lg text-xs" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          {(["Prod", "Staging", "Dev"] as const).map((env) => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1 rounded-md text-xs transition-all ${
                selectedEnv === env
                  ? "text-white font-medium"
                  : "text-[#6B7585] hover:text-[#F0F4FF]"
              }`}
              style={selectedEnv === env ? { background: '#1E2630' } : {}}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Health indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C', boxShadow: '0 0 0 2px rgba(61,214,140,0.2)' }} />
          <span className="text-[#9BA5B4]">12 regions healthy</span>
          <span className="text-[#6B7585] font-mono text-[10px]">42ms avg</span>
        </div>

        {/* Live Throughput */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
          <span className="text-[#6B7585] font-mono text-[10px]">Ingress:</span>
          <span className="text-[#F0F4FF] font-mono text-xs font-semibold">1.42M req/s</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-1.5 rounded-lg text-[#9BA5B4] hover:text-[#F0F4FF] transition-colors" style={{ background: '#0D1117', border: '1px solid rgba(30,38,48,0.9)' }}>
            <span className="material-symbols-outlined text-base">notifications</span>
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-mono flex items-center justify-center font-bold" style={{ background: 'linear-gradient(135deg, #4B7FEF, #3560BE)' }}>
            3
          </span>
        </div>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:bg-[#131920]">
          <img
            alt="Alex Chen"
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: '2px solid rgba(75,127,239,0.3)' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-CjXKdZbnNbaH2LWr58rRTINpzfnXWHDsltVDP6Nl40Ip3TMrvhyydDWURtLI-D2nQ9Kl79RZp3EjDNq2YlI1-0z7WJNZlBiA2IfEofXWj1JSjcre1uB5fXA2QOEFfXnyoo4Z-LSx_W043f3I3DJx6hdr25lhaJkO45EjHKA2CPCuqRkhg2C5J88cseSrjFbZn3U8nfTVRY0JzpLtWFC7JfNRuMwRN5fpoWQArvN0j7pUoQ7XMEOiOg"
          />
        </button>
      </div>
    </header>
  );
}
