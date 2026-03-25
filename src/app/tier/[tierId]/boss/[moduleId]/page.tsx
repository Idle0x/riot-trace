import { notFound } from "next/navigation";
import { getModuleBoss } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function BossPage({ 
  params 
}: { 
  params: Promise<{ tierId: string; moduleId: string; }> 
}) {
  const { tierId, moduleId } = await params;
  const boss = getModuleBoss(tierId, parseInt(moduleId, 10));

  if (!boss) notFound();

  const { frontmatter, content } = boss;

  // Boss fights are a single, monolithic challenge
  const tasks = [
    { 
      code: frontmatter.startingCode, 
      logic: frontmatter.validationLogic, 
      type: "boss" 
    }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden">
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-border-dim custom-scrollbar">
        <header className="mb-8 border-b border-border-dim pb-4 uppercase font-mono">
          <div className="text-[10px] text-accent-red tracking-widest mb-2">
            T{tierId} // M{moduleId} // BOSS_FIGHT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-accent-red">{frontmatter.title}</h1>
        </header>
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={`boss-${tierId}-${moduleId}`} // Unique ID for XP tracking
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
        />
      </div>
    </div>
  );
}
