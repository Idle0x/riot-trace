"use client";

import { useState } from "react";

interface LiveCodeRunnerProps {
  scenario?: string;
  initialCode?: string;
  validationLogic?: string;
}

export default function LiveCodeRunner({ 
  scenario = "Write your code below.", 
  initialCode = "// Type your JavaScript here...",
  validationLogic = ""
}: LiveCodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const runCode = () => {
    setOutput([]);
    setStatus("idle");
    const logs: string[] = [];

    const originalLog = console.log;
    console.log = (...args) => {
      const formattedArgs = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(formattedArgs);
      originalLog(...args);
    };

    try {
      // We append the hidden validation logic directly to the user's code
      // If the user's code is wrong, the validation logic throws an error
      const executionString = code + "\n\n// --- HIDDEN VALIDATION ---\n" + validationLogic;
      const execute = new Function(executionString);
      execute();
      
      // If we made it here without throwing, the task is complete!
      if (validationLogic) {
        logs.push("✅ TASK PASSED: All validation checks cleared.");
        setStatus("success");
      }
    } catch (error: any) {
      logs.push(`⚠️ ${error.message}`);
      setStatus("error");
    } finally {
      console.log = originalLog;
      if (logs.length === 0) logs.push("Execution complete (no output).");
      setOutput(logs);
    }
  };

  return (
    <div className="border border-border2 rounded-xl overflow-hidden bg-bg shadow-2xl">
      
      {/* Scenario Block */}
      {scenario && (
        <div className="bg-surf p-4 border-b border-border2">
          <div className="text-[10px] text-riotYellow tracking-widest font-mono mb-2">
            // OBJECTIVE
          </div>
          <p className="text-sm text-text font-sans">{scenario}</p>
        </div>
      )}

      {/* Editor Header */}
      <div className="bg-[#0A0A0F] flex items-center justify-between px-4 py-2 border-b border-border2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <button 
          onClick={runCode}
          className={`text-[10px] font-mono tracking-widest border px-4 py-1.5 rounded-md transition-colors ${
            status === "success" 
              ? "bg-riotGreen/20 text-riotGreen border-riotGreen/50"
              : "bg-riotBlue/10 text-riotBlue border-riotBlue/30 hover:bg-riotBlue hover:text-bg"
          }`}
        >
          {status === "success" ? "PASSED" : "RUN & VALIDATE"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border2">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-72 bg-bg text-text font-mono text-sm p-4 focus:outline-none resize-none"
        />

        <div className="h-72 bg-[#020205] p-4 overflow-y-auto font-mono text-sm">
          <div className="text-muted text-[10px] tracking-widest mb-3 border-b border-border2 pb-2">
            OUTPUT_
          </div>
          {output.length === 0 ? (
            <div className="text-muted/50 italic">Awaiting execution...</div>
          ) : (
            output.map((line, i) => (
              <div 
                key={i} 
                className={`mb-1 ${
                  line.includes('⚠️') ? 'text-riotRed' : 
                  line.includes('✅') ? 'text-riotGreen' : 
                  'text-riotBlue'
                }`}
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
