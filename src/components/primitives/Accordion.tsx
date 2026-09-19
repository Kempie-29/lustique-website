import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div className="accordion__item" key={item.id}>
            <h3>
              <button
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`trigger-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
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
              hidden={!isOpen}
            >
              <div className="accordion__panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}