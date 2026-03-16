import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TierPage({ params }: { params: { tierId: string } }) {
  const tierId = parseInt(params.tierId);

  // Fetch the specific tier and its associated lessons
  const { data: tier, error } = await supabase
    .from("tiers")
    .select("*, lessons(*)")
    .eq("id", tierId)
    .single();

  if (error || !tier) {
    notFound(); // Triggers the Next.js 404 page if the tier doesn't exist
  }

  // Sort lessons by ID just to ensure chronological order
  const lessons = tier.lessons?.sort((a: any, b: any) => a.id - b.id) || [];

  return (
    <main className="min-h-screen dot-bg p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 animate-fadeUp">
          <Link 
            href="/" 
            className="text-xs font-mono text-muted border border-border2 rounded-lg px-3 py-1.5 hover:text-white hover:border-muted transition-all inline-block mb-6"
          >
            ← BACK TO HUB
          </Link>
          
          <div className="text-[10px] tracking-[3px] font-mono mb-2 text-riotGreen">
            TIER 0{tier.id}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans leading-tight mb-2">
            {tier.title}
          </h1>
          <p className="text-sm text-muted leading-7 mb-6">
            {tier.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surf rounded-xl p-4 border border-border text-center">
              <div className="text-xl font-bold font-sans text-riotGreen">{lessons.length}</div>
              <div className="text-[9px] text-muted font-mono mt-1 tracking-wider">MODULES</div>
            </div>
            <div className="bg-surf rounded-xl p-4 border border-border text-center">
              <div className="text-xl font-bold font-sans text-riotBlue">0%</div>
              <div className="text-[9px] text-muted font-mono mt-1 tracking-wider">COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="text-[10px] text-muted tracking-[3px] font-mono mb-4">
          EXECUTION SEQUENCE
        </div>
        
        <div className="grid gap-3">
          {lessons.map((lesson: any, i: number) => {
            return (
              <Link 
                href={`/tier/${tier.id}/lesson/${lesson.id}`} 
                key={lesson.id}
                className="relative overflow-hidden rounded-xl p-4 border bg-surf hover:translate-x-1 border-border2 hover:border-riotBlue/50 transition-all duration-200 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-mono border bg-bg border-border text-muted">
                  {String(i + 1).padStart(2, "0")}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium font-sans text-white mb-0.5">
                    {lesson.title}
                  </div>
                  <div className="text-[10px] text-muted font-mono tracking-wider">
                    REWARD: {lesson.xp_reward} XP
                  </div>
                </div>
                
                <div className="text-muted text-lg">
                  →
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
