import { Link } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { journal } from "@/content/journal";
import { formatDate } from "@/lib/format";

export default function Journal() {
  return (
    <>
      <Seo
        title="Journal"
        description="Notes from the Lustique Co. studio — quiet mornings, why we trial, and the people we work alongside."
        path="/journal"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Journal", to: "/journal" }])} />

      <PageHero
        eyebrow="Journal"
        title="Notes from the studio."
        intro="Slow mornings, supplier spotlights and the thinking behind what we do."
        crumbs={[{ label: "Journal" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <div className="entry-list">
            {journal.map((entry) => (
              <Reveal key={entry.slug} variant="fade">
                <Link to={`/journal/${entry.slug}`} className="entry">
                  <p className="entry__meta">
                    {formatDate(entry.date)} · {entry.readingMinutes} minute read
                  </p>
                  <h2 style={{ fontSize: "var(--step-2)" }}>{entry.title}</h2>
                  <p>{entry.excerpt}</p>
                  <span className="entry__more">Read the entry →</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="btn-row cta-line">
            <Button to="/quote" variant="primary" size="lg">
              Build your estimate
            </Button>
            <Button to="/guides" variant="outline" size="lg">
              Read the guides
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}