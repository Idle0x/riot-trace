"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCountUp } from "@/hooks/useCountUp"; // Ensure you have this hook saved

export default function Navbar() {
  const pathname = usePathname();
  const [xp, setXp] = useState(0);
  const displayXp = useCountUp(xp, 1500); // 1.5s spring animation for XP

  const isLesson = pathname?.includes('/lesson');
  const isForge = pathname?.includes('/forge');

  // Dynamic Context Breadcrumbs
  const contextName = isLesson 
    ? "CRUCIBLE_ENVIRONMENT" 
    : isForge 
      ? "FORGE_TERMINAL" 
      : "GLOBAL_MATRIX";

  const fetchXP = async () => {
    const userId = localStorage.getItem("riot_trace_user_id");
    if (!userId) return;

    const { data, error } = await supabase
      .from("user_progress")
      .select("score")
      .eq("user_id", userId);

    if (!error && data) {
      const total = data.reduce((sum, row) => sum + (row.score || 0), 0);
      setXp(total);
    }
  };

  useEffect(() => {
    fetchXP();
    window.addEventListener("xp_updated", fetchXP);
    return () => window.removeEventListener("xp_updated", fetchXP);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-base border-b border-border-base flex items-center justify-between px-4 lg:px-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      
      {/* Left: Branding & Context Breadcrumbs */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Tactical Hardware Node Indicator */}
          <div className="w-4 h-4 rounded-sm bg-surface border border-border-strong flex items-center justify-center shadow-plate transition-all group-hover:border-accent-green">
            <div className="w-1.5 h-1.5 bg-accent-green rounded-sm shadow-glow-green animate-pulse-slow"></div>
          </div>
          <span className="font-bold tracking-tight text-sm group-hover:text-white transition-colors">
            riot' Trace
          </span>
        </Link>

        {/* Separator */}
        <div className="h-4 w-px bg-border-dim hidden sm:block"></div>

        {/* Breadcrumb Context */}
        <div className="hidden sm:flex font-mono text-[9px] uppercase tracking-widest text-text-muted items-center gap-2">
          {contextName}
        </div>
      </div>

      {/* Right: Telemetry & XP Vault */}
      <div className="flex items-center gap-4 lg:gap-6">
        
        {/* System Diagnostics */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[9px] tracking-widest text-text-muted">
          <span>LATENCY: 12ms</span>
          <span className="text-border-strong">|</span>
          <span className="text-accent-green flex items-center gap-1">
            <div className="w-1 h-1 bg-accent-green rounded-full"></div> SYS.OK
          </span>
        </div>

        {/* XP Vault - Sunk into the header */}
        <div className="h-8 flex items-center bg-surface-sunken border border-border-dim rounded shadow-sunken px-3 select-none">
          <span className="font-mono text-[9px] tracking-widest text-text-muted mr-3">TOTAL_XP</span>
          <span className="font-mono text-[11px] font-bold text-phosphor w-10 text-right">
            {displayXp}
          </span>
        </div>

      </div>
    </header>
  );
}
