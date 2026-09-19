import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { Monogram } from "@/components/shell/Monogram";
import { services } from "@/content/services";
import { site } from "@/content/site";

function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
        provider: { "@type": "BeautySalon", name: site.name, url: site.url },
        areaServed: site.areasServed,
      },
    })),
  };
}

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="Bridal makeup, bridal hair, the whole party and events — with transparent, tiered pricing from Lustique Co. in Pretoria."
        path="/services"
      />
      <JsonLd data={[breadcrumbSchema([{ label: "Services", to: "/services" }]), servicesSchema()]} />

      <PageHero
        eyebrow="What we do"
        title="Flawless. Elegant. Unforgettable."
        intro="Everything we offer is built around your morning — makeup, hair, or the two together, for you and for your people."
        crumbs={[{ label: "Services" }]}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid--2">
                      {services.map((service) => (
                        <Reveal key={service.id} variant="rise">
                          <div style={{ height: "100%" }}>
                            <Card media={<Monogram mark={service.name.charAt(0)} />}>
                              <h2 style={{ fontSize: "var(--step-2)" }}>{service.name}</h2>
                    <p className="muted">{service.summary}</p>
                    <ul className="tick-list" style={{ marginTop: "0.4rem" }}>
                      {service.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="card__price">{service.fromLabel}</p>
                    <div className="btn-row" style={{ marginTop: "0.6rem" }}>
                      <Button to={service.href} variant="outline" size="sm">
                        Add to your estimate
                      </Button>
                    </div>
                                      </Card>
                                    </div>
                                  </Reveal>
                                ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap--narrow">
          <Reveal>
            <div className="panel">
              <p className="eyebrow">Also available</p>
              <h3 style={{ fontSize: "var(--step-2)" }}>Hair-length pricing &amp; travel</h3>
              <p className="muted" style={{ marginTop: "0.6rem" }}>
                Hair is priced by length — short, medium, long and extra long — for you
                and for every member of your party. Travel within 40 km round trip of
                our studio is free, and beyond that we charge per kilometre and confirm
                the figure before you book.
              </p>
              <div className="btn-row" style={{ marginTop: "1.2rem" }}>
                <Button to="/pricing" variant="outline">
                  See full pricing
                </Button>
                <Button to="/quote" variant="primary">
                  Build your estimate
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}