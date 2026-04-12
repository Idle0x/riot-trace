"use client";

import { useRef, MouseEvent, ButtonHTMLAttributes } from 'react';

// Extend standard HTML button attributes
interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ 
  children, 
  className = "", 
  onMouseMove,
  onMouseLeave,
  style,
  ...props // This captures type="submit", disabled, onClick, etc.
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // Reduced from 0.25 to 0.15 for a heavier, less "floaty" feel
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;

    // Fire any additional onMouseMove passed from parent
    if (onMouseMove) onMouseMove(e);
  }

  function handleLeave(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';

    // Fire any additional onMouseLeave passed from parent
    if (onMouseLeave) onMouseLeave(e);
  }

  return (
    <button
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ 
        // Stiffer mechanical spring bezier
        transition: 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        ...style 
      }}
      {...props} // Injects the standard props into the DOM element
    >
      {children}
    </button>
  );
}
