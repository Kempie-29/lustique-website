import { useState } from "react";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { Monogram } from "@/components/shell/Monogram";
import { gallery, galleryCategories } from "@/content/gallery";

/**
 * Portfolio. The gallery array is empty until real photography is supplied, so
 * the page shows an honest empty state rather than placeholder images that
 * pretend to be work we have not done.
 */
export default function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const shown = gallery.filter((item) => filter === "All" || item.category === filter);

  return (
    <>
      <Seo
        title="Portfolio"
        description="Photography from Lustique Co. weddings, parties and editorials."
        path="/portfolio"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Portfolio", to: "/portfolio" }])} />

      <PageHero
        eyebrow="Portfolio"
        title="Real brides, real mornings."
        intro="A growing collection of the work we are proud of — weddings, parties and editorials."
        crumbs={[{ label: "Portfolio" }]}
      />

      <section className="section">
        <div className="wrap">
          {gallery.length > 0 ? (
            <>
              <div className="filter-row" role="group" aria-label="Filter the portfolio">
                {galleryCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="filter-chip"
                    aria-pressed={filter === category}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="gallery-grid">
                {shown.map((item) => (
                  <figure className="gallery-item" key={item.id}>
                    <img src={item.imageUrl} alt={item.alt} loading="lazy" />
                  </figure>
                ))}
              </div>
              {shown.length === 0 ? (
                <p className="footnote">Nothing in this collection yet — try another filter.</p>
              ) : null}
            </>
          ) : (
            <Reveal>
              <div className="empty-state">
                <h3>Our portfolio is being photographed.</h3>
                <p>
                  We're gathering the images we want to share — real brides, properly
                  lit, with their permission. Nothing here is a stock photograph or a
                  stand-in.
                </p>
                <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.4rem" }}>
                  <Button to="/quote" variant="primary" size="lg">
                    Build your estimate
                  </Button>
                  <Button to="/services" variant="outline" size="lg">
                    See our services
                  </Button>
                </div>
              </div>
            </Reveal>
          )}

          {gallery.length === 0 ? (
                      <div className="gallery-grid" style={{ marginTop: "var(--space-lg)", opacity: 0.85 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div className="gallery-item" key={i} aria-hidden="true">
                            <Monogram mark={["L", "C", "A", "B"][i]} />
                          </div>
                        ))}
                      </div>
                    ) : null}
        </div>
      </section>
    </>
  );
}