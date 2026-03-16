"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DailyReview() {
  const [dueTasks, setDueTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const userId = localStorage.getItem("riot_trace_user_id");
      if (!userId) {
        setLoading(false);
        return;
      }

      const now = new Date().toISOString();

      // Fetch tasks where the review date is today or earlier
      const { data, error } = await supabase
        .from("user_progress")
        .select(`
          task_id,
          next_review_date,
          crucible_tasks (
            id,
            lesson_id,
            lessons (
              id,
              title,
              tier_id
            )
          )
        `)
        .eq("user_id", userId)
        .lte("next_review_date", now);

      if (!error && data) {
        setDueTasks(data);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  if (loading || dueTasks.length === 0) return null;

  return (
    <div className="mb-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-riotRed animate-pulse"></div>
        <div className="text-[10px] text-riotRed tracking-[3px] font-mono">
          ACTION REQUIRED: SPACED REPETITION
        </div>
      </div>
      
      <div className="grid gap-3">
        {dueTasks.map((task: any) => {
          const lesson = task.crucible_tasks?.lessons;
          if (!lesson) return null;
          
          return (
            <Link
              key={task.task_id}
              href={`/tier/${lesson.tier_id}/lesson/${lesson.id}`}
              className="bg-surf2 border border-riotRed/30 hover:border-riotRed p-4 rounded-xl flex items-center justify-between transition-colors group"
            >
              <div>
                <div className="text-sm font-bold text-white mb-1 group-hover:text-riotRed transition-colors">
                  {lesson.title}
                </div>
                <div className="text-[10px] text-muted font-mono">
                  MEMORY DECAY DETECTED — REVIEW PENDING
                </div>
              </div>
              <div className="text-riotRed font-mono text-sm tracking-widest group-hover:translate-x-1 transition-transform">
                EXECUTE →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
