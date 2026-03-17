import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "riot' Trace | Executive Laboratory",
  description: "Advanced execution tracing and mental models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-hidden">
      <body className="antialiased bg-[#090A0F]">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
