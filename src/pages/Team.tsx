import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema, artistsSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { artists, artistCount } from "@/content/artists";
import { site } from "@/content/site";
import { numberWord } from "@/lib/format";

/**
 * The artist count in the headline is derived from the roster length, never
 * hard-coded — so copying the page for a new roster can never drift.
 * Photos and bios are intentionally absent until the owner supplies them;
 * each card falls back to an elegant monogram.
 */
export default function Team() {
  return (
    <>
      <Seo
        title="The Team"
        description={`Meet the ${artistCount} artists of ${site.name} — bridal hair and makeup artistry in ${site.address.suburb}, ${site.address.city}.`}
        path="/team"
      />
      <JsonLd
              data={[breadcrumbSchema([{ label: "The Team", to: "/team" }]), ...artistsSchema()]}
            />

      <PageHero
        eyebrow="The Team"
        title={`${numberWord(artistCount)} artists. One quiet morning at a time.`}
        intro={`A team of ${artistCount} who work the same way — unhurried, precise, and entirely yours on the day.`}
        crumbs={[{ label: "The Team" }]}
      />

      <section className="section">
        <div className="wrap">
          <div className="stat-row" style={{ marginBottom: "var(--space-lg)" }}>
            <span className="stat">
              <strong>{artistCount}</strong> Artists
            </span>
            <span className="stat">
              <strong>{site.yearsCombinedExperience}</strong> Years combined
            </span>
            <span className="stat">
              <strong>{site.foundedYear}</strong> Since
            </span>
          </div>

          <div className="grid grid--3">
            {artists.map((artist) => (
              <Reveal key={artist.id} variant="rise">
                <div style={{ height: "100%" }}>
                  <Card imageUrl={artist.photoUrl} alt={artist.name} mark={artist.name.charAt(0)}>
                    <h3 style={{ fontSize: "var(--step-2)" }}>{artist.name}</h3>
                    <p className="muted">{artist.role}</p>
                    {artist.bio ? <p className="muted">{artist.bio}</p> : null}
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="footnote">
            Artist photography and biographies are being finalised — each card shows a
            monogram placeholder until then.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap--narrow">
          <Reveal>
            <div className="empty-state">
                          <h3>Working with us</h3>
              <p>
                Thinking about joining the team, or looking for a supplier to refer
                brides to? We would love to hear from you.
              </p>
              <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.2rem" }}>
                <Button to="/contact" variant="primary">
                  Get in touch
                </Button>
                <Button to="/vendors" variant="outline">
                  For vendors
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}