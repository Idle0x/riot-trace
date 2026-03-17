"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function ForgePage() {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);

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
    setProgress(0);

    // Terminal progress simulation
    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.floor(Math.random() * 15) : 95));
    }, 150);

    try {
      // 1. Insert the Lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .insert({
          tier_id: parseInt(tierId),
          title: title,
          xp_reward: parseInt(xpReward),
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
            validation_logic: { test: validationLogic }
          });

        if (taskError) throw taskError;
      }

      clearInterval(progressInterval);
      setProgress(100);
      setStatus("success");

      // Reset form after delay
      setTimeout(() => {
        setTitle("");
        setTheory("");
        setScenario("");
        setStartingCode("");
        setValidationLogic("");
        setStatus("idle");
        setProgress(0);
      }, 2500);

    } catch (error: any) {
      clearInterval(progressInterval);
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-up">
      <div className="w-full max-w-3xl relative z-10">

        <header className="mb-12 border-b border-border-base pb-6">
          <Link href="/" className="font-mono text-[9px] text-text-muted hover:text-white transition-colors flex items-center gap-2 mb-6 group w-max tracking-widest uppercase">
            <span className="text-accent-blue group-hover:-translate-x-1 transition-transform">←</span> 
            TERMINATE CONNECTION
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-red shadow-glow-red animate-pulse-slow"></div>
            <div className="text-[9px] text-accent-red tracking-[0.3em] font-mono font-bold uppercase">
              RESTRICTED_ACCESS // ROOT_REQUIRED
            </div>
          </div>
          <h1 className="heading-xl text-text-primary">
            The <span className="text-engraved text-white/50">Forge.</span>
          </h1>
          <p className="font-mono text-[11px] text-text-secondary mt-2 tracking-wide uppercase">
            Initialize new execution parameters into the matrix.
          </p>
        </header>

        <form onSubmit={handleForge} className="space-y-10">

          {/* 1. LESSON METADATA */}
          <div className="space-y-6">
            <div className="font-mono text-[9px] text-accent-blue tracking-[0.2em] border-b border-border-base pb-2 flex items-center justify-between">
              <span>01 // METADATA_INJECTION</span>
              <span className="text-text-dim">SYS.DB_WRITE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-blue">Target Architecture Tier</label>
                <select 
                  value={tierId} 
                  onChange={(e) => setTierId(e.target.value)}
                  className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors cursor-pointer appearance-none rounded-none"
                >
                  <option value="1" className="bg-base">Tier 1: Code Literacy</option>
                  <option value="2" className="bg-base">Tier 2: JavaScript Deeply</option>
                  <option value="3" className="bg-base">Tier 3: React Mental Model</option>
                  <option value="4" className="bg-base">Tier 4: The Web Platform</option>
                  <option value="5" className="bg-base">Tier 5: Databases & Backend</option>
                  <option value="6" className="bg-base">Tier 6: CS Essentials</option>
                  <option value="7" className="bg-base">Tier 7: System Design</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-blue">XP Bounty</label>
                <input 
                  type="number" 
                  value={xpReward} 
                  onChange={(e) => setXpReward(e.target.value)}
                  className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-accent-yellow font-mono focus:outline-none focus:border-accent-yellow transition-colors placeholder:text-border-strong rounded-none"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-blue">Module Designation (Title)</label>
              <input 
                type="text" 
                required
                placeholder="e.g., The Event Loop: Why JS Doesn't Freeze"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong py-2 text-[15px] font-bold text-text-primary font-sans focus:outline-none focus:border-accent-blue transition-colors placeholder:text-text-dim rounded-none"
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-blue">Mental Model Payload (Markdown)</label>
              <textarea 
                required
                rows={4}
                placeholder="Inject theoretical context here..."
                value={theory} 
                onChange={(e) => setTheory(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-text-primary font-mono focus:outline-none focus:border-accent-blue transition-colors placeholder:text-text-dim resize-y custom-scrollbar rounded-none"
              />
            </div>
          </div>

          {/* 2. CRUCIBLE TASK CONFIGURATION */}
          <div className="space-y-6 pt-4">
            <div className="font-mono text-[9px] text-accent-red tracking-[0.2em] border-b border-border-base pb-2 flex items-center justify-between">
              <span>02 // CRUCIBLE_PARAMETERS (OPTIONAL)</span>
              <span className="text-text-dim">SYS.EXEC_ENV</span>
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-red">Objective Scenario</label>
              <textarea 
                rows={2}
                placeholder="Define execution requirements..."
                value={scenario} 
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-text-primary font-mono focus:outline-none focus:border-accent-red transition-colors placeholder:text-text-dim resize-y custom-scrollbar rounded-none"
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-green">Initial State (Code)</label>
              <textarea 
                rows={4}
                placeholder="// Define environment state..."
                value={startingCode} 
                onChange={(e) => setStartingCode(e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-accent-green font-mono focus:outline-none focus:border-accent-green transition-colors placeholder:text-text-dim resize-y custom-scrollbar rounded-none"
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent-red">Hidden Validation Logic (Throw Error on Fail)</label>
              <textarea 
                rows={3}
                placeholder={`if (!success) throw new Error("Task Failed");`}
                value={validationLogic} 
                onChange={(e) => setValidationLogic(e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent border-b border-border-strong py-2 text-[13px] text-accent-red font-mono focus:outline-none focus:border-accent-red transition-colors placeholder:text-text-dim resize-y custom-scrollbar rounded-none"
              />
            </div>
          </div>

          {/* SUBMIT / TERMINAL OUTPUT */}
          <div className="pt-8">
            <MagneticButton
              className={`w-full py-4 rounded-sm font-mono text-[11px] tracking-[0.2em] font-bold uppercase transition-all border shadow-plate
                ${status === "saving" ? "bg-surface border-border-strong text-text-muted cursor-wait" :
                  status === "success" ? "bg-accent-green/10 border-accent-green text-phosphor cursor-default" :
                  "bg-text-primary border-transparent text-base hover:bg-accent-blue hover:shadow-glow-blue hover:text-base"}
              `}
            >
              {status === "saving" ? `[ FORGING_MODULE... ${progress}% ]` : 
               status === "success" ? "[ MODULE_FORGED // SYS.VERIFIED ]" : 
               "[ INITIATE WRITE SEQUENCE ]"}
            </MagneticButton>

            {status === "error" && (
              <div className="mt-4 text-accent-red text-[11px] font-mono font-bold tracking-widest text-center animate-[shake_0.4s_cubic-bezier(.36,.07,.19,.97)_both]">
                [FATAL_ERROR] // {errorMessage.toUpperCase()}
              </div>
            )}
          </div>

        </form>
      </div>
    </main>
  );
}
