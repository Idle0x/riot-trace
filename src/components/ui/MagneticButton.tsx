"use client";

import { useRef, MouseEvent } from 'react';

export function MagneticButton({ children, className = "", onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // Reduced from 0.25 to 0.15 for a heavier, less "floaty" feel
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      // Stiffer mechanical spring bezier
      style={{ transition: 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
    >
      {children}
    </button>
  );
}
