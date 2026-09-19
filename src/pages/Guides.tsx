import { Link } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { guides } from "@/content/guides";

export default function Guides() {
  return (
    <>
      <Seo
        title="Guides"
        description="Free, practical guides on skin, hair and timing from the Lustique Co. bridal studio in Pretoria."
        path="/guides"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Guides", to: "/guides" }])} />

      <PageHero
        eyebrow="For your big day"
        title="Free guides, from us to you."
        intro="Short, practical writing on skin, hair and timing — the things that make a morning calm."
        crumbs={[{ label: "Guides" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <div className="entry-list">
            {guides.map((guide) => (
              <Reveal key={guide.slug} variant="fade">
                <Link to={`/guides/${guide.slug}`} className="entry">
                  <p className="entry__meta">{guide.readingMinutes} minute read</p>
                  <h2 style={{ fontSize: "var(--step-2)" }}>{guide.title}</h2>
                  <p>{guide.excerpt}</p>
                  <span className="entry__more">Read the guide →</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="btn-row cta-line">
            <Button to="/quote" variant="primary" size="lg">
              Build your estimate
            </Button>
            <Button to="/pricing" variant="outline" size="lg">
              See full pricing
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}