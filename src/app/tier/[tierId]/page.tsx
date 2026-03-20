import Link from "next/link";
import { getAllLessonsForTier } from "@/lib/curriculum";

const TIER_ACCENTS: Record<number, string> = {
  1: "text-accent-green",
  2: "text-accent-blue",
  3: "text-accent-yellow",
  4: "text-accent-red",
  5: "text-accent-purple",
  6: "text-accent-teal",
  7: "text-accent-pink",
};

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);
  const lessons = getAllLessonsForTier(tierId);
  const accentClass = TIER_ACCENTS[tierId] || "text-accent-blue";

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
            TIER 0{tierId} ARCHIVE
          </div>
          
          <h1 className="heading-xl mb-3 text-text-primary">
            Architecture Segment {tierId}
          </h1>
        </header>

        {/* High-Density Module Ledger (Grouped by Module) */}
        <div className="space-y-8">
          
          {Array.from(new Set(lessons.map(l => l.moduleId))).map(moduleId => {
            const moduleLessons = lessons.filter(l => l.moduleId === moduleId);
            
            return (
              <div key={moduleId} className="border border-border-base rounded-sm bg-surface shadow-plate overflow-hidden animate-fade-up">
                
                {/* Module Header */}
                <div className="bg-surface-sunken border-b border-border-strong p-4 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-sm ${accentClass} shadow-[0_0_8px_currentColor]`}></div>
                  <h2 className="font-mono text-[11px] text-text-primary tracking-[0.2em] uppercase font-bold">
                    MODULE {String(moduleId).padStart(2, '0')}
                  </h2>
                </div>

                {/* Ledger Columns */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border-strong bg-base/50 font-mono text-[9px] text-text-muted uppercase tracking-widest select-none">
                  <div className="col-span-3 md:col-span-2">Designation</div>
                  <div className="col-span-6 md:col-span-6">Lesson Title</div>
                  <div className="col-span-3 md:col-span-2 text-right">Bounty</div>
                  <div className="hidden md:block col-span-2 text-right">Status</div>
                </div>

                {/* Lessons mapping */}
                {moduleLessons.map((lesson) => (
                  <Link 
                    key={lesson.lessonId}
                    href={`/tier/${tierId}/lesson/${lesson.lessonId}`}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-border-base last:border-0 items-center hover:bg-surface-hover transition-colors group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border-base group-hover:bg-accent-green transition-colors"></div>

                    <div className="col-span-3 md:col-span-2 font-mono text-[10px] text-text-muted group-hover:text-accent-green transition-colors">
                      M{String(moduleId).padStart(2,'0')}_L{String(lesson.lessonId).padStart(2, '0')}
                    </div>
                    
                    <div className="col-span-6 md:col-span-6 font-sans font-bold text-sm text-text-primary group-hover:text-white truncate pr-4">
                      {lesson.title}
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 text-right font-mono text-[10px] text-accent-yellow drop-shadow-[0_0_8px_rgba(255,209,102,0.1)]">
                      {lesson.xpReward} XP
                    </div>
                    
                    <div className="hidden md:flex col-span-2 justify-end items-center font-mono text-[9px] font-bold text-text-muted tracking-widest group-hover:text-accent-green transition-colors">
                      <span>INITIATE</span>
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}

          {lessons.length === 0 && (
            <div className="p-8 text-center font-mono text-[10px] text-text-muted tracking-widest uppercase bg-surface-sunken border border-border-base shadow-sunken">
              [ NO_MODULES_DETECTED_IN_LOCAL_DIRECTORY ]
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
