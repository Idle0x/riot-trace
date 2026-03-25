import { notFound } from "next/navigation";
import { getTierCapstone } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function CapstonePage({ 
  params 
}: { 
  params: Promise<{ tierId: string; }> 
}) {
  const { tierId } = await params;
  const capstone = getTierCapstone(tierId);

  if (!capstone) notFound();

  const { frontmatter, content } = capstone;

  // Capstones are the ultimate final gate for the tier
  const tasks = [
    { 
      code: frontmatter.startingCode, 
      logic: frontmatter.validationLogic, 
      type: "capstone" 
    }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden">
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-border-dim custom-scrollbar">
        <header className="mb-8 border-b border-border-dim pb-4 uppercase font-mono">
          <div className="text-[10px] text-accent-purple tracking-widest mb-2">
            T{tierId} // FINAL_CAPSTONE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-accent-purple">{frontmatter.title}</h1>
        </header>
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={`capstone-${tierId}`} // Unique ID for XP tracking
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
        />
      </div>
    </div>
  );
}
