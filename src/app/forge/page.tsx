"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgePage() {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [tierId, setTierId] = useState("1");
  const [title, setTitle] = useState("");
  const [theory, setTheory] = useState("");
  const [xpReward, setXpReward] = useState("100");
  
  // Task State
  const [scenario, setScenario] = useState("");
  const [startingCode, setStartingCode] = useState("");
  const [validationLogic, setValidationLogic] = useState("");

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      // 1. Insert the Lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .insert({
          tier_id: parseInt(tierId),
          title: title,
          xp_reward: parseInt(xpReward),
          // We structure the theory text into the JSON block format our app expects
          content_blocks: [{ type: "markdown", body: theory }]
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // 2. Insert the Crucible Task linked to the new lesson
      if (scenario || startingCode || validationLogic) {
        const { error: taskError } = await supabase
          .from("crucible_tasks")
          .insert({
            lesson_id: lessonData.id,
            scenario: scenario,
            starting_code: startingCode,
            // Wrap the validation logic in the JSON structure expected by the runner
            validation_logic: { test: validationLogic }
          });

        if (taskError) throw taskError;
      }

      setStatus("success");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle("");
        setTheory("");
        setScenario("");
        setStartingCode("");
        setValidationLogic("");
        setStatus("idle");
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen dot-bg p-8 pb-32">
      <div className="max-w-3xl mx-auto animate-fadeUp">
        
        <header className="mb-10 border-b border-border pb-6">
          <Link href="/" className="text-[10px] font-mono text-muted hover:text-white transition-colors uppercase tracking-[2px] mb-4 block">
            ← RETURN TO HUB
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-riotYellow animate-pulse"></div>
            <div className="text-[10px] text-riotYellow tracking-[3px] font-mono">
              RESTRICTED AREA
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-sans leading-tight">
            The Forge.
          </h1>
          <p className="text-sm text-muted mt-2">
            Convert real-world knowledge into permanent execution tasks.
          </p>
        </header>

        <form onSubmit={handleForge} className="space-y-8">
          
          {/* LESSON CONFIGURATION */}
          <div className="bg-surf border border-border2 p-6 rounded-xl space-y-4">
            <div className="text-[10px] text-riotBlue tracking-widest font-mono border-b border-border2 pb-2 mb-4">
              1. LESSON METADATA
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-2">Target Tier</label>
                <select 
                  value={tierId} 
                  onChange={(e) => setTierId(e.target.value)}
                  className="w-full bg-bg border border-border2 rounded-md p-2 text-sm text-white font-mono focus:outline-none focus:border-riotBlue"
                >
                  <option value="1">Tier 1: Code Literacy</option>
                  <option value="2">Tier 2: JavaScript Deeply</option>
                  <option value="3">Tier 3: React Mental Model</option>
                  <option value="4">Tier 4: The Web Platform</option>
                  <option value="5">Tier 5: Databases & Backend</option>
                  <option value="6">Tier 6: CS Essentials</option>
                  <option value="7">Tier 7: System Design</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2">XP Reward</label>
                <input 
                  type="number" 
                  value={xpReward} 
                  onChange={(e) => setXpReward(e.target.value)}
                  className="w-full bg-bg border border-border2 rounded-md p-2 text-sm text-white font-mono focus:outline-none focus:border-riotBlue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">Module Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g., The Event Loop: Why JS Doesn't Freeze"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-bg border border-border2 rounded-md p-2 text-sm text-white font-sans focus:outline-none focus:border-riotBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">Theory / Context (Markdown)</label>
              <textarea 
                required
                rows={4}
                placeholder="Explain the concept clearly before the user faces the crucible..."
                value={theory} 
                onChange={(e) => setTheory(e.target.value)}
                className="w-full bg-bg border border-border2 rounded-md p-3 text-sm text-white font-sans focus:outline-none focus:border-riotBlue resize-y"
              />
            </div>
          </div>

          {/* CRUCIBLE CONFIGURATION */}
          <div className="bg-[#0A0A0F] border border-border2 p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="text-[10px] text-riotRed tracking-widest font-mono border-b border-border2 pb-2 mb-4">
              2. CRUCIBLE TASK (OPTIONAL)
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">Objective Scenario</label>
              <textarea 
                rows={2}
                placeholder="What exactly must the user do to pass?"
                value={scenario} 
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-bg border border-border2 rounded-md p-3 text-sm text-white font-sans focus:outline-none focus:border-riotRed resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">Starting Code</label>
              <textarea 
                rows={5}
                placeholder="// Define variables, set up the broken state, etc."
                value={startingCode} 
                onChange={(e) => setStartingCode(e.target.value)}
                spellCheck={false}
                className="w-full bg-bg border border-border2 rounded-md p-3 text-sm text-riotGreen font-mono focus:outline-none focus:border-riotRed resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">Hidden Validation Logic (Throws Error on Fail)</label>
              <textarea 
                rows={4}
                placeholder={`if (myVariable !== true) throw new Error("Task Failed: You didn't set myVariable to true");`}
                value={validationLogic} 
                onChange={(e) => setValidationLogic(e.target.value)}
                spellCheck={false}
                className="w-full bg-bg border border-border2 rounded-md p-3 text-sm text-riotRed font-mono focus:outline-none focus:border-riotRed resize-y"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button 
            type="submit"
            disabled={status === "saving" || status === "success"}
            className={`w-full py-4 rounded-xl font-mono text-xs tracking-widest transition-all ${
              status === "saving" ? "bg-border text-muted" :
              status === "success" ? "bg-riotGreen text-bg" :
              "bg-white text-bg hover:bg-muted"
            }`}
          >
            {status === "saving" ? "FORGING MODULE..." : 
             status === "success" ? "MODULE ADDED TO DATABASE ✅" : 
             "FORGE NEW CRUCIBLE MODULE"}
          </button>

          {status === "error" && (
            <div className="text-riotRed text-sm font-mono text-center p-4 border border-riotRed/30 rounded-lg bg-riotRed/10">
              ⚠️ {errorMessage}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}
