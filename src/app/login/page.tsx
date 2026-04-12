"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function AccessTerminal() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "sent" | "logged" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("scanning");
    setErrorMessage("");

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Attempt to login
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, 
        },
      });

      if (error) {
        // If signups are disabled, Supabase throws an error for new emails.
        // We catch this, and log them to the waitlist instead.
        if (error.message.includes("Signups not allowed") || error.status === 400) {
           const { error: insertError } = await supabase
             .from('access_requests')
             .insert([{ email }]);
           
           // If they already requested, it will fail silently (unique constraint), which is fine.
           setStatus("logged");
           return;
        }
        throw error;
      }

      // If no error, they are an approved user and the link was sent.
      setStatus("sent");

    } catch (error: any) {
      console.error("AUTH_FAILURE:", error);
      setErrorMessage(error.message || "UNRECOGNIZED_CREDENTIALS");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="border border-border-strong bg-surface shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden animate-fade-up">
          <div className="h-8 bg-surface-sunken border-b border-border-strong px-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'logged' ? 'bg-accent-yellow' : 'bg-accent-red'}`}></div>
              <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">
                {status === 'logged' ? 'REQUEST_LOGGED' : 'RESTRICTED_ACCESS'}
              </span>
            </div>
            <span className="font-mono text-[9px] text-text-dim">sys.login</span>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                riot' Trace
              </h1>
              <p className="font-mono text-xs text-text-muted">
                AUTHORIZED PERSONNEL ONLY. INITIATE CONNECTION PROTOCOL.
              </p>
            </div>

            {status === "sent" ? (
              <div className="p-4 border border-accent-green/30 bg-accent-green/5 rounded-sm">
                <div className="font-mono text-xs text-accent-green mb-2 flex items-center gap-2">
                  <span>]</span> DECRYPTION_KEY_DISPATCHED
                </div>
                <p className="font-mono text-[11px] text-text-secondary leading-relaxed">
                  A secure link has been routed to <span className="text-white">{email}</span>. 
                  Check your inbox to authenticate this session.
                </p>
              </div>
            ) : status === "logged" ? (
              <div className="p-4 border border-accent-yellow/30 bg-accent-yellow/5 rounded-sm">
                <div className="font-mono text-xs text-accent-yellow mb-2 flex items-center gap-2">
                  <span>]</span> CLEARANCE_PENDING
                </div>
                <p className="font-mono text-[11px] text-text-secondary leading-relaxed">
                  Your credentials <span className="text-white">({email})</span> are not recognized in the active matrix. 
                  Your access request has been logged. You will receive an uplink if cleared by the administrator.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAuthentication} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-widest text-text-dim mb-2 flex items-center gap-2">
                    <span>]</span> TARGET_EMAIL
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operative@domain.com"
                      className={`w-full bg-[#0a0a0c] border ${status === 'error' ? 'border-accent-red' : 'border-border-strong focus:border-accent-blue'} rounded-sm p-3 font-mono text-sm text-white placeholder:text-text-dim/50 focus:outline-none transition-colors`}
                      disabled={status === "scanning"}
                      required
                    />
                  </div>
                  {status === "error" && (
                    <div className="mt-2 font-mono text-[10px] text-accent-red tracking-wide uppercase animate-fade-up">
                      ERR: {errorMessage}
                    </div>
                  )}
                </div>

                <MagneticButton 
                  type="submit"
                  disabled={status === "scanning" || !email}
                  className={`w-full py-3 rounded-sm font-mono text-[11px] font-bold tracking-widest transition-all uppercase border shadow-plate 
                    ${status === "scanning" 
                      ? "bg-accent-blue/10 border-accent-blue text-accent-blue cursor-wait" 
                      : !email 
                        ? "bg-surface-sunken border-border-dim text-text-dim cursor-not-allowed" 
                        : "bg-surface border-border-strong text-text-primary hover:bg-white hover:text-black"}`}
                >
                  {status === "scanning" ? "[ ESTABLISHING_UPLINK... ]" : "[ TRANSMIT_CREDENTIALS ]"}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
