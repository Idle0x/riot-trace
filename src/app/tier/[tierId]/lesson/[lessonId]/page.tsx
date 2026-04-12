import { notFound } from "next/navigation";
import { getLessonByTierAndId } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from "next/link"; // Added Link

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ tierId: string; lessonId: string; }> 
}) {
  const { tierId, lessonId } = await params;
  const lesson = getLessonByTierAndId(tierId, lessonId);

  if (!lesson) notFound();

  const { frontmatter, content } = lesson;

  const tasks = frontmatter.task1Code 
    ? [
        { code: frontmatter.task1Code, logic: frontmatter.task1Logic, type: "task_1" },
        { code: frontmatter.task2Code, logic: frontmatter.task2Logic, type: "task_2" },
        { code: frontmatter.task3Code, logic: frontmatter.task3Logic, type: "task_3" }
      ]
    : [
        { code: frontmatter.startingCode, logic: frontmatter.validationLogic, type: "task_3" }
      ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden pt-14"> {/* Added pt-14 to clear your fixed Navbar */}
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-border-dim custom-scrollbar">
        
        {/* --- LOCAL COMMAND HEADER --- */}
        <header className="mb-8 border-b border-border-dim pb-6 uppercase font-mono relative">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href={`/tier/${tierId}`} 
              className="text-[9px] text-text-muted hover:text-accent-red tracking-widest flex items-center gap-2 transition-colors border border-transparent hover:border-accent-red/30 px-2 py-1 rounded-sm bg-surface-sunken"
            >
              [ ← ABORT TASK ]
            </Link>
          </div>
          
          <div className="text-[10px] text-accent-blue tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-blue rounded-sm animate-pulse"></div>
            T{tierId} // L{lessonId}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{frontmatter.title}</h1>
        </header>

        <div className="prose prose-invert prose-p:text-text-secondary prose-headings:text-white max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={frontmatter.lessonId}
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
          syntaxHint={frontmatter.syntaxHint}
        />
      </div>
    </div>
  );
}
