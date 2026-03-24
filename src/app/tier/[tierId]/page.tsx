import Link from "next/link";
import { getAllLessonsForTier } from "@/lib/curriculum";

const TIER_ACCENTS: Record<number, string> = {
  1: "text-accent-green", 2: "text-accent-blue", 3: "text-accent-yellow",
  4: "text-accent-red", 5: "text-accent-purple", 6: "text-accent-teal", 7: "text-accent-pink",
};

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  const { tierId } = await params;
  const lessons = getAllLessonsForTier(tierId);
  const accentClass = TIER_ACCENTS[parseInt(tierId)] || "text-accent-blue";

  const moduleIds = Array.from(new Set(lessons.map(l => l.moduleId)));

  return (
    <main className="min-h-screen bg-base p-8 flex justify-center">
      <div className="w-full max-w-4xl pt-6">
        <header className="mb-10 border-b border-border-strong pb-8">
          <Link href="/" className="font-mono text-[9px] text-text-muted hover:text-white mb-6 block uppercase tracking-widest">
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
              <div className="bg-surface-sunken border-b border-border-strong p-4 font-mono text-[11px] uppercase font-bold">
                MODULE {String(mId).padStart(2, '0')}
              </div>
              {lessons.filter(l => l.moduleId === mId).map((lesson) => (
                <Link 
                  key={lesson.lessonId}
                  href={`/tier/${tierId}/lesson/${lesson.lessonId}`}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors group"
                >
                  <div className="col-span-2 font-mono text-[10px] text-text-muted group-hover:text-accent-green">
                    L{String(lesson.lessonId).padStart(2, '0')}
                  </div>
                  <div className="col-span-8 font-bold text-sm text-text-primary group-hover:text-white">
                    {lesson.title}
                  </div>
                  <div className="col-span-2 text-right font-mono text-[10px] text-accent-yellow">
                    {lesson.xpReward || 0} XP
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
