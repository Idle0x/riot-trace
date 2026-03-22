import { notFound } from "next/navigation";
import { getLesson } from "@/lib/curriculum";
import LiveCodeRunner from "@/components/LiveCodeRunner";

// Adjust your params interface based on your exact folder names
interface LessonPageProps {
  params: {
    tierId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  // 1. Fetch the lesson data using the updated curriculum function
  const lesson = getLesson(params.tierId, params.moduleId, params.lessonId);

  // 2. 404 Fallback if the MDX file doesn't exist
  if (!lesson) {
    notFound();
  }

  const { frontmatter, content } = lesson;

  return (
    <div className="flex h-screen w-full bg-[#020203] text-white overflow-hidden">
      
      {/* ========================================= */}
      {/* LEFT PANE: Theory & MDX Content           */}
      {/* ========================================= */}
      <div className="w-1/2 h-full overflow-y-auto border-r border-border-base p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] font-mono tracking-widest text-accent-blue uppercase mb-2 block">
              Tier {frontmatter.tierId} // Module {frontmatter.moduleId} // Lesson {frontmatter.lessonId}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              {frontmatter.title}
            </h1>
          </div>

          {/* Note: If you are using next-mdx-remote or next/mdx, 
            replace this div with your <MDXRemote /> component 
          */}
          <div className="prose prose-invert prose-blue max-w-none text-text-secondary">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT PANE: The Crucible                  */}
      {/* ========================================= */}
      <div className="w-1/2 h-full p-6 flex flex-col bg-[#050505]">
        
        {/* Crucible Header & Scenario */}
        <div className="mb-4 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-mono tracking-widest text-text-primary uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></span>
              Execution Environment
            </h2>
            <span className="text-[10px] font-mono text-phosphor border border-phosphor/30 bg-phosphor/5 px-2 py-1 rounded-sm">
              +{frontmatter.xpReward} XP
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-mono bg-surface-sunken p-3 rounded-sm border border-border-dim">
            <span className="text-accent-yellow">OBJECTIVE:</span> {frontmatter.scenario}
          </p>
        </div>

        {/* The Upgraded Engine */}
        <div className="flex-1 min-h-0 relative">
          <LiveCodeRunner
            initialCode={frontmatter.startingCode || ""}
            validationLogic={frontmatter.validationLogic || ""}
            taskId={frontmatter.lessonId}
            xpReward={frontmatter.xpReward}
            syntaxHint={frontmatter.syntaxHint}
            mode={frontmatter.mode || "terminal"} // <-- The Mode Switch
            dbSeed={frontmatter.dbSeed || ""}     // <-- The SQL Setup Injector
          />
        </div>
        
      </div>
    </div>
  );
}
