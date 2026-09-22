import { useEffect, useRef, useState } from "react";
import { StarRow } from "@/components/primitives/StarRow";
import { Button } from "@/components/primitives/Button";
import type { Testimonial } from "@/content/testimonials";

interface TestimonialsProps {
  items: Testimonial[];
}

/**
 * Testimonial slider. Hidden entirely while there are no verified reviews —
 * nothing is fabricated to fill the section.
 */
export function Testimonials({ items }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [items.length, paused]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <section className="section section--tight" aria-label="What our brides say">
      <div className="wrap">
        <div className="testimonial">
          <p className="caption center">Verified reviews · in their words</p>
          <StarRow value={current.rating} className="star-row--ink" />
          <blockquote>{current.quote}</blockquote>
          <p className="testimonial__author">
            {current.author}
            {current.context ? ` · ${current.context}` : ""}
          </p>
          <div className="testimonial__nav">
            <div className="dot-nav" role="tablist" aria-label="Choose a testimonial">
              {items.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-current={i === index}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>
              {paused ? "Play" : "Pause"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}