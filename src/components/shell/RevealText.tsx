import { createElement, useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

interface RevealTextProps {
  /** Plain text — the heading is masked and rises into place. */
  text: string;
  /** Element to render the heading as. Defaults to a <span>. */
  as?: ElementType;
  className?: string;
  /** Delay before the reveal begins (ms). */
  delay?: number;
}

/**
 * Masked text reveal for display headings, disabled under reduced motion.
 *
 * The whole line block is masked with `clip-path` and rises as one — robust for
 * headings that wrap at any width, and compositor-friendly.
 */
export function RevealText({ text, as = "span", className = "", delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return createElement(
    as,
    {
      ref,
      className: `reveal-text ${visible ? "is-visible" : ""} ${className}`.trim(),
    },
    <span className="reveal-text__inner" style={style}>
      {text}
    </span>,
  );
}