import { notFound } from "next/navigation";
import { getTierCapstone } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from "next/link"; // Required for the back button

export default async function CapstonePage({ 
  params 
}: { 
  params: Promise<{ tierId: string; }> 
}) {
  const { tierId } = await params;
  const capstone = getTierCapstone(tierId);

  if (!capstone) notFound();

  const { frontmatter, content } = capstone;

  const tasks = [
    { 
      code: frontmatter.startingCode, 
      logic: frontmatter.validationLogic, 
      type: "capstone" 
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

          <div className="text-[10px] text-accent-purple tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-purple rounded-sm animate-pulse"></div>
            T{tierId} // FINAL_CAPSTONE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-accent-purple">{frontmatter.title}</h1>
        </header>

        <div className="prose prose-invert prose-p:text-text-secondary prose-headings:text-white max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={`capstone-${tierId}`}
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
        />
      </div>
    </div>
  );
}
