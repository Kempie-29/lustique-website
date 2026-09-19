import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/shell/Breadcrumbs";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
}

/** Signature champagne-wash hero band used on every inner page. */
export function PageHero({ eyebrow, title, intro, crumbs }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {intro ? <p className="lead">{intro}</p> : null}
      </div>
    </section>
  );
}