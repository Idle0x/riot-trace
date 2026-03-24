import Link from "next/link";
import { MagneticButton } from "./MagneticButton";

interface TierCardProps {
  tier: {
    id: number;
    title: string;
    subtitle: string;
    lessonCount?: number;
  };
  lessonCount?: number; // Allows page.tsx to pass this prop directly
  isUnlocked: boolean;
}

export function TierCard({ tier, lessonCount, isUnlocked }: TierCardProps) {
  // Use the explicit prop if passed, otherwise fall back to tier object, otherwise 0
  const displayCount = lessonCount ?? tier.lessonCount ?? 0;

  return (
    <div className={`relative w-full border border-border-base bg-base overflow-hidden transition-all duration-300 ${isUnlocked ? 'hover:border-accent-green' : 'opacity-60'}`}>
      
      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-base/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="border border-border-dim px-4 py-2 bg-surface text-text-dim font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-red rounded-full"></div>
            ENCRYPTED
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className={`h-1 w-full ${isUnlocked ? 'bg-accent-green' : 'bg-border-strong'}`}></div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Tier Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-[10px] uppercase tracking-widest ${isUnlocked ? 'text-accent-green' : 'text-text-muted'}`}>
              TIER 0{tier.id}
            </span>
            {!isUnlocked && <span className="text-[9px] font-mono text-text-dim tracking-widest">LOCKED</span>}
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-text-primary mb-1">
            {tier.title}
          </h2>
          <p className="text-text-secondary font-mono text-xs">
            {tier.subtitle}
          </p>
        </div>

        {/* Stats & Action */}
        <div className="flex items-center gap-8 md:border-l md:border-border-dim md:pl-8">
          <div className="flex flex-col">
            <span className="text-3xl font-sans font-bold tracking-tighter text-text-primary">
              {displayCount}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted mt-1">
              LESSONS
            </span>
          </div>

          {isUnlocked ? (
            <Link href={`/tier/${tier.id}`}>
              <MagneticButton className="px-6 py-3 border border-border-strong bg-surface hover:border-accent-green hover:text-accent-green text-text-primary font-mono text-[10px] tracking-widest uppercase transition-colors shadow-plate">
                ENTER MATRIX
              </MagneticButton>
            </Link>
          ) : (
            <div className="px-6 py-3 border border-border-dim bg-surface-sunken text-text-muted font-mono text-[10px] tracking-widest uppercase cursor-not-allowed">
              OFFLINE
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
