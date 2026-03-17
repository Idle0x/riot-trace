"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react"; // Assuming you have lucide-react, if not, standard SVGs work.

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
      const { data, error } = await supabase
        .from("user_progress")
        .select(`
          task_id,
          next_review_date,
          crucible_tasks (
            id,
            lesson_id,
            lessons (id, title, tier_id)
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
    <div className="mb-12 animate-fade-up">
      {/* Warning Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2 bg-accent-red rounded-sm shadow-glow-red animate-pulse"></div>
        <div className="text-[10px] text-accent-red tracking-[0.3em] font-mono font-bold">
          URGENT ACTION QUEUE // MEMORY DECAY DETECTED
        </div>
      </div>

      {/* Warning Container with Diagonal Stripes */}
      <div 
        className="border border-accent-red/30 rounded-lg overflow-hidden bg-[#1A0A0F]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255, 68, 102, 0.05) 10px, rgba(255, 68, 102, 0.05) 20px)'
        }}
      >
        <div className="divide-y divide-accent-red/20">
          {dueTasks.map((task: any) => {
            const lesson = task.crucible_tasks?.lessons;
            if (!lesson) return null;

            return (
              <Link
                key={task.task_id}
                href={`/tier/${lesson.tier_id}/lesson/${lesson.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base/80 hover:bg-accent-red/10 transition-colors group"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="p-2 bg-accent-red/10 text-accent-red rounded border border-accent-red/20 group-hover:bg-accent-red group-hover:text-white transition-colors">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-text-muted mb-1 flex items-center gap-2">
                      <Clock size={10} className="text-accent-red" />
                      REVIEW OVERDUE
                    </div>
                    <div className="text-sm font-bold text-text-primary group-hover:text-accent-red transition-colors">
                      {lesson.title}
                    </div>
                  </div>
                </div>
                
                {/* Execute Button Hook */}
                <div className="font-mono text-[10px] font-bold text-accent-red tracking-widest border border-accent-red/30 px-4 py-2 rounded-sm bg-accent-red/5 group-hover:bg-accent-red group-hover:text-white transition-all flex items-center justify-center gap-2">
                  INITIATE RECOVERY <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
