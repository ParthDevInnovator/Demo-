"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpOptions {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  threshold?: number;
}

export function useCountUp({
  target,
  duration = 1200,
  decimals = 0,
  suffix = "",
  prefix = "",
  threshold = 0.2,
}: CountUpOptions) {
  const [current, setCurrent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    const startValue = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = startValue + (target - startValue) * eased;

      setCurrent(parseFloat(value.toFixed(decimals)));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, target, duration, decimals]);

  const formatted = `${prefix}${
    decimals > 0 ? current.toFixed(decimals) : Math.round(current)
  }${suffix}`;

  return { ref, formatted, current };
}
