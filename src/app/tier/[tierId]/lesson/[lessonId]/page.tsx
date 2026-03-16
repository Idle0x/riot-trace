import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import LiveCodeRunner from "@/components/LiveCodeRunner";

export default async function LessonPage({ params }: { params: { tierId: string, lessonId: string } }) {
  const tierId = parseInt(params.tierId);
  const lessonId = parseInt(params.lessonId);

  // Fetch the specific lesson and any associated crucible tasks
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, crucible_tasks(*)")
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    notFound();
  }

  // Parse the content blocks (safely falling back to an empty array if null)
  const blocks = typeof lesson.content_blocks === 'string' 
    ? JSON.parse(lesson.content_blocks) 
    : lesson.content_blocks || [];

  return (
    <main className="min-h-screen dot-bg p-8 pb-32">
      <div className="max-w-3xl mx-auto animate-fadeUp">
        
        {/* Header & Navigation */}
        <header className="mb-10 border-b border-border pb-6 flex items-start justify-between">
          <div>
            <Link 
              href={`/tier/${tierId}`} 
              className="text-[10px] font-mono text-muted hover:text-white transition-colors uppercase tracking-[2px] mb-4 block"
            >
              ← RETURN TO TIER 0{tierId}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans leading-tight">
              {lesson.title}
            </h1>
          </div>
          <div className="bg-surf2 border border-border rounded-lg px-4 py-2 text-center flex-shrink-0">
            <div className="text-lg font-bold font-sans text-riotGreen">
              {lesson.xp_reward}
            </div>
            <div className="text-[9px] text-muted font-mono tracking-wider">
              XP REWARD
            </div>
          </div>
        </header>

        {/* Theory & Context Blocks */}
        <div className="space-y-8 mb-16">
          <div className="text-[10px] text-riotBlue tracking-[3px] font-mono mb-2">
            // EXECUTION CONTEXT
          </div>
          
          {blocks.map((block: any, index: number) => {
            if (block.type === 'markdown') {
              return (
                <p key={index} className="text-sm text-text leading-relaxed font-sans">
                  {block.body}
                </p>
              );
            }
            return null;
          })}
        </div>

        {/* The Crucible Workbench */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-riotGreen animate-pulse"></div>
            <div className="text-[10px] text-riotGreen tracking-[3px] font-mono">
              CRUCIBLE WORKBENCH_
            </div>
          </div>
          
          {/* Dynamically render the code runner if a task exists in the DB */}
          {lesson.crucible_tasks && lesson.crucible_tasks.length > 0 ? (
            <LiveCodeRunner 
              scenario={lesson.crucible_tasks[0].scenario}
              initialCode={lesson.crucible_tasks[0].starting_code}
              validationLogic={lesson.crucible_tasks[0].validation_logic?.test || ""}
            />
          ) : (
            <div className="text-sm text-muted italic text-center p-8 border border-border2 rounded-xl border-dashed">
              No crucible task assigned for this module yet.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
