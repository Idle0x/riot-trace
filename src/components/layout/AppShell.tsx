"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const shellRef = useRef<HTMLDivElement>(null);

  // Track mouse for the ambient background glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Determine context to shift UI colors dynamically
  const isLesson = pathname?.includes('/lesson');
  const contextName = isLesson 
    ? "EXECUTION_ENVIRONMENT" 
    : pathname?.includes('/tier') 
      ? "TIER_ARCHIVES" 
      : "GLOBAL_HUB";

  return (
    <div 
      ref={shellRef}
      className="min-h-screen relative overflow-hidden bg-[#090A0F] text-[#E4E4F0] font-sans selection:bg-[#00FF66]/30"
    >
      {/* Dynamic Cursor Light Source */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />

      {/* Persistent Global Command Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#1A1C23] bg-[#090A0F]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#090A0F]/40 flex items-center justify-between px-6">
        
        {/* Left: Branding & Context Breadcrumbs */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-5 h-5 rounded-[4px] bg-gradient-to-br from-[#00FF66] to-[#00CC52] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,102,0.3)] group-hover:shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-shadow">
              <div className="w-1.5 h-1.5 bg-[#090A0F] rounded-sm"></div>
            </div>
            <span className="font-bold tracking-tight text-[15px] group-hover:text-white transition-colors">riot' Trace</span>
          </Link>
          
          <div className="h-4 w-[1px] bg-[#1A1C23]"></div>
          
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888898] flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLesson ? 'bg-[#4DA6FF]' : 'bg-[#FFD166]'}`}></div>
            {contextName}
          </div>
        </div>

        {/* Right: Telemetry & XP Vault */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#555568] tracking-widest mr-4">
            <span>LATENCY: 12ms</span>
            <span>|</span>
            <span className="text-[#00FF66]">SYS.OK</span>
          </div>

          <div className="h-8 flex items-center bg-[#12141A] border border-[#1A1C23] rounded-md px-3 hover:border-[#252830] transition-colors cursor-default shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <span className="font-mono text-[11px] text-[#888898] mr-2">TOTAL_XP</span>
            <span className="font-mono text-[12px] font-bold text-[#FFD166] drop-shadow-[0_0_8px_rgba(255,209,102,0.2)]">
              {/* We will hook this to your actual state later. Static for the shell preview. */}
              0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Padded to account for fixed Command Bar */}
      <main className="relative z-10 pt-16 h-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
