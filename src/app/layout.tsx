import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "riot' Trace",
  description: "The interactive developer crucible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg text-text font-mono min-h-screen antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
