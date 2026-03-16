"use server";

import { supabase } from "@/lib/supabase";

export async function saveTaskProgress(userId: string, taskId: number, xpReward: number) {
  // Calculate the next review date (e.g., 24 hours from now for the first successful run)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // We use "upsert" so if you run it multiple times, it just updates the existing record
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        task_id: taskId,
        status: "completed",
        score: xpReward,
        next_review_date: tomorrow.toISOString(),
      },
      { onConflict: "user_id, task_id" }
    );

  if (error) {
    console.error("Failed to save progress:", error);
    throw new Error("Database update failed.");
  }

  return { success: true };
}
