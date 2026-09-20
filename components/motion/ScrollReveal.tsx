"use client";

import React, { useEffect, useRef, ReactNode, CSSProperties, ElementType } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.12,
  className = "",
  style,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply initial reveal classes
    el.classList.add("reveal", `reveal-${direction}`);
    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [direction, delay, threshold]);

  const Component = Tag as ElementType;

  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
}
