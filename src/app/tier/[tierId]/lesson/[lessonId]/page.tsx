import { supabase } from "@/lib/supabase";
import Link from "next/link";
import LiveCodeRunner from "@/components/LiveCodeRunner";

export default async function LessonPage({ params }: { params: Promise<{ tierId: string, lessonId: string }> }) {
  // 1. Await the params promise (The Next.js 15+ Fix)
  const resolvedParams = await params;
  const tierId = parseInt(resolvedParams.tierId);
  const lessonId = parseInt(resolvedParams.lessonId);

  // 2. Fetch the lesson and its associated crucible task
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, crucible_tasks(*)")
    .eq("id", lessonId)
    .single();

  // THE DEBUG TRAP: Print the exact error instead of a generic 404
  if (error || !lesson) {
    return (
      <main className="min-h-screen dot-bg p-8 pt-24">
        <div className="max-w-2xl mx-auto border border-riotRed bg-riotRed/10 p-6 rounded-xl font-mono">
          <h2 className="text-riotRed font-bold mb-4 text-xl">LESSON FETCH FAILED</h2>
          <p className="text-white mb-2">Attempted to fetch Lesson ID: {lessonId}</p>
          <p className="text-muted mb-4">Error Details:</p>
          <pre className="text-riotYellow text-xs overflow-auto">
            {JSON.stringify(error || "Lesson not found in database", null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  // Safely extract the task if it exists
  const task = lesson.crucible_tasks?.[0];

  return (
    <main className="min-h-screen dot-bg p-8 pb-32">
      <div className="max-w-5xl mx-auto animate-fadeUp">
        
        {/* HEADER */}
        <header className="mb-8 border-b border-border pb-6">
          <Link href={`/tier/${tierId}`} className="text-[10px] font-mono text-muted hover:text-white transition-colors uppercase tracking-[2px] mb-4 block">
            ← RETURN TO TIER 0{tierId}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-riotBlue tracking-[3px] font-mono">
              MODULE 0{lesson.id}
            </span>
            <span className="text-[10px] text-riotYellow tracking-[3px] font-mono border border-riotYellow/30 px-2 rounded-sm bg-riotYellow/10">
              {lesson.xp_reward} XP
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white font-sans leading-tight">
            {lesson.title}
          </h1>
        </header>

        {/* TWO COLUMN LAYOUT: THEORY vs EXECUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: THEORY */}
          <div className="space-y-6">
            <div className="text-[10px] text-muted tracking-[3px] font-mono border-b border-border2 pb-2">
              THEORY / MENTAL MODEL
            </div>
            
            <div className="text-sm text-gray-300 leading-relaxed font-sans space-y-4">
              {lesson.content_blocks?.map((block: any, i: number) => (
                <p key={i}>{block.body}</p>
              ))}
            </div>

            {task?.scenario && (
              <div className="mt-8 bg-surf border border-border2 p-5 rounded-xl border-l-2 border-l-riotRed">
                <div className="text-[10px] text-riotRed tracking-[3px] font-mono mb-2">
                  CRUCIBLE OBJECTIVE
                </div>
                <p className="text-sm text-white">{task.scenario}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: THE LIVE EXECUTOR */}
          <div className="h-full min-h-[500px]">
            {task ? (
              <LiveCodeRunner 
                initialCode={task.starting_code || ""}
                validationLogic={task.validation_logic?.test || ""}
                taskId={task.id}
                xpReward={lesson.xp_reward}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border2 rounded-xl text-muted text-sm font-mono p-8 text-center bg-surf/50">
                No execution task forged for this module yet. Read the theory and return to Hub.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
