import { supabase } from "@/lib/supabase";
import Link from "next/link";
import DailyReview from "@/components/DailyReview";
import { TiltCard } from "@/components/ui/TiltCard";

export default async function Hub() {
  const { data: tiers, error } = await supabase
    .from("tiers")
    .select("*, lessons(id, title, xp_reward)")
    .order("id");

  if (error) {
    return <div className="p-8 text-accent-red font-mono">Failed to load curriculum. Check console.</div>;
  }

  return (
    <main className="min-h-screen bg-dots p-8 relative overflow-hidden">
      {/* Background Aurora Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-glow-green opacity-40 pointer-events-none -z-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-3xl mx-auto z-10 relative">
        
        {/* Header Section */}
        <div className="mb-16 animate-fadeUp">
          <div className="label flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_10px_rgba(0,255,170,0.8)]"></div>
            <span className="text-accent-green">SYSTEM STATUS: ONLINE</span>
          </div>
          <h1 className="heading-xl mb-4">
            The Crucible <span className="text-gradient">Awaits.</span>
          </h1>
          <p className="body text-text-secondary max-w-xl">
            No passenger seats. Everything here is executed, evaluated, and earned. 
            Select a tier to begin tracing the execution.
          </p>
        </div>

        {/* The Spaced Repetition Engine intercepts here */}
        <DailyReview />

        {/* Tiers Grid */}
        <div className="label mb-6 text-text-muted">CURRICULUM ARCHITECTURE</div>
        
        <div className="grid gap-5">
          {tiers?.map((tier, index) => {
            const isUnlocked = true; // All unlocked for now
            const lessonCount = tier.lessons?.length || 0;

            const CardContent = (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`label ${isUnlocked ? 'text-accent-green' : 'text-text-muted'}`}>
                      TIER 0{tier.id}
                    </span>
                  </div>
                  
                  <h2 className={`heading-md mb-2 transition-colors ${isUnlocked ? 'text-text-primary group-hover:text-accent-green' : 'text-text-muted'}`}>
                    {tier.title}
                  </h2>
                  <p className="body max-w-[90%]">
                    {tier.description}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`heading-lg ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                    {lessonCount}
                  </div>
                  <div className="label mt-1">MODULES</div>
                </div>
              </div>
            );

            return isUnlocked ? (
              <TiltCard key={tier.id}>
                <Link 
                  href={`/tier/${tier.id}`} 
                  className="card-interactive block group"
                >
                  {CardContent}
                </Link>
              </TiltCard>
            ) : (
              <div key={tier.id} className="card opacity-50 cursor-not-allowed">
                {CardContent}
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
