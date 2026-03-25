import Link from "next/link";
import { 
  getAllLessonsForTier, 
  getModuleIdsForTier, 
  hasBossFight, 
  hasTierCapstone 
} from "@/lib/curriculum";

const TIER_ACCENTS: Record<number, string> = {
  1: "text-accent-green", 2: "text-accent-blue", 3: "text-accent-yellow",
  4: "text-accent-red", 5: "text-accent-purple", 6: "text-accent-teal", 7: "text-accent-pink",
};

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  const { tierId } = await params;
  
  const lessons = getAllLessonsForTier(tierId);
  const moduleIds = getModuleIdsForTier(tierId); 
  const accentClass = TIER_ACCENTS[parseInt(tierId)] || "text-accent-blue";

  return (
    <main className="min-h-screen bg-base p-8 flex justify-center">
      <div className="w-full max-w-4xl pt-6">
        <header className="mb-10 border-b border-border-strong pb-8">
          <Link href="/" className="font-mono text-[9px] text-text-muted hover:text-white mb-6 block uppercase tracking-widest transition-colors">
            ← RETURN TO GLOBAL MATRIX
          </Link>
          <div className={`font-mono text-[10px] tracking-[0.3em] mb-3 ${accentClass} uppercase`}>
            TIER 0{tierId} ARCHIVE
          </div>
          <h1 className="text-4xl font-bold text-text-primary">Architecture Segment {tierId}</h1>
        </header>

        <div className="space-y-8">
          {moduleIds.map(mId => (
            <div key={mId} className="border border-border-base bg-surface shadow-plate rounded-sm overflow-hidden">
              <div className="bg-surface-sunken border-b border-border-strong p-4 font-mono text-[11px] uppercase font-bold text-text-secondary">
                MODULE {String(mId).padStart(2, '0')}
              </div>
              
              {/* Standard Lessons */}
              {lessons.filter(l => l.moduleId === mId).map((lesson) => (
                <Link 
                  key={lesson.lessonId}
                  href={`/tier/${tierId}/lesson/${lesson.lessonId}`}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-border-base hover:bg-surface-hover transition-colors group"
                >
                  <div className="col-span-2 font-mono text-[10px] text-text-muted group-hover:text-accent-green transition-colors">
                    L{String(lesson.lessonId).padStart(2, '0')}
                  </div>
                  <div className="col-span-8 font-bold text-sm text-text-primary group-hover:text-white transition-colors">
                    {lesson.title}
                  </div>
                  <div className="col-span-2 text-right font-mono text-[10px] text-accent-yellow/80 group-hover:text-accent-yellow transition-colors">
                    {lesson.xpReward || 0} XP
                  </div>
                </Link>
              ))}

              {/* Refined Boss Fight Row */}
              {hasBossFight(tierId, mId) && (
                <Link 
                  href={`/tier/${tierId}/boss/${mId}`}
                  className="grid grid-cols-12 gap-4 p-4 bg-surface-sunken hover:bg-surface-hover transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle left-edge accent replacing the heavy background */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-red/30 group-hover:bg-accent-red transition-colors duration-300"></div>
                  
                  <div className="col-span-2 font-mono text-[10px] text-accent-red/70 group-hover:text-accent-red tracking-widest pl-2 transition-colors">
                    BOSS
                  </div>
                  <div className="col-span-8 font-bold text-sm text-text-primary group-hover:text-white transition-colors">
                    Module {String(mId).padStart(2, '0')} Synthesis
                  </div>
                  <div className="col-span-2 text-right font-mono text-[10px] text-accent-red/70 group-hover:text-accent-red transition-colors">
                    150 XP
                  </div>
                </Link>
              )}
            </div>
          ))}

          {/* Refined Tier Capstone Block */}
          {hasTierCapstone(tierId) && (
            <div className="mt-12 border border-border-strong bg-surface shadow-plate rounded-sm overflow-hidden relative group transition-all duration-500 hover:border-accent-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.07)]">
               {/* Elegant, subtle hover gradient */}
               <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/0 via-accent-purple/[0.03] to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
               
               <Link
                  href={`/tier/${tierId}/capstone`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-8 relative z-10 gap-4"
                >
                  <div>
                    <div className="font-mono text-[10px] text-accent-purple/70 tracking-[0.2em] uppercase mb-2 group-hover:text-accent-purple transition-colors duration-300">
                      FINAL_GATEWAY // TIER 0{tierId}
                    </div>
                    <h3 className="font-bold text-xl text-text-primary group-hover:text-white transition-colors duration-300">
                      Tier Capstone Challenge
                    </h3>
                    <p className="text-sm text-text-muted mt-2 font-mono max-w-xl group-hover:text-text-secondary transition-colors duration-300">
                      Prove your architectural mastery to unlock the next segment of the matrix.
                    </p>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <div className="font-mono text-[14px] text-accent-purple/80 group-hover:text-accent-purple font-bold tracking-widest transition-colors duration-300">
                      +500 XP
                    </div>
                  </div>
                </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
