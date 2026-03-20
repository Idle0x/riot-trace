import DailyReview from "@/components/DailyReview";
import { TierCard } from "@/components/ui/TierCard";
import { getAllTiers } from "@/lib/curriculum";

export default async function Hub() {
  const tiers = getAllTiers();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pb-32 pt-10 animate-fade-up">
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

      <DailyReview />

      <div className="flex items-center gap-4 mb-4">
        <div className="font-mono text-[9px] tracking-[0.3em] text-text-muted uppercase">
          CURRICULUM_MATRIX
        </div>
        <div className="h-[1px] flex-grow bg-border-base"></div>
      </div>

      <div className="bg-base border border-border-base shadow-plate rounded-lg overflow-hidden">
        {tiers.map((tier) => (
          <TierCard 
            key={tier.id} 
            tier={tier} 
            lessonCount={tier.lessonCount} 
            isUnlocked={tier.id === 1} // Currently locking tiers > 1 for progression rules
          />
        ))}
        {tiers.length === 0 && (
           <div className="p-8 text-center font-mono text-[10px] text-accent-red tracking-widest uppercase bg-surface-sunken">
             [ FATAL_ERROR: LOCAL CURRICULUM DIRECTORY NOT FOUND ]
           </div>
        )}
      </div>
    </div>
  );
}
