"use server";

import { supabase } from "@/lib/supabase";

export async function saveTaskProgress(userId: string, taskId: number, xpReward: number) {
  // 1. Check if the user already has progress for this task
  const { data: existingProgress } = await supabase
    .from("user_progress")
    .select("score, next_review_date")
    .eq("user_id", userId)
    .eq("task_id", taskId)
    .single();

  const now = new Date();
  const nextReview = new Date();

  // 2. Simple Spaced Repetition Logic
  if (existingProgress) {
    // If they are reviewing it, push the next review out by 3 days
    nextReview.setDate(now.getDate() + 3);
  } else {
    // First time passing: review tomorrow
    nextReview.setDate(now.getDate() + 1);
  }

  // 3. Upsert the new progress
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        task_id: taskId,
        status: "completed",
        score: existingProgress ? existingProgress.score : xpReward, // Don't give double XP for reviews
        next_review_date: nextReview.toISOString(),
      },
      { onConflict: "user_id, task_id" }
    );

  if (error) {
    console.error("Failed to save progress:", error);
    throw new Error("Database update failed.");
  }

  return { success: true };
}
