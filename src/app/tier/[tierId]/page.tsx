import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";

export default async function TierPage({ params }: { params: Promise<{ tierId: string }> }) {
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);

  const { data: tier, error } = await supabase
    .from("tiers")
    .select("*, lessons(*)")
    .eq("id", tierId)
    .single();

  if (error || !tier) {
    return (
      <main className="min-h-screen bg-base bg-dots p-8 pt-24">
        <div className="max-w-2xl mx-auto border border-accent-red bg-[rgba(255,68,102,0.08)] p-6 rounded-xl font-mono">
          <h2 className="text-accent-red font-bold mb-4 text-xl">DATABASE FETCH FAILED</h2>
          <pre className="text-text-primary text-xs overflow-auto">
            {JSON.stringify(error || "Tier not found", null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const lessons = tier.lessons?.sort((a: { id: number }, b: { id: number }) => a.id - b.id) || [];

  return (
    <main className="min-h-screen bg-dots p-8 pb-32 relative overflow-hidden">
      {/* Background Aurora Glow - Blue Variant */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-glow-blue opacity-30 pointer-events-none -z-10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4"></div>

      <div className="max-w-3xl mx-auto animate-fadeUp z-10 relative">
        
        <header className="mb-12 border-b border-border-base pb-8">
          <Link href="/" className="label text-text-muted hover:text-text-primary transition-colors mb-6 block w-max hover-arrow">
            <span className="arrow tracking-normal">←</span> RETURN TO HUB
          </Link>
          <div className="label text-accent-green mb-3">
            TIER 0{tier.id}
          </div>
          <h1 className="heading-xl mb-4 text-gradient">
            {tier.title}
          </h1>
          <p className="body text-text-secondary">
            {tier.description}
          </p>
        </header>

        <div className="space-y-5">
          <div className="label text-text-muted mb-6">
            AVAILABLE MODULES
          </div>
          
          {lessons.map((lesson: any, index: number) => (
            <TiltCard key={lesson.id}>
              <Link 
                href={`/tier/${tier.id}/lesson/${lesson.id}`}
                className="card-interactive flex items-center justify-between group"
              >
                <div>
                  <div className="label mb-2 text-text-muted group-hover:text-accent-blue transition-colors">
                    MODULE 0{index + 1}
                  </div>
                  <h3 className="heading-md group-hover:text-text-primary transition-colors">
                    {lesson.title}
                  </h3>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div className="label text-accent-yellow border border-[rgba(255,209,102,0.2)] bg-[rgba(255,209,102,0.05)] px-2 py-1 rounded-sm">
                    {lesson.xp_reward} XP
                  </div>
                  <div className="label text-text-muted group-hover:text-text-primary transition-colors flex items-center gap-2">
                    INITIATE <span className="group-hover:translate-x-1 transition-transform text-accent-blue">→</span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}

          {lessons.length === 0 && (
            <div className="body italic p-10 border border-border-base border-dashed rounded-xl text-center bg-bg-surface">
              No modules forged for this tier yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
