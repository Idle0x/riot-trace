import { supabase } from "@/lib/supabase";
import Link from "next/link";

// We use Next.js Server Components to fetch data securely on the backend
export default async function Hub() {
  // Fetch tiers and automatically join their associated lessons
  const { data: tiers, error } = await supabase
    .from("tiers")
    .select("*, lessons(id, title, xp_reward)")
    .order("id");

  if (error) {
    console.error("Error fetching tiers:", error);
    return <div className="p-8 text-riotRed">Failed to load curriculum. Check console.</div>;
  }

  return (
    <main className="min-h-screen dot-bg p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 animate-fadeUp">
          <div className="text-[10px] text-muted tracking-[3px] font-mono mb-2">
            SYSTEM STATUS: ONLINE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-sans leading-tight tracking-tight mb-3">
            The Crucible Awaits.
          </h1>
          <p className="text-sm text-muted leading-7">
            No passenger seats. Everything here is executed, evaluated, and earned. 
            Select a tier to begin tracing the execution.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="text-[10px] text-muted tracking-[3px] font-mono mb-4">
          CURRICULUM ARCHITECTURE
        </div>
        
        <div className="grid gap-4">
          {tiers?.map((tier, index) => {
            const isUnlocked = index === 0; // Temporary logic: only Tier 1 unlocked for now
            const lessonCount = tier.lessons?.length || 0;

            return (
              <Link 
                href={`/tier/${tier.id}`} 
                key={tier.id}
                className={`relative overflow-hidden rounded-xl p-5 border transition-all duration-300 ${
                  isUnlocked 
                    ? "bg-surf hover:bg-surf2 border-border hover:border-riotGreen/50 cursor-pointer group" 
                    : "bg-bg border-border/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] tracking-widest font-mono ${isUnlocked ? 'text-riotGreen' : 'text-muted'}`}>
                        TIER 0{tier.id}
                      </span>
                      {!isUnlocked && (
                        <span className="text-[9px] text-muted bg-border px-2 py-0.5 rounded-md font-mono">
                          LOCKED
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-lg font-bold text-white font-sans mb-1 group-hover:text-riotGreen transition-colors">
                      {tier.title}
                    </h2>
                    <p className="text-xs text-muted leading-6 max-w-[90%]">
                      {tier.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold font-sans text-white">
                      {lessonCount}
                    </div>
                    <div className="text-[9px] text-muted font-mono tracking-wider">
                      MODULES
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
