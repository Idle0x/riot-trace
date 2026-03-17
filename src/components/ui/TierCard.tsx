"use client";

import Link from "next/link";
import { TiltCard } from "./TiltCard";

// A spectrum of high-end accents to map to different tiers
const TIER_ACCENTS: Record<number, { hex: string, bg: string, border: string, text: string, glow: string }> = {
  1: { hex: "#00FF66", bg: "bg-[#00FF66]/10", border: "border-[#00FF66]/30", text: "text-[#00FF66]", glow: "shadow-[0_0_15px_rgba(0,255,102,0.15)]" },
  2: { hex: "#4DA6FF", bg: "bg-[#4DA6FF]/10", border: "border-[#4DA6FF]/30", text: "text-[#4DA6FF]", glow: "shadow-[0_0_15px_rgba(77,166,255,0.15)]" },
  3: { hex: "#C77DFF", bg: "bg-[#C77DFF]/10", border: "border-[#C77DFF]/30", text: "text-[#C77DFF]", glow: "shadow-[0_0_15px_rgba(199,125,255,0.15)]" },
  4: { hex: "#FFD166", bg: "bg-[#FFD166]/10", border: "border-[#FFD166]/30", text: "text-[#FFD166]", glow: "shadow-[0_0_15px_rgba(255,209,102,0.15)]" },
  5: { hex: "#FF4466", bg: "bg-[#FF4466]/10", border: "border-[#FF4466]/30", text: "text-[#FF4466]", glow: "shadow-[0_0_15px_rgba(255,68,102,0.15)]" },
  6: { hex: "#4ECDC4", bg: "bg-[#4ECDC4]/10", border: "border-[#4ECDC4]/30", text: "text-[#4ECDC4]", glow: "shadow-[0_0_15px_rgba(78,205,196,0.15)]" },
  7: { hex: "#F72585", bg: "bg-[#F72585]/10", border: "border-[#F72585]/30", text: "text-[#F72585]", glow: "shadow-[0_0_15px_rgba(247,37,133,0.15)]" },
};

export function TierCard({ tier, lessonCount, isUnlocked = true }: { tier: any, lessonCount: number, isUnlocked?: boolean }) {
  // Fallback to blue if tier ID goes beyond our map
  const theme = TIER_ACCENTS[tier.id] || TIER_ACCENTS[2]; 

  return (
    <TiltCard className="w-full">
      <Link 
        href={isUnlocked ? `/tier/${tier.id}` : '#'}
        className={`
          group block relative w-full rounded-xl overflow-hidden
          bg-[#0C0C18] border border-[#111120] p-6
          shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_16px_rgba(0,0,0,0.4)]
          transition-all duration-300 ease-out
          ${isUnlocked ? `hover:-translate-y-1 hover:border-[${theme.hex}]/40 ${theme.glow}` : 'opacity-50 cursor-not-allowed'}
        `}
      >
        {/* The Internal Light Source (Base Plate Glow) */}
        <div 
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: theme.hex }}
        ></div>

        <div className="flex flex-col h-full relative z-10">
          
          {/* Top Bar: Metadata Layer */}
          <div className="flex justify-between items-start mb-5">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#1A1A30] bg-[#111120]/50`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? `${theme.bg} ${theme.text} animate-pulse shadow-[0_0_8px_currentColor]` : 'bg-[#555568]'}`}></div>
              <span className={`font-mono text-[10px] tracking-widest ${isUnlocked ? 'text-[#E4E4F0]' : 'text-[#555568]'}`}>
                TIER 0{tier.id}
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="font-sans font-bold text-xl leading-none text-[#E4E4F0] mb-1">
                {lessonCount}
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#555568]">
                MODULES
              </span>
            </div>
          </div>

          {/* Content Core: Typography & Restraint */}
          <div className="mb-6 flex-grow">
            <h2 className="font-sans font-bold text-[20px] text-[#E4E4F0] tracking-[-0.5px] leading-tight mb-2 group-hover:text-white transition-colors">
              {tier.title}
            </h2>
            <p className="font-mono text-[12px] text-[#888898] leading-relaxed line-clamp-2 pr-4">
              {tier.description}
            </p>
          </div>

          {/* Data Visualization Footer: XP Vault */}
          <div className="mt-auto border-t border-[#1A1C23] pt-4">
            <div className="bg-[#12141A] border border-[#1A1C23] rounded-lg p-3 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              
              <div className="flex-grow mr-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-mono text-[9px] text-[#555568] tracking-widest">MODULE READINESS</span>
                  <span className={`font-mono text-[10px] font-bold ${theme.text}`}>AWAITING INITIATION</span>
                </div>
                {/* Visual Progress Track */}
                <div className="h-1 w-full bg-[#1A1C23] rounded-full overflow-hidden">
                  <div className={`h-full w-0 ${theme.bg} group-hover:w-[15%] transition-all duration-700 ease-out rounded-full relative overflow-hidden`}>
                    {/* Shimmer effect inside the bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              {/* Action Arrow (Slides in on hover) */}
              <div className="w-8 h-8 rounded-md bg-[#090A0F] border border-[#1A1C23] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#252830] transition-colors">
                <span className={`font-mono text-sm ${theme.text} opacity-50 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)`}>
                  →
                </span>
              </div>

            </div>
          </div>

        </div>
      </Link>
    </TiltCard>
  );
}
