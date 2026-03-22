"use server";

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const REWARDS = {
  theory: 2,
  drill: 5,
  task_1: 10,    // Replication
  task_2: 20,    // Mutation
  task_3: 40,    // Synthesis
  boss: 150,     // Module Boss Fight
  capstone: 500  // Tier Capstone
};

export async function saveTaskProgress(taskId: string, type: keyof typeof REWARDS) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const xpToAward = REWARDS[type];

    // 1. Log the Transaction (The Ledger)
    const { error: ledgerError } = await supabase
      .from('xp_ledger')
      .insert({ 
        user_id: user.id, 
        amount: xpToAward, 
        reason: `completion_${type}`, 
        reference_id: taskId 
      });

    if (ledgerError) throw ledgerError;

    // 2. Update the Completion State (The Pulse)
    // This resets the 48-hour decay timer automatically
    const { error: completionError } = await supabase
      .from('lesson_completions')
      .upsert({ 
        user_id: user.id, 
        lesson_id: taskId,
        last_reviewed_at: new Array().toISOString() 
      }, { onConflict: 'user_id, lesson_id' });

    if (completionError) throw completionError;
    
    return { success: true, xp: xpToAward };
  } catch (error) {
    console.error("CRITICAL_LEDGER_FAILURE:", error);
    return { success: false };
  }
}
