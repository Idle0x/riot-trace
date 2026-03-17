import { supabase } from "@/lib/supabase";
import Link from "next/link";
import LiveCodeRunner from "@/components/LiveCodeRunner";

export default async function LessonPage({ params }: { params: Promise<{ tierId: string, lessonId: string }> }) {
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);
  const lessonId = parseInt(resolvedParams.lessonId);

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, crucible_tasks(*)")
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-8">
        <div className="border border-accent-red/30 bg-accent-red/5 p-6 rounded font-mono text-accent-red text-xs max-w-lg w-full text-center shadow-[0_0_20px_rgba(255,68,102,0.1)]">
          [FATAL_ERROR] // MODULE CORRUPTED OR OFFLINE.
        </div>
      </main>
    );
  }

  const task = lesson.crucible_tasks?.[0];

  return (
    <main className="flex-1 flex flex-col lg:flex-row h-full min-h-[calc(100vh-3.5rem)] bg-base animate-fade-up">
      
      {/* LEFT PANE: The Manual (Theory) */}
      <div className="w-full lg:w-5/12 xl:w-1/3 border-b lg:border-b-0 lg:border-r border-border-base flex flex-col bg-surface/30 relative">
        
        {/* Header Breadcrumbs */}
        <div className="p-4 md:p-6 border-b border-border-base bg-base/50 sticky top-0 z-10">
          <Link href={`/tier/${tierId}`} className="font-mono text-[10px] text-text-muted hover:text-white transition-colors flex items-center gap-2 mb-6 group w-max">
            <span className="text-accent-blue group-hover:-translate-x-1 transition-transform">←</span> 
            RETURN TO TIER 0{tierId}
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 rounded-sm border border-accent-blue/30 bg-accent-blue/10 text-accent-blue">
              MODULE 0{lesson.id}
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-accent-yellow border border-accent-yellow/20 bg-accent-yellow/5 px-2 py-0.5 rounded-sm">
              {lesson.xp_reward} XP
            </span>
          </div>
          
          <h1 className="heading-lg text-text-primary leading-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="font-mono text-[10px] text-text-muted border-b border-border-dim pb-2 mb-6 tracking-widest uppercase">
            THEORY // MENTAL MODEL
          </div>

          <div className="space-y-6 text-sm text-text-secondary leading-relaxed font-mono">
            {lesson.content_blocks?.map((block: any, i: number) => (
              <p key={i} className="text-text-primary/90">{block.body}</p>
            ))}
          </div>

          {task?.scenario && (
            <div className="mt-12 p-4 border border-accent-red/20 bg-accent-red/5 rounded-sm relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-red shadow-glow-red"></div>
              <div className="font-mono text-[10px] text-accent-red mb-2 tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-red rounded-full animate-pulse"></div>
                CRUCIBLE OBJECTIVE
              </div>
              <p className="text-xs font-mono text-text-primary">{task.scenario}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: The Machine (Crucible Execution) */}
      <div className="w-full lg:w-7/12 xl:w-2/3 p-4 md:p-6 bg-surface-sunken flex flex-col relative z-0">
        {/* Background ambient lighting for the execution pane */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(77,166,255,0.03),transparent_70%)] pointer-events-none"></div>

        {task ? (
          <LiveCodeRunner 
            initialCode={task.starting_code || ""}
            validationLogic={task.validation_logic?.test || ""}
            taskId={task.id}
            xpReward={lesson.xp_reward}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center border border-border-strong border-dashed rounded-sm text-text-muted font-mono text-xs p-8 text-center bg-base shadow-sunken">
            <span className="text-engraved">NO EXECUTION TASK FORGED FOR THIS MODULE.</span>
          </div>
        )}
      </div>

    </main>
  );
}
