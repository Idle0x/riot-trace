"use client";

import { useState, useRef, useEffect } from "react";
import { saveTaskProgress } from "@/app/actions";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function LiveCodeRunner({ initialCode, validationLogic, taskId, xpReward }: any) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Line number calculation for the gutter
  const lineCount = code.split("\n").length;
  const lines = Array.from({ length: Math.max(lineCount, 5) }, (_, i) => i + 1);

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

      // Artificial delay to simulate processing and trigger the scanning animation
      await new Promise(resolve => setTimeout(resolve, 600));

      const sandbox = new Function(fullCode);
      sandbox();

      logs.push(">> SYS.VERIFIED");
      logs.push(">> TASK PASSED: VALIDATION SUCCESSFUL.");
      setOutput(logs);
      setStatus("success");

      const userId = localStorage.getItem("riot_trace_user_id") || "anon_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("riot_trace_user_id", userId);

      await saveTaskProgress(userId, taskId, xpReward);
      
      // Dispatch XP update to the Global Command Bar
      window.dispatchEvent(new Event("xp_updated"));

    } catch (err: any) {
      logs.push(`>> FATAL_ERROR: ${err.message}`);
      setOutput(logs);
      setStatus("error");
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      
      {/* Editor Chassis */}
      <div 
        className={`flex-1 flex flex-col bg-base border rounded-t-sm overflow-hidden transition-colors duration-300 shadow-plate
          ${isFocused ? 'border-accent-blue' : status === 'error' ? 'border-accent-red' : status === 'success' ? 'border-accent-green' : 'border-border-base'}
        `}
      >
        {/* IDE Header */}
        <div className="h-8 bg-surface border-b border-border-base px-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'error' ? 'bg-accent-red' : status === 'success' ? 'bg-accent-green' : 'bg-border-strong'}`}></div>
            <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">
              {isFocused ? 'SYSTEM_LISTENING' : 'EDITOR_STANDBY'}
            </span>
          </div>
          <span className="font-mono text-[9px] text-text-dim">main.js</span>
        </div>

        {/* Code Input Area with Gutter */}
        <div className="flex-1 flex relative bg-surface-sunken shadow-sunken">
          
          {/* Line Numbers Gutter */}
          <div className="w-10 shrink-0 border-r border-border-dim bg-base py-4 flex flex-col items-center select-none text-[10px] font-mono text-text-dim">
            {lines.map(num => (
              <div key={num} className="leading-relaxed h-[21px]">{num}</div>
            ))}
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-transparent text-text-primary p-4 font-mono text-[13px] leading-[21px] resize-none focus:outline-none custom-scrollbar"
            />
            {/* Execution Scanning Line (Visible only when running) */}
            {status === "running" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="w-full h-1 bg-accent-yellow/50 shadow-[0_0_15px_rgba(255,209,102,0.8)] animate-scan-line"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Output (The CRT Monitor) */}
      <div 
        className={`h-48 shrink-0 bg-[#020203] border-x border-b rounded-b-sm p-4 font-mono text-[11px] overflow-y-auto relative shadow-sunken custom-scrollbar transition-all
          ${status === 'error' ? 'border-accent-red animate-[shake_0.4s_cubic-bezier(.36,.07,.19,.97)_both]' : status === 'success' ? 'border-accent-green' : 'border-border-base'}
        `}
      >
        {/* CRT Phosphor Wash on Success */}
        {status === "success" && (
          <div className="absolute inset-0 bg-accent-green/5 pointer-events-none animate-fade-in"></div>
        )}

        <div className="text-text-dim mb-3 flex items-center gap-2">
          <span>]</span> 
          <span className="uppercase tracking-widest text-[9px]">Standard Output</span>
        </div>
        
        {output.map((line, i) => (
          <div 
            key={i} 
            className={`mb-1.5 leading-relaxed overflow-hidden whitespace-nowrap animate-typewriter border-r-2 border-transparent pr-1 
              ${line.includes("FATAL_ERROR") ? "text-accent-red" : line.includes("SYS.VERIFIED") || line.includes("TASK PASSED") ? "text-phosphor" : "text-text-secondary"}
            `}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {line}
          </div>
        ))}
        
        {/* Blinking Block Cursor */}
        {status !== "idle" && status !== "running" && (
          <div className={`inline-block w-2 h-3 ml-1 animate-blink ${status === 'error' ? 'bg-accent-red' : 'bg-accent-green'}`}></div>
        )}
      </div>

      {/* Hardware Action Bar */}
      <div className="mt-4 flex justify-between items-center">
        <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col">
          <span className="text-text-dim">SYSTEM_STATUS</span>
          <span className={status === "success" ? "text-phosphor" : status === "error" ? "text-accent-red" : "text-text-muted"}>
            {status === "success" ? "XP_ROUTED // CLEAR" : status === "error" ? "EXECUTION_HALTED" : "AWAITING_INPUT"}
          </span>
        </div>
        
        <MagneticButton
          onClick={executeCode}
          className={`px-8 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest transition-all uppercase border shadow-plate
            ${status === "success" 
              ? "bg-accent-green/10 border-accent-green text-phosphor cursor-default" 
              : status === "running"
                ? "bg-accent-yellow/10 border-accent-yellow text-accent-yellow cursor-wait"
                : "bg-surface border-border-strong text-text-primary hover:bg-accent-blue/10 hover:border-accent-blue hover:text-accent-blue hover:shadow-glow-blue"
            }
          `}
        >
          {status === "running" ? "[ EXECUTING... ]" : status === "success" ? "[ EXECUTION VERIFIED ]" : "[ INITIATE BUILD ]"}
        </MagneticButton>
      </div>

      {/* Inline style for the shake animation (keeps it contained without dirtying global CSS) */}
      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
