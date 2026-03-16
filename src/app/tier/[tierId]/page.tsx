import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  // 1. Next.js 15+ strict requirement: await the params
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);

  // Fetch the tier and all its associated lessons
  const { data: tier, error } = await supabase
    .from("tiers")
    .select("*, lessons(*)")
    .eq("id", tierId)
    .single();

  // THE DEBUG TRAP: Print the exact error instead of a generic 404
  if (error || !tier) {
    return (
      <main className="min-h-screen dot-bg p-8 pt-24">
        <div className="max-w-2xl mx-auto border border-riotRed bg-riotRed/10 p-6 rounded-xl font-mono">
          <h2 className="text-riotRed font-bold mb-4 text-xl">DATABASE FETCH FAILED</h2>
          <p className="text-white mb-2">Attempted to fetch Tier ID: {tierId}</p>
          <p className="text-muted mb-4">Error Details:</p>
          <pre className="text-riotYellow text-xs overflow-auto">
            {JSON.stringify(error || "Tier not found in database", null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  // Sort lessons sequentially by ID (TypeScript strict mode fix applied)
  const lessons = tier.lessons?.sort((a: { id: number }, b: { id: number }) => a.id - b.id) || [];

  return (
    <main className="min-h-screen dot-bg p-8 pb-32">
      <div className="max-w-3xl mx-auto animate-fadeUp">
        
        <header className="mb-10 border-b border-border pb-6">
          <Link href="/" className="text-[10px] font-mono text-muted hover:text-white transition-colors uppercase tracking-[2px] mb-4 block">
            ← RETURN TO HUB
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-riotGreen tracking-[3px] font-mono">
              TIER 0{tier.id}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white font-sans leading-tight mb-2">
            {tier.title}
          </h1>
          <p className="text-sm text-muted">
            {tier.description}
          </p>
        </header>

        <div className="space-y-4">
          <div className="text-[10px] text-muted tracking-[3px] font-mono mb-4">
            AVAILABLE MODULES
          </div>
          
          {lessons.map((lesson: any, index: number) => (
            <Link 
              href={`/tier/${tier.id}/lesson/${lesson.id}`}
              key={lesson.id}
              className="bg-surf border border-border2 hover:border-riotBlue/50 hover:bg-surf2 p-5 rounded-xl flex items-center justify-between transition-all group"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono text-muted group-hover:text-riotBlue transition-colors">
                    MODULE 0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  {lesson.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-riotYellow">
                  {lesson.xp_reward} XP
                </div>
                <div className="text-[9px] text-muted tracking-widest font-mono mt-1 group-hover:text-white transition-colors">
                  INITIATE →
                </div>
              </div>
            </Link>
          ))}

          {lessons.length === 0 && (
            <div className="text-sm text-muted italic p-8 border border-border2 border-dashed rounded-xl text-center">
              No modules forged for this tier yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
