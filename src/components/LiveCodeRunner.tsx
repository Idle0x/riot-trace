"use client";

import { useState, useRef, useEffect } from "react";
import { saveTaskProgress } from "@/app/actions";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function LiveCodeRunner({ initialCode, validationLogic, taskId, xpReward }: any) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setOutput([]);
    setStatus("idle");
  }, [initialCode]);

  const executeCode = async () => {
    setStatus("running");
    setOutput([]);
    const logs: string[] = [];

    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" "));
      originalConsoleLog(...args);
    };

    try {
      const fullCode = `
        ${code}
        
        // --- HIDDEN VALIDATION ---
        ${validationLogic}
      `;

      const sandbox = new Function(fullCode);
      sandbox();

      logs.push("✅ TASK PASSED: Validation successful.");
      setOutput(logs);
      setStatus("success");

      const userId = localStorage.getItem("riot_trace_user_id") || "anon_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("riot_trace_user_id", userId);

      await saveTaskProgress(userId, taskId, xpReward);

    } catch (err: any) {
      logs.push(`❌ ERROR: ${err.message}`);
      setOutput(logs);
      setStatus("error");
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border border-border-base rounded-xl overflow-hidden shadow-card">
      
      {/* Editor Header */}
      <div className="bg-bg-surface-2 border-b border-border-base p-3 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-border-strong"></div>
          <div className="w-3 h-3 rounded-full bg-border-strong"></div>
          <div className="w-3 h-3 rounded-full bg-border-strong"></div>
        </div>
        <div className="label text-text-muted tracking-widest">
          CRUCIBLE_TERMINAL //
        </div>
      </div>

      {/* Code Input */}
      <div className="flex-1 relative border-b border-border-base">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 w-full h-full bg-transparent text-accent-green p-5 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:bg-[rgba(0,255,170,0.02)] transition-colors"
        />
      </div>

      {/* Console Output */}
      <div className="h-48 bg-bg-base p-5 font-mono text-xs overflow-y-auto">
        <div className="text-text-dim mb-2">] Console Output...</div>
        {output.map((line, i) => (
          <div key={i} className={`mb-1 ${line.startsWith("❌") ? "text-accent-red" : line.startsWith("✅") ? "text-accent-green glow" : "text-text-primary"}`}>
            {line}
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-bg-surface-2 flex justify-between items-center">
        <div className="label text-text-muted">
          {status === "success" ? "XP REWARDED" : "AWAITING EXECUTION"}
        </div>
        <MagneticButton
          onClick={executeCode}
          className={`px-6 py-2 rounded-md font-mono text-xs font-bold tracking-widest transition-all ${
            status === "success" 
              ? "bg-[rgba(0,255,170,0.1)] border border-accent-green text-accent-green" 
              : "bg-text-primary text-bg-base hover:bg-accent-green hover:shadow-glow-green"
          }`}
        >
          {status === "running" ? "EXECUTING..." : status === "success" ? "EXECUTED ✅" : "EXECUTE CODE"}
        </MagneticButton>
      </div>

    </div>
  );
}
