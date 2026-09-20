import { Seo } from "@/components/Seo";
import { JsonLd, beautySalonSchema } from "@/components/JsonLd";
import { Monogram } from "@/components/shell/Monogram";
import { Reveal } from "@/components/shell/Reveal";
import { Testimonials } from "@/components/home/Testimonials";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { StarRow } from "@/components/primitives/StarRow";
import { PRICES } from "@/content/pricing";
import { artistCount } from "@/content/artists";
import { gallery } from "@/content/gallery";
import { guides } from "@/content/guides";
import { activePromotion } from "@/content/promotions";
import { testimonials } from "@/content/testimonials";
import { site } from "@/content/site";
import { formatZar, numberWord } from "@/lib/format";

const TRUST = [
  "We travel to you on the morning",
  "Trials at our La Montagne studio",
  "Personal, from trial to final touch-up",
];

const SERVICES = [
  {
    title: "Bridal Makeup",
    price: `from ${formatZar(PRICES.bride.makeupDay)}`,
    body: "A considered, camera-ready bridal look designed with you at your trial.",
  },
  {
    title: "Bridal Hair",
    price: `from ${formatZar(PRICES.bride.hair.short)}`,
    body: "Soft, structured styling that holds from your first look to your last dance.",
  },
  {
    title: "The Whole Party",
    price: "see pricing",
    body: "Bridesmaids, mothers, flower girls and guests — looked after, in turn.",
  },
];

const PRICE_TILES = [
  { label: "Solo bride", amount: `from ${formatZar(2690)}`, note: "makeup, hair & trial" },
  { label: "Bridesmaid makeup", amount: formatZar(PRICES.party.makeup.bridesmaid), note: "per person" },
  { label: "Mother makeup", amount: formatZar(PRICES.party.makeup.mother), note: "per person" },
  { label: "Bridal hair", amount: `from ${formatZar(PRICES.bride.hair.short)}`, note: "scales with length" },
];

export default function Index() {
  const hasHeroPhoto = gallery.length > 0;

  return (
    <>
      <Seo
        title={`${site.name} — Bridal hair & makeup artistry in Pretoria`}
        description={site.shortDescription}
        path="/"
      />
      <JsonLd data={beautySalonSchema()} />

      {/* 1 · Hero */}
      <section className={`hero ${hasHeroPhoto ? "" : "hero--monogram"}`}>
        <div className="hero__media">
          {hasHeroPhoto ? (
            <img src={gallery[0].imageUrl} alt={gallery[0].alt} fetchPriority="high" />
          ) : (
            <Monogram mark="LC" />
          )}
        </div>
        <div className="hero__scrim" aria-hidden="true" />
        <div className="wrap hero__content">
          <Reveal>
            <p className="eyebrow">Bridal hair &amp; makeup artistry · Pretoria</p>
            <h1>Feel most like yourself.</h1>
            <div style={{ marginTop: "1rem" }}>
              <StarRow label="rated by our brides" />
            </div>
            <p className="hero__sub">
              Quiet, personal artistry for brides across Pretoria and beyond —
              unhurried mornings, honest pricing, and a look that still feels like
              you.
            </p>
            <div className="btn-row">
              <Button to="/quote" variant="primary" size="lg">
                Get your estimate
              </Button>
              <Button to="/portfolio" variant="light" size="lg">
                View the portfolio
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · Trust strip */}
      <section className="trust-strip" aria-label="How we work">
        <div className="wrap">
          <ul>
            {TRUST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Statement */}
      <section className="section">
        <div className="wrap statement-grid">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2>
              The artist a bride chooses is the one who makes her feel most like
              herself.
            </h2>
          </Reveal>
          <Reveal variant="fade">
            <p>
              Lustique Co. is a bridal hair and makeup studio in {site.address.suburb},
              Pretoria. We keep our diary deliberately small so every bride gets a
              calm morning, a considered look, and an artist who already knows her
              face and her hair.
            </p>
            <p>
              From your trial in the studio to your final touch-up at the venue,
              you work with the same hands. No rushed conveyor of chairs — just one
              quiet morning at a time.
            </p>
            <blockquote className="pullquote">
              <p>“Beauty begins the moment you decide to be yourself.”</p>
              <cite>Coco Chanel</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 4 · Services */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">What we do</p>
              <h2>Flawless. Elegant. Unforgettable.</h2>
              <p className="lead">
                Everything we offer is built around your morning — makeup, hair, or
                the two together, for you and for your people.
              </p>
            </div>
          </Reveal>
          <div className="grid grid--3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} variant="rise">
                <div style={{ height: "100%", transitionDelay: `${i * 60}ms` }}>
                  <Card media={<Monogram mark={service.title.charAt(0)} />}>
                    <h3>{service.title}</h3>
                    <p className="muted">{service.body}</p>
                    <p className="card__price">{service.price}</p>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="btn-row cta-line">
            <Button to="/services" variant="outline">
              See all services
            </Button>
          </div>
        </div>
      </section>

      {/* 5 · Team */}
      <section className="section">
        <div className="wrap statement-grid">
          <Reveal>
            <p className="eyebrow">The team</p>
            <h2>{numberWord(artistCount)} artists. One quiet morning at a time.</h2>
            <div className="stat-row" style={{ margin: "1.5rem 0" }}>
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
            <p className="muted">
              A team of {artistCount} artists who work the same way: unhurried,
              precise, and entirely yours on the day.
            </p>
            <div className="btn-row cta-line">
              <Button to="/team" variant="primary">
                Meet the team
              </Button>
            </div>
          </Reveal>
          <Reveal variant="fade">
            <div className="collage">
              {Array.from({ length: 4 }).map((_, i) => (
                <Monogram key={i} mark={["A", "B", "C", "D"][i]} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 · Pricing teaser */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Transparent pricing</p>
              <h2>Know your investment before you enquire.</h2>
              <p className="lead">
                Every figure below is what we actually charge — no surprises on the
                morning.
              </p>
            </div>
          </Reveal>
          <div className="grid grid--4">
            {PRICE_TILES.map((tile) => (
              <div className="price-tile" key={tile.label}>
                <span className="price-tile__label">{tile.label}</span>
                <span className="price-tile__amount">{tile.amount}</span>
                <span className="price-tile__note">{tile.note}</span>
              </div>
            ))}
          </div>
          <p className="footnote">
            Free travel within 40 km round trip · {formatZar(PRICES.travel.perKm)}
            /km beyond · prices scale with hair length.
          </p>
          <div className="btn-row cta-line">
            <Button to="/pricing" variant="outline">
              Full pricing
            </Button>
            <Button to="/quote" variant="primary">
              Build your estimate
            </Button>
          </div>
        </div>
      </section>

      {/* 7 · Testimonials (hidden while empty) */}
      <Testimonials items={testimonials} />

      {/* 8 · Guides teaser */}
      <section className="section section--tight">
        <div className="wrap statement-grid">
          <Reveal>
            <p className="eyebrow">For your big day</p>
            <h2>Free guides, from us to you.</h2>
            <p className="lead" style={{ marginTop: "0.9rem" }}>
              Short, practical writing on skin, hair and timing — the things that
              make a morning calm.
            </p>
            <div className="btn-row cta-line">
              <Button to="/guides" variant="primary">
                Browse the guides
              </Button>
            </div>
          </Reveal>
          <Reveal variant="fade">
            <ul className="stack">
              {guides.map((g) => (
                <li key={g.slug} className="panel">
                  <h3 style={{ fontSize: "var(--step-1)" }}>{g.title}</h3>
                  <p className="muted" style={{ marginTop: "0.4rem" }}>
                    {g.excerpt}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 9 · Closing CTA band */}
      <section className="section cta-band">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Let's begin</p>
            <h2>Tell us about your day.</h2>
            <p>
              {activePromotion.meta
                              ? activePromotion.meta.tagline
                              : "Build a live estimate in about two minutes — your investment, before you enquire."}
            </p>
            <div className="btn-row">
              <Button to="/quote" variant="light" size="lg">
                Get a Quote
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}