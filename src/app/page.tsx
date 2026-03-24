import { getAllTiers, Tier } from "@/lib/curriculum";
import { TierCard } from "@/components/ui/TierCard";

export default function Hub() {
  const tiers: Tier[] = getAllTiers();

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-text-primary p-6 md:p-12 lg:p-20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-green/5 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <header className="mb-20 animate-fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-accent-blue"></div>
            <span className="font-mono text-[10px] tracking-[0.4em] text-accent-blue uppercase">
              Curriculum_Matrix // v1.0.0
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-6 leading-tight">
            The Crucible <span className="text-text-muted">Awaits.</span>
          </h1>
          
          <p className="text-text-secondary font-mono text-sm md:text-base max-w-2xl leading-relaxed uppercase tracking-widest border-l border-border-dim pl-6">
            No passenger seats. Everything here is executed, evaluated, and earned. 
            Select an architecture tier from the matrix to trace execution.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {tiers.map((tier) => (
            <TierCard 
              key={tier.id} 
              tier={tier} 
              lessonCount={tier.lessonCount}
              isUnlocked={tier.id === 1} 
            />
          ))}
        </section>

        <footer className="mt-20 pt-8 border-t border-border-dim flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="font-mono text-[9px] tracking-widest uppercase">
            System_Status: <span className="text-accent-green">Operational</span>
          </div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-text-dim">
            &copy; 2026 RIOT_TRACE // SOVEREIGN_ED
          </div>
        </footer>
      </div>
    </main>
  );
}
