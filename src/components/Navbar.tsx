import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,102,0.1)] border border-[rgba(0,255,102,0.25)] flex items-center justify-center text-riotGreen text-sm">
          ◉
        </div>
        <Link href="/" className="flex flex-col">
          <div className="text-sm font-bold text-white font-sans leading-none tracking-tight">
            riot' Trace
          </div>
          <div className="text-[9px] text-muted tracking-[3px] font-mono mt-0.5">
            LABORATORY
          </div>
        </Link>
      </div>
      
      {/* Placeholder for future authentication and XP tracking */}
      <div className="bg-surf border border-border2 rounded-full px-4 py-1.5 text-xs font-mono text-riotBlue tracking-wider">
        0 XP
      </div>
    </header>
  );
}
