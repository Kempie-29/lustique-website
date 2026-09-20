import { useMemo, useState } from "react";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { Monogram } from "@/components/shell/Monogram";
import { BlurUpImage } from "@/components/shell/BlurUpImage";
import { gallery } from "@/content/gallery";
import { artists } from "@/content/artists";

/**
 * Portfolio. The gallery array is empty until real photography is supplied, so
 * the page shows an honest empty state rather than placeholder images that
 * pretend to be work we have not done.
 *
 * The filter is artist-only (per the owner's decision): "All" plus each artist.
 * If a filter yields nothing, a graceful empty panel names the artist and offers
 * a "View all work" reset.
 */
export default function Portfolio() {
  const [artistFilter, setArtistFilter] = useState<string>("All");

  const shown = useMemo(
    () => gallery.filter((item) => artistFilter === "All" || item.artist === artistFilter),
    [artistFilter],
  );

  const activeName =
    artistFilter === "All"
      ? "this collection"
      : artists.find((a) => a.id === artistFilter)?.name ?? "this artist";

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
              <div className="filter-row" role="group" aria-label="Filter the portfolio by artist">
                <button
                  type="button"
                  className="filter-chip"
                  aria-pressed={artistFilter === "All"}
                  onClick={() => setArtistFilter("All")}
                >
                  All
                </button>
                {artists.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    className="filter-chip"
                    aria-pressed={artistFilter === artist.id}
                    onClick={() => setArtistFilter(artist.id)}
                  >
                    {artist.name}
                  </button>
                ))}
              </div>

              {shown.length > 0 ? (
                <div className="gallery-grid">
                  {shown.map((item) => (
                    <figure className="gallery-item" key={item.id}>
                      <BlurUpImage src={item.imageUrl} alt={item.alt} />
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="empty-state" data-empty-name={activeName}>
                  <h3>Nothing here just yet.</h3>
                  <p>We have nothing from {activeName} to show — try another artist.</p>
                  <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.2rem" }}>
                    <button
                      type="button"
                      className="filter-chip"
                      data-reset
                      onClick={() => setArtistFilter("All")}
                    >
                      View all work
                    </button>
                  </div>
                </div>
              )}
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