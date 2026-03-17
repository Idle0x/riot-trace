"use client";

import { useRef, MouseEvent, useState } from 'react';

export function TiltCard({ children, className = "" }: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Max 3 degrees of tilt. Subtle and premium.
    const tiltX = (y - 0.5) * 6;   
    const tiltY = (x - 0.5) * -6;
    
    el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
    
    // Calculate glare position
    setGlare({ x: x * 100, y: y * 100, opacity: 0.08 });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)', transformStyle: 'preserve-3d' }}
    >
      {/* Glare Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,1) 0%, transparent 60%)`
        }}
      />
      {children}
    </div>
  );
}
