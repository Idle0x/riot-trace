"use client";

import Link from "next/link";

const TIER_ACCENTS: Record<number, { hex: string, bg: string, border: string, text: string, gutter: string }> = {
  1: { hex: "#00FF66", bg: "bg-accent-green/10", border: "border-accent-green/30", text: "text-accent-green", gutter: "bg-accent-green" },
  2: { hex: "#4DA6FF", bg: "bg-accent-blue/10", border: "border-accent-blue/30", text: "text-accent-blue", gutter: "bg-accent-blue" },
  3: { hex: "#FFD166", bg: "bg-accent-yellow/10", border: "border-accent-yellow/30", text: "text-accent-yellow", gutter: "bg-accent-yellow" },
  4: { hex: "#FF4466", bg: "bg-accent-red/10", border: "border-accent-red/30", text: "text-accent-red", gutter: "bg-accent-red" },
  5: { hex: "#C77DFF", bg: "bg-accent-purple/10", border: "border-accent-purple/30", text: "text-accent-purple", gutter: "bg-accent-purple" },
};

export function TierCard({ tier, lessonCount, isUnlocked = true }: { tier: any, lessonCount: number, isUnlocked?: boolean }) {
  const theme = TIER_ACCENTS[tier.id] || TIER_ACCENTS[2]; 

  return (
    <Link 
      href={isUnlocked ? `/tier/${tier.id}` : '#'}
      className={`
        group flex w-full border-b border-border-base bg-base hover:bg-surface transition-colors cursor-pointer relative overflow-hidden
        ${!isUnlocked ? 'opacity-40 cursor-not-allowed grayscale' : ''}
      `}
    >
      {/* 1. The Left Rail (Status Gutter) */}
      <div className={`w-1.5 flex-shrink-0 transition-all duration-300 ${isUnlocked ? theme.gutter : 'bg-border-strong'} group-hover:shadow-[0_0_12px_currentColor]`} />

      {/* 2. The Internal Ambient Leak */}
      {isUnlocked && (
        <div 
          className="absolute top-0 right-0 w-64 h-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.hex})` }}
        />
      )}

      {/* 3. Content Core */}
      <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Identity Block */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 rounded-sm border ${isUnlocked ? `${theme.border} ${theme.bg} ${theme.text}` : 'border-border-strong text-text-muted bg-surface'}`}>
              TIER 0{tier.id}
            </span>
            {!isUnlocked && (
              <span className="font-mono text-[9px] tracking-widest text-text-muted">LOCKED</span>
            )}
          </div>
          
          <h2 className="font-sans font-bold text-xl text-text-primary tracking-tight mb-1 group-hover:text-white transition-colors">
            {tier.title}
          </h2>
          <p className="font-mono text-xs text-text-muted leading-relaxed line-clamp-1 pr-4">
            {tier.description}
          </p>
        </div>

        {/* Telemetry Right Rail */}
        <div className="flex items-center justify-between md:justify-end gap-8 shrink-0 border-t border-border-base pt-4 md:border-t-0 md:pt-0">
          
          {/* Module Count */}
          <div className="text-left md:text-right">
            <div className="font-sans font-bold text-2xl leading-none text-text-primary">
              {lessonCount}
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-text-muted mt-1">
              MODULES
            </div>
          </div>

          {/* Execution Readiness Indicator */}
          <div className="w-32 h-10 bg-surface-sunken border border-border-dim rounded shadow-sunken flex items-center px-3 relative overflow-hidden group-hover:border-border-base transition-colors">
            {isUnlocked ? (
              <div className="flex w-full items-center justify-between">
                <span className={`font-mono text-[9px] font-bold tracking-widest ${theme.text} animate-pulse-slow`}>
                  READY
                </span>
                <span className={`font-mono text-[10px] ${theme.text} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`}>
                  →
                </span>
              </div>
            ) : (
              <span className="font-mono text-[9px] font-bold tracking-widest text-text-muted w-full text-center opacity-50">
                OFFLINE
              </span>
            )}
            
            {/* Hover Scan Line */}
            {isUnlocked && (
               <div className={`absolute inset-0 w-full h-[1px] ${theme.gutter} opacity-0 group-hover:opacity-30 group-hover:animate-scan-line shadow-[0_0_8px_currentColor]`} />
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
