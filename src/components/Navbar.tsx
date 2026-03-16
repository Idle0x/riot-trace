"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [xp, setXp] = useState(0);

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
    // Listen for custom event from the code runner
    window.addEventListener("xp_updated", fetchXP);
    return () => window.removeEventListener("xp_updated", fetchXP);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,102,0.1)] border border-[rgba(0,255,102,0.25)] flex items-center justify-center text-riotGreen text-sm">
          ◉
        </div>
        <Link href="/" className="flex flex-col">
          <div className="text-sm font-bold text-white font-sans leading-none tracking-tight">
            riot' Trace
          </div>
          <div className="text-[9px] text-muted tracking-[3px] font-mono mt-0.5">
            LABORATORY
          </div>
        </Link>
      </div>
      
      <div className="bg-surf border border-border2 rounded-full px-4 py-1.5 text-xs font-mono text-riotBlue tracking-wider transition-all duration-300">
        {xp} XP
      </div>
    </header>
  );
}
