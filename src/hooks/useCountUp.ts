"use client";

import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(undefined);

  useEffect(() => {
    startTime.current = null;

    function step(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { 
      if (rafRef.current) cancelAnimationFrame(rafRef.current); 
    };
  }, [target, duration]);

  return current;
}
