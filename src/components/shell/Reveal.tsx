import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** "fade" for a pure opacity reveal, "rise" (default) to also slide up. */
  variant?: "fade" | "rise" | "rise-lg";
}

/** Scroll-reveal via IntersectionObserver, disabled under reduced motion. */
export function Reveal({ children, className = "", variant = "rise" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "fade" ? "reveal--fade" : variant === "rise-lg" ? "reveal--rise-lg" : "";

  return (
    <div ref={ref} className={`reveal ${variantClass} ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}