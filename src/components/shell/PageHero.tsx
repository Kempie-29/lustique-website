import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/shell/Breadcrumbs";
import { Reveal } from "@/components/shell/Reveal";
import { RevealText } from "@/components/shell/RevealText";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
}

/**
 * Signature champagne-wash hero band used on every inner page. The title uses
 * a masked line reveal; the eyebrow and intro settle in just after.
 */
export function PageHero({ eyebrow, title, intro, crumbs }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <Reveal variant="fade">
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <RevealText as="h1" text={title} delay={60} />
        {intro ? (
          <Reveal variant="fade" delay={200}>
            <p className="lead">{intro}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
