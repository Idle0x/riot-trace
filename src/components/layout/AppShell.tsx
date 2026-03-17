"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Determine context to shift ambient lighting dynamically
  const isLesson = pathname?.includes('/lesson');
  const isForge = pathname?.includes('/forge');
  
  // Shift the ambient hue of the room
  const ambientColor = isLesson 
    ? "rgba(77, 166, 255, 0.05)" // Deep Blue for execution
    : isForge 
      ? "rgba(255, 68, 102, 0.04)" // Dim Red for forging
      : "rgba(0, 255, 102, 0.03)"; // Slate Green for the Hub

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      // Calculate coordinates, keeping it centered on the cursor
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    // bg-noise applies the SVG texture globally to the entire app shell
    <div ref={shellRef} className="min-h-screen relative overflow-x-hidden bg-base text-text-primary font-sans bg-noise flex flex-col">
      
      {/* Dynamic Cursor Light Source & Ambient Wash */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-colors duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${ambientColor}, transparent 40%)`
        }}
      />

      {/* The Global Command Bar (Z-index 50) */}
      <Navbar />

      {/* Main Content Area - Padded to account for the fixed Command Bar */}
      <main className="relative z-10 pt-14 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
