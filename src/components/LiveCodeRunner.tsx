"use client";

import { useState } from "react";

interface LiveCodeRunnerProps {
  initialCode?: string;
}

export default function LiveCodeRunner({ initialCode = "// Type your JavaScript here...\nconsole.log('Hello, Crucible');" }: LiveCodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    // Clear previous output
    setOutput([]);
    const logs: string[] = [];

    // 1. Intercept console.log so we can print it to our UI
    const originalLog = console.log;
    console.log = (...args) => {
      const formattedArgs = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(formattedArgs);
      originalLog(...args); // Still log to real browser console just in case
    };

    // 2. Safely execute the code and catch errors
    try {
      // new Function() is a fast, lightweight way to execute a string of JS
      const execute = new Function(code);
      execute();
    } catch (error: any) {
      logs.push(`⚠️ Error: ${error.message}`);
    } finally {
      // 3. Restore the original console.log and update UI
      console.log = originalLog;
      // If nothing was logged but it ran successfully
      if (logs.length === 0) logs.push("Execution complete (no output).");
      setOutput(logs);
    }
  };

  return (
    <div className="border border-border2 rounded-xl overflow-hidden bg-bg shadow-2xl">
      {/* Editor Header */}
      <div className="bg-surf flex items-center justify-between px-4 py-2 border-b border-border2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <button 
          onClick={runCode}
          className="text-[10px] font-mono tracking-widest bg-riotGreen/10 text-riotGreen border border-riotGreen/30 hover:bg-riotGreen hover:text-bg transition-colors px-4 py-1.5 rounded-md"
        >
          EXECUTE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border2">
        {/* Code Input Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-64 bg-bg text-text font-mono text-sm p-4 focus:outline-none resize-none"
          placeholder="// Write JavaScript..."
        />

        {/* Console Output Area */}
        <div className="h-64 bg-[#020205] p-4 overflow-y-auto font-mono text-sm">
          <div className="text-muted text-[10px] tracking-widest mb-3 border-b border-border2 pb-2">
            OUTPUT_
          </div>
          {output.length === 0 ? (
            <div className="text-muted/50 italic">Awaiting execution...</div>
          ) : (
            output.map((line, i) => (
              <div 
                key={i} 
                className={`mb-1 ${line.startsWith('⚠️') ? 'text-riotRed' : 'text-riotBlue'}`}
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
