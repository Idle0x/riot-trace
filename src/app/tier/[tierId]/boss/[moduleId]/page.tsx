import { notFound } from "next/navigation";
import { getModuleBoss } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from "next/link"; // Required for the back button

export default async function BossPage({ 
  params 
}: { 
  params: Promise<{ tierId: string; moduleId: string; }> 
}) {
  const { tierId, moduleId } = await params;
  const boss = getModuleBoss(tierId, parseInt(moduleId, 10));

  if (!boss) notFound();

  const { frontmatter, content } = boss;

  const tasks = [
    { 
      code: frontmatter.startingCode, 
      logic: frontmatter.validationLogic, 
      type: "boss" 
    }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden pt-14">
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-border-dim custom-scrollbar">
        
        {/* LOCAL COMMAND HEADER */}
        <header className="mb-8 border-b border-border-dim pb-6 uppercase font-mono relative">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href={`/tier/${tierId}`} 
              className="text-[9px] text-text-muted hover:text-accent-red tracking-widest flex items-center gap-2 transition-colors border border-transparent hover:border-accent-red/30 px-2 py-1 rounded-sm bg-surface-sunken"
            >
              [ ← ABORT TASK ]
            </Link>
          </div>

          <div className="text-[10px] text-accent-red tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-red rounded-sm animate-pulse"></div>
            T{tierId} // M{moduleId} // BOSS_FIGHT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-accent-red">{frontmatter.title}</h1>
        </header>

        <div className="prose prose-invert prose-p:text-text-secondary prose-headings:text-white max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={`boss-${tierId}-${moduleId}`}
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
        />
      </div>
    </div>
  );
}
