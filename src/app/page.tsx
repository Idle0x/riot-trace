import { supabase } from "@/lib/supabase";
import DailyReview from "@/components/DailyReview";
import { TierCard } from "@/components/ui/TierCard";

export default async function Hub() {
  const { data: tiers, error } = await supabase
    .from("tiers")
    .select("*, lessons(id, title, xp_reward)")
    .order("id");

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-20 border border-accent-red/30 bg-accent-red/5 p-6 rounded-sm font-mono text-accent-red text-xs">
        [FATAL_ERROR] // FAILED TO LOAD CURRICULUM ARCHITECTURE.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pb-32 pt-10 animate-fade-up">

      {/* Terminal Header */}
      <div className="mb-12 border-b border-border-base pb-8">
        <div className="font-mono text-[10px] text-text-muted tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-blue"></div>
          GLOBAL_HUB // INDEX
        </div>
        <h1 className="heading-xl mb-3">
          The Crucible <span className="text-phosphor">Awaits.</span>
        </h1>
        <p className="font-mono text-xs text-text-secondary max-w-2xl leading-relaxed">
          No passenger seats. Everything here is executed, evaluated, and earned. 
          Select an architecture tier from the matrix to trace execution.
        </p>
      </div>

      {/* The Urgent Action Queue (Spaced Repetition) */}
      <DailyReview />

      {/* Sector Matrix Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="font-mono text-[9px] tracking-[0.3em] text-text-muted uppercase">
          CURRICULUM_MATRIX
        </div>
        <div className="h-[1px] flex-grow bg-border-base"></div>
      </div>

      {/* The Interlocking Data Plates */}
      {/* We use a rounded container with hidden overflow so the snapped borders stay neat */}
      <div className="bg-base border border-border-base shadow-plate rounded-lg overflow-hidden">
        {tiers?.map((tier) => (
          <TierCard 
            key={tier.id} 
            tier={tier} 
            lessonCount={tier.lessons?.length || 0} 
            isUnlocked={true} // Add logic here later if you want to gate tiers
          />
        ))}
      </div>

    </div>
  );
}
