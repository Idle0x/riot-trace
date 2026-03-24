"use client";

import { useState, useRef, useEffect } from "react";
import { saveTaskProgress } from "@/app/actions";
import { MagneticButton } from "@/components/ui/MagneticButton";
import * as Babel from "@babel/standalone";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { flushSync } from "react-dom";
import initSqlJs from "sql.js";

type LogEntry = { type: "log" | "warn" | "error" | "system" | "success"; text: string };

export default function LiveCodeRunner({ 
  initialCode, 
  validationLogic, 
  taskId, 
  taskType = "task_3", // Maps to the deflationary XP rewards in actions.ts
  syntaxHint, 
  mode = "terminal",
  dbSeed = "" // Silent SQL to setup tables for SQL mode
}: any) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  const lineCount = code.split("\n").length;
  const lines = Array.from({ length: Math.max(lineCount, 5) }, (_, i) => i + 1);

  useEffect(() => {
    setCode(initialCode);
    setOutput([]);
    setStatus("idle");
    setShowHint(false);

    if (domRef.current && rootRef.current) {
      rootRef.current.unmount();
      rootRef.current = null;
    }
  }, [initialCode]);

  const executeCode = async () => {
    setStatus("running");
    setOutput([]);
    const logs: string[] = [];       
    const displayLogs: LogEntry[] = []; 
    const domNode = domRef.current;
    let sqlResults: any[] = [];

    const originalConsole = { log: console.log, warn: console.warn, error: console.error };

    console.log = (...args) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ");
      logs.push(msg);
      displayLogs.push({ type: "log", text: msg });
      originalConsole.log(...args);
    };

    console.warn = (...args) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ");
      logs.push(msg);
      displayLogs.push({ type: "warn", text: msg });
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ");
      logs.push(msg);
      displayLogs.push({ type: "error", text: msg });
      originalConsole.error(...args);
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // --- BRANCH: SQL MODE (WebAssembly SQLite) ---
      if (mode === "sql") {
        const SQL = await initSqlJs({ locateFile: file => `/${file}` });
        const db = new SQL.Database();
        
        // Inject invisible setup data if provided
        if (dbSeed) {
          db.run(dbSeed);
        }

        const result = db.exec(code);
        if (result.length > 0) {
          sqlResults = result[0].values;
          const columns = result[0].columns;
          displayLogs.push({ type: "log", text: `COLUMNS: ${columns.join(" | ")}` });
          sqlResults.forEach(row => {
            const rowStr = row.join(" | ");
            logs.push(rowStr);
            displayLogs.push({ type: "log", text: `ROW: ${rowStr}` });
          });
        } else {
          displayLogs.push({ type: "system", text: ">> QUERY EXECUTED: 0 ROWS RETURNED." });
        }
        
        // Validate the SQL results
        const validate = new Function("logs", "code", "sqlResults", validationLogic);
        validate(logs, code, sqlResults);
        db.close();

      } else {
        // --- BRANCH: TERMINAL & DOM MODES ---
        let fullCode = `
          "use strict";
          ${code}
          // --- HIDDEN VALIDATION ---
          ${validationLogic}
        `;

        let executableCode = fullCode;

        if (mode === "dom") {
          executableCode = Babel.transform(fullCode, { presets: ["react"] }).code;
        }

        const render = (element: React.ReactNode) => {
          if (domNode) {
            if (!rootRef.current) {
              rootRef.current = createRoot(domNode);
            }
            flushSync(() => {
              rootRef.current!.render(element);
            });
          }
        };

        const sandbox = new Function("React", "render", "logs", "code", "domNode", executableCode);
        sandbox(React, render, logs, code, domNode);
      }

      // --- SUCCESS PIPELINE ---
      displayLogs.push({ type: "system", text: ">> SYS.VERIFIED // SYNCING LEDGER..." });
      setOutput([...displayLogs]);

      // Secure Save: Backend identifies user via cookies/session
      const saveResult = await saveTaskProgress(taskId, taskType);

      if (saveResult.success) {
        displayLogs.push({ type: "success", text: `>> TASK PASSED: +${saveResult.xp} XP SECURED.` });
      } else {
        displayLogs.push({ type: "warn", text: ">> WARNING: XP SYNC FAILED. ARE YOU LOGGED IN?" });
      }

      setOutput(displayLogs);
      setStatus("success");
      window.dispatchEvent(new Event("xp_updated"));

    } catch (err: any) {
      displayLogs.push({ type: "error", text: `>> FATAL_ERROR: ${err.message}` });
      setOutput(displayLogs);
      setStatus("error");
    } finally {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 min-h-[50vh]">

      {syntaxHint && (
        <div className="mb-2 flex justify-end">
          <button onClick={() => setShowHint(!showHint)} className="font-mono text-[9px] tracking-widest uppercase text-text-muted hover:text-accent-blue transition-colors flex items-center gap-1 border border-border-base bg-surface px-3 py-1.5 rounded-sm">
            {showHint ? "[-] HIDE_PATTERN" : "[+] REVEAL_SYNTAX_PATTERN"}
          </button>
        </div>
      )}

      {showHint && syntaxHint && (
        <div className="mb-4 p-4 border-l-2 border-accent-blue bg-accent-blue/5 font-mono text-xs text-text-primary animate-fade-up shadow-plate">
          <div className="text-[9px] text-accent-blue mb-2 tracking-widest">SYNTAX_PATTERN // REFERENCE</div>
          <pre className="text-text-primary/90">{syntaxHint}</pre>
        </div>
      )}

      {mode === "dom" && (
         <div 
           id="dom-preview"
           ref={domRef}
           className="h-48 mb-4 bg-white rounded-sm border border-border-base p-6 overflow-auto shadow-plate text-black font-sans relative"
         >
           {!rootRef.current && (
             <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-gray-400 tracking-widest uppercase">
               [ DOM_RENDERER_STANDBY ]
             </div>
           )}
         </div>
      )}

      <div className={`flex-1 flex flex-col bg-base border rounded-t-sm overflow-hidden transition-colors duration-300 shadow-plate ${isFocused ? 'border-accent-blue' : status === 'error' ? 'border-accent-red' : status === 'success' ? 'border-accent-green' : 'border-border-base'}`}>
        <div className="h-8 bg-surface border-b border-border-base px-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'error' ? 'bg-accent-red' : status === 'success' ? 'bg-accent-green' : 'bg-border-strong'}`}></div>
            <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">{isFocused ? 'SYSTEM_LISTENING' : 'EDITOR_STANDBY'}</span>
          </div>
          <span className="font-mono text-[9px] text-text-dim">{mode === "dom" ? "component.jsx" : mode === "sql" ? "query.sql" : "main.js"}</span>
        </div>

        <div className="flex-1 flex relative bg-surface-sunken shadow-sunken">
          <div className="w-10 shrink-0 border-r border-border-dim bg-base py-4 flex flex-col items-center select-none text-[10px] font-mono text-text-dim">
            {lines.map(num => <div key={num} className="leading-relaxed h-[21px]">{num}</div>)}
          </div>
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
            {status === "running" && <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="w-full h-1 bg-accent-yellow/50 shadow-[0_0_15px_rgba(255,209,102,0.8)] animate-scan-line"></div></div>}
          </div>
        </div>
      </div>

      <div className={`h-48 shrink-0 bg-[#020203] border-x border-b rounded-b-sm p-4 font-mono text-[11px] overflow-y-auto relative shadow-sunken custom-scrollbar transition-all ${status === 'error' ? 'border-accent-red animate-[shake_0.4s_cubic-bezier(.36,.07,.19,.97)_both]' : status === 'success' ? 'border-accent-green' : 'border-border-base'}`}>
        {status === "success" && <div className="absolute inset-0 bg-accent-green/5 pointer-events-none animate-fade-in"></div>}
        <div className="text-text-dim mb-3 flex items-center gap-2"><span>]</span> <span className="uppercase tracking-widest text-[9px]">Standard Output</span></div>

        {output.map((entry, i) => (
          <div key={i} className={`mb-1.5 leading-relaxed overflow-hidden whitespace-nowrap animate-typewriter border-r-2 border-transparent pr-1 
            ${entry.type === 'error' ? 'text-accent-red' : 
              entry.type === 'warn' ? 'text-accent-yellow' : 
              entry.type === 'success' ? 'text-phosphor' : 
              entry.type === 'system' ? 'text-text-muted' : 
              'text-text-secondary'}`} 
            style={{ animationDelay: `${i * 0.15}s` }}>
            {entry.text}
          </div>
        ))}
        {status !== "idle" && status !== "running" && <div className={`inline-block w-2 h-3 ml-1 animate-blink ${status === 'error' ? 'bg-accent-red' : 'bg-accent-green'}`}></div>}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col">
          <span className="text-text-dim">SYSTEM_STATUS</span>
          <span className={status === "success" ? "text-phosphor" : status === "error" ? "text-accent-red" : "text-text-muted"}>{status === "success" ? "XP_ROUTED // CLEAR" : status === "error" ? "EXECUTION_HALTED" : "AWAITING_INPUT"}</span>
        </div>

        <MagneticButton onClick={executeCode} className={`px-8 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest transition-all uppercase border shadow-plate ${status === "success" ? "bg-accent-green/10 border-accent-green text-phosphor cursor-default" : status === "running" ? "bg-accent-yellow/10 border-accent-yellow text-accent-yellow cursor-wait" : "bg-surface border-border-strong text-text-primary hover:bg-accent-blue/10 hover:border-accent-blue hover:text-accent-blue hover:shadow-glow-blue"}`}>
          {status === "running" ? "[ EXECUTING... ]" : status === "success" ? "[ EXECUTION VERIFIED ]" : "[ INITIATE BUILD ]"}
        </MagneticButton>
      </div>

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
