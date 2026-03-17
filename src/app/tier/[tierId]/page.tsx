import { supabase } from "@/lib/supabase";
import Link from "next/link";

const TIER_ACCENTS: Record<number, string> = {
  1: "text-accent-green",
  2: "text-accent-blue",
  3: "text-accent-yellow",
  4: "text-accent-red",
  5: "text-accent-purple",
};

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);

  const { data: tier, error } = await supabase
    .from("tiers")
    .select("*, lessons(*)")
    .eq("id", tierId)
    .single();

  if (error || !tier) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-8 bg-base">
        <div className="border border-accent-red/30 bg-accent-red/5 p-6 rounded font-mono text-accent-red text-xs max-w-lg w-full text-center shadow-[0_0_20px_rgba(255,68,102,0.1)]">
          [FATAL_ERROR] // TIER ARCHIVE CORRUPTED OR OFFLINE.
        </div>
      </main>
    );
  }

  const lessons = tier.lessons?.sort((a: { id: number }, b: { id: number }) => a.id - b.id) || [];
  const accentClass = TIER_ACCENTS[tier.id] || "text-accent-blue";

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-base p-4 md:p-8 relative overflow-hidden animate-fade-up flex justify-center">
      
      <div className="w-full max-w-4xl relative z-10 pt-6">
        
        {/* Matrix Header */}
        <header className="mb-10 border-b border-border-strong pb-8">
          <Link href="/" className="font-mono text-[9px] text-text-muted hover:text-white transition-colors flex items-center gap-2 mb-6 group w-max tracking-widest uppercase">
            <span className={`${accentClass} group-hover:-translate-x-1 transition-transform`}>←</span> 
            RETURN TO GLOBAL MATRIX
          </Link>
          
          <div className={`font-mono text-[10px] tracking-[0.3em] mb-3 ${accentClass} uppercase flex items-center gap-2`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse-slow bg-current shadow-[0_0_8px_currentColor]`}></div>
            TIER 0{tier.id} ARCHIVE
          </div>
          
          <h1 className="heading-xl mb-3 text-text-primary">
            {tier.title}
          </h1>
          <p className="font-mono text-xs text-text-secondary leading-relaxed max-w-2xl">
            {tier.description}
          </p>
        </header>

        {/* High-Density Module Ledger */}
        <div className="space-y-0 border border-border-base rounded-sm bg-surface shadow-plate overflow-hidden">
          
          {/* Ledger Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border-strong bg-surface-sunken font-mono text-[9px] text-text-muted uppercase tracking-widest select-none">
            <div className="col-span-2 md:col-span-2">Designation</div>
            <div className="col-span-7 md:col-span-6">Module Title</div>
            <div className="col-span-3 md:col-span-2 text-right">Bounty</div>
            <div className="hidden md:block col-span-2 text-right">Status</div>
          </div>

          {lessons.map((lesson: any, index: number) => (
            <Link 
              key={lesson.id}
              href={`/tier/${tier.id}/lesson/${lesson.id}`}
              className="grid grid-cols-12 gap-4 p-4 border-b border-border-base last:border-0 items-center hover:bg-surface-hover transition-colors group cursor-pointer relative overflow-hidden"
            >
              {/* Hover Indicator Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border-base group-hover:bg-accent-green transition-colors"></div>

              {/* ID */}
              <div className="col-span-2 md:col-span-2 font-mono text-[10px] text-text-muted group-hover:text-accent-green transition-colors">
                MOD_{String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Title */}
              <div className="col-span-7 md:col-span-6 font-sans font-bold text-sm text-text-primary group-hover:text-white truncate pr-4">
                {lesson.title}
              </div>
              
              {/* XP */}
              <div className="col-span-3 md:col-span-2 text-right font-mono text-[10px] text-accent-yellow drop-shadow-[0_0_8px_rgba(255,209,102,0.1)]">
                {lesson.xp_reward} XP
              </div>
              
              {/* Action/Status */}
              <div className="hidden md:flex col-span-2 justify-end items-center font-mono text-[9px] font-bold text-text-muted tracking-widest group-hover:text-accent-green transition-colors">
                <span>INITIATE</span>
                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-1">
                  →
                </span>
              </div>
            </Link>
          ))}

          {lessons.length === 0 && (
            <div className="p-8 text-center font-mono text-[10px] text-text-muted tracking-widest uppercase bg-surface-sunken">
              [ NO_MODULES_DETECTED ]
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
