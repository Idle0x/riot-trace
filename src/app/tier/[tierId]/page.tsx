import Link from "next/link";
import { getAllLessonsForTier, getAllTiers } from "@/lib/curriculum";

export default async function TierPage({ params }: { params: { tierId: string } }) {
  const tierId = params.tierId;
  const lessons = getAllLessonsForTier(tierId);
  const tiers = getAllTiers();
  const currentTier = tiers.find(t => String(t.id) === tierId);

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-8 md:p-16">
      <header className="mb-12 border-b border-border-dim pb-8">
        <Link href="/" className="text-accent-blue font-mono text-[10px] uppercase tracking-[0.2em] hover:brightness-125 transition-all">
          [ BACK_TO_HUB ]
        </Link>
        <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-text-primary mt-6">
          {currentTier?.title || `Tier ${tierId}`}
        </h1>
        <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-widest">
          {currentTier?.subtitle}
        </p>
      </header>

      <div className="grid gap-4 max-w-4xl">
        {lessons.length > 0 ? (
          lessons.map((lesson: any) => (
            <Link 
              key={lesson.lessonId}
              // FIX: Ensure moduleId and lessonId are explicitly passed in the URL string
              href={`/tier/${tierId}/module/${lesson.moduleId}/lesson/${lesson.lessonId}`}
              className="group flex items-center justify-between bg-base border border-border-base p-6 hover:border-accent-blue transition-all duration-300 shadow-plate"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-2xl text-border-strong group-hover:text-accent-blue transition-colors">
                  {String(lesson.lessonId).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-text-primary font-sans font-bold group-hover:translate-x-1 transition-transform">
                    {lesson.title}
                  </h3>
                  <span className="text-[9px] font-mono text-text-dim uppercase tracking-widest">
                    Module {lesson.moduleId} // Lesson {lesson.lessonId}
                  </span>
                </div>
              </div>
              <div className="text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs tracking-widest">
                [ START_EXECUTION ]
              </div>
            </Link>
          ))
        ) : (
          <div className="border border-dashed border-border-dim p-12 text-center rounded-sm">
            <span className="font-mono text-xs text-text-dim uppercase tracking-widest">
              No data streams found in this Tier.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
