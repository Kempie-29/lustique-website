import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { Monogram } from "@/components/shell/Monogram";
import { artistCount } from "@/content/artists";
import { site } from "@/content/site";
import { numberWord } from "@/lib/format";

const VALUES = [
  {
    title: "One quiet morning at a time",
    body: "We keep our diary deliberately small. Fewer weddings in a day means each bride gets attention rather than logistics.",
  },
  {
    title: "The same hands throughout",
    body: "From your trial to your final touch-up, you work with the artist who already knows your face and your hair.",
  },
  {
    title: "Honest, published pricing",
    body: "Every figure we charge is on the website and in the estimator. No surprises on the morning.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description={`The story of ${site.name} — a bridal hair and makeup studio in ${site.address.suburb}, ${site.address.city}.`}
        path="/about"
      />
      <JsonLd data={breadcrumbSchema([{ label: "About", to: "/about" }])} />

      <PageHero
        eyebrow="About"
        title="Quiet artistry, from Pretoria."
        intro={`We are a bridal hair and makeup studio in ${site.address.suburb}, ${site.address.city} — and a small, steady team who look after every bride herself.`}
        crumbs={[{ label: "About" }]}
      />

      <section className="section">
        <div className="wrap two-col two-col--aside">
          <Reveal>
            <div className="prose">
              <h2>Our story</h2>
              <p>
                Lustique Co. began in {site.foundedYear} with a simple idea: that a
                wedding morning should feel calm. Not rushed, not crowded — just a
                quiet room, good light, and an artist who already knows you.
              </p>
              <p>
                We work from {site.address.suburb}, and we travel to brides across
                {` ${site.areasServed.slice(0, 3).join(", ").toLowerCase()}`}. Our
                team of {artistCount} artists share {site.yearsCombinedExperience} years
                of combined experience between them, and the same unhurried way of
                working.
              </p>
              <p>
                What has not changed since the beginning is the diary. We keep it
                small on purpose, so that the bride in the chair is the whole of our
                attention rather than one appointment among many.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade">
            <div className="collage">
              {Array.from({ length: 4 }).map((_, i) => (
                <Monogram key={i} mark={["L", "C", "A", "B"][i]} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">How we work</p>
              <h2>The way we look after a morning.</h2>
            </div>
          </Reveal>
          <div className="grid grid--3">
            {VALUES.map((value) => (
              <Reveal key={value.title} variant="rise">
                <div className="panel" style={{ height: "100%" }}>
                  <h3 style={{ fontSize: "var(--step-2)" }}>{value.title}</h3>
                  <p className="muted" style={{ marginTop: "0.6rem" }}>
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="stat-row">
            <span className="stat">
              <strong>{artistCount}</strong> Artists
            </span>
            <span className="stat">
              <strong>{site.yearsCombinedExperience}</strong> Years combined
            </span>
            <span className="stat">
              <strong>{site.foundedYear}</strong> Since
            </span>
            <span className="stat">
              <strong>{numberWord(site.areasServed.length)}</strong> Areas we travel
            </span>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Let's begin</p>
            <h2>Tell us about your day.</h2>
            <p>Build a live estimate in about two minutes, then send it our way.</p>
            <div className="btn-row">
              <Button to="/quote" variant="light" size="lg">
                Build your estimate
              </Button>
              <Button to="/team" variant="light" size="lg">
                              Meet the team
                            </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}