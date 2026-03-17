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
      <div className="max-w-2xl mx-auto mt-20 border border-[#FF4466]/30 bg-[#FF4466]/10 p-6 rounded-xl font-mono text-[#FF4466]">
        Failed to load curriculum. Check console.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-32 pt-12 animate-[fadeUp_0.4s_ease-out_forwards]">
      
      {/* Header Section */}
      <div className="mb-16">
        <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,48px)] text-[#E4E4F0] tracking-[-1px] leading-tight mb-4">
          The Crucible <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#4DA6FF]">Awaits.</span>
        </h1>
        <p className="font-mono text-[13px] text-[#888898] max-w-2xl leading-relaxed">
          No passenger seats. Everything here is executed, evaluated, and earned. 
          Select an architecture tier to begin tracing the execution.
        </p>
      </div>

      {/* The Spaced Repetition Engine */}
      <div className="mb-12">
        <DailyReview />
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#555568] uppercase">
          Curriculum Architecture
        </div>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-[#1A1C23] to-transparent"></div>
      </div>
      
      {/* High-Density Grid: 
        1 column on mobile, 2 columns on large screens to match the dashboard aesthetic of Xandeum Pulse 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tiers?.map((tier) => (
          <TierCard 
            key={tier.id} 
            tier={tier} 
            lessonCount={tier.lessons?.length || 0} 
            isUnlocked={true} 
          />
        ))}
      </div>

    </div>
  );
}
