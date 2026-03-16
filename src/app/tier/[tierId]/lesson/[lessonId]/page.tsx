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
      <main className="min-h-screen bg-dots p-8 pt-24">
        <div className="max-w-2xl mx-auto border border-accent-red bg-[rgba(255,68,102,0.08)] p-6 rounded-xl font-mono">
          <h2 className="text-accent-red font-bold mb-4 text-xl">LESSON FETCH FAILED</h2>
          <pre className="text-text-primary text-xs overflow-auto">
            {JSON.stringify(error || "Lesson not found", null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const task = lesson.crucible_tasks?.[0];

  return (
    <main className="min-h-screen bg-dots p-8 pb-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-glow-blue opacity-20 pointer-events-none -z-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-glow-green opacity-10 pointer-events-none -z-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto animate-fadeUp z-10 relative">
        
        {/* HEADER */}
        <header className="mb-12 border-b border-border-base pb-8">
          <Link href={`/tier/${tierId}`} className="label text-text-muted hover:text-text-primary transition-colors mb-6 block w-max hover-arrow">
            <span className="arrow">←</span> RETURN TO TIER 0{tierId}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="label text-accent-blue">
              MODULE 0{lesson.id}
            </span>
            <span className="label text-accent-yellow border border-[rgba(255,209,102,0.2)] bg-[rgba(255,209,102,0.05)] px-2 py-1 rounded-sm">
              {lesson.xp_reward} XP
            </span>
          </div>
          <h1 className="heading-xl">
            {lesson.title}
          </h1>
        </header>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: THEORY (Takes up 5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="label text-text-muted border-b border-border-base pb-3">
              THEORY / MENTAL MODEL
            </div>
            
            <div className="body text-text-secondary space-y-5">
              {lesson.content_blocks?.map((block: any, i: number) => (
                <p key={i}>{block.body}</p>
              ))}
            </div>

            {task?.scenario && (
              <div className="card-interactive mt-10 border-l-2 border-l-accent-red">
                <div className="label text-accent-red mb-3">
                  CRUCIBLE OBJECTIVE
                </div>
                <p className="body text-text-primary">{task.scenario}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: THE LIVE EXECUTOR (Takes up 7 columns) */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            {task ? (
              <LiveCodeRunner 
                initialCode={task.starting_code || ""}
                validationLogic={task.validation_logic?.test || ""}
                taskId={task.id}
                xpReward={lesson.xp_reward}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border-base rounded-xl text-text-muted text-sm font-mono p-8 text-center bg-bg-surface glass">
                No execution task forged for this module yet. Read the theory and return to Hub.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
