import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { pricingTables } from "@/content/pricingTables";
import { activePromotion } from "@/content/promotions";
import { PRICES } from "@/content/pricing";
import { formatZar } from "@/lib/format";

export default function Pricing() {
  return (
    <>
      <Seo
        title="Pricing"
        description="Full, transparent pricing for bridal hair and makeup, the bridal party, events and travel at Lustique Co., Pretoria."
        path="/pricing"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Pricing", to: "/pricing" }])} />

      <PageHero
        eyebrow="Transparent pricing"
        title="Know your investment before you enquire."
        intro="Every figure below is what we actually charge. Your live estimate combines them for your own morning."
        crumbs={[{ label: "Pricing" }]}
      />

      <section className="section">
        <div className="wrap">
          {activePromotion.active ? (
            <Reveal>
              <div className="panel" style={{ marginBottom: "var(--space-xl)" }}>
                <p className="eyebrow">Current offer</p>
                <h2 style={{ fontSize: "var(--step-2)" }}>{activePromotion.label}</h2>
                <p className="muted" style={{ marginTop: "0.6rem" }}>
                  {activePromotion.description}
                </p>
                <p className="field__hint">
                                  The least-expensive eligible look is the one freed. The bride,
                                  under-12 flower girls and trials are never freed. Minimum
                                  bookings and any conditions are confirmed with your estimate.
                                </p>
                              </div>
            </Reveal>
          ) : null}

          <div className="table-cards">
            {pricingTables.map((table) => (
              <Reveal key={table.id} variant="fade">
                <div className="panel">
                  <h2 style={{ fontSize: "var(--step-2)" }}>{table.title}</h2>
                  {table.intro ? (
                    <p className="muted" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                      {table.intro}
                    </p>
                  ) : null}
                  <div className="table-scroll">
                    <table className="price-table">
                      <thead>
                        <tr>
                          <th scope="col">Service</th>
                          <th scope="col" style={{ textAlign: "right" }}>
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row) => (
                          <tr key={row.label}>
                            <td>
                              {row.label}
                              {row.note ? <span className="row-note">{row.note}</span> : null}
                            </td>
                            <td>{row.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="footnote">
            Travel within 40 km round trip of our studio is free ·{" "}
            {formatZar(PRICES.travel.perKm)} per km round trip beyond · prices scale
            with hair length.
          </p>

          <div className="btn-row cta-line">
            <Button to="/quote" variant="primary" size="lg">
              Build your estimate
            </Button>
            <Button to="/faq" variant="outline" size="lg">
              Read the FAQ
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}