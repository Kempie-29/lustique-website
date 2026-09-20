import { useEffect, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Disclosure accordion. The open/closed transition is driven by
 * `max-height = scrollHeight` (measured from the panel's inner content), which
 * mirrors the live `site.js` behaviour and animates to natural height.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="accordion">
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={open === item.id}
          onToggle={() => setOpen(open === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setHeight(el.scrollHeight);
    update();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="accordion__item">
      <h3>
        <button
          className="accordion__trigger"
          aria-expanded={isOpen}
          aria-controls={`panel-${item.id}`}
          id={`trigger-${item.id}`}
          onClick={onToggle}
        >
          <span>{item.title}</span>
          <Plus className="accordion__icon" aria-hidden="true" size={20} />
        </button>
      </h3>
      <div
        className="accordion__panel"
        id={`panel-${item.id}`}
        role="region"
        aria-labelledby={`trigger-${item.id}`}
        aria-hidden={!isOpen}
        style={{ maxHeight: isOpen ? height : 0 }}
      >
        <div className="accordion__panel-inner" ref={innerRef}>
          {item.content}
        </div>
      </div>
    </div>
  );
}