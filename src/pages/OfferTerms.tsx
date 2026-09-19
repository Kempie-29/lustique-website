import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Button } from "@/components/primitives/Button";
import { activePromotion, promotionPresets } from "@/content/promotions";

export default function OfferTerms() {
  const others = promotionPresets.filter((p) => p.id !== activePromotion.id);

  return (
    <>
      <Seo
        title="Offer terms"
        description="The full terms behind the current Lustique Co. bridal offer."
        path="/offer-terms"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Offer terms", to: "/offer-terms" }])} />

      <PageHero
        eyebrow="Offer terms"
        title="Full offer terms."
        intro="The small print behind our current invitation to brides — written to be read, not skipped."
        crumbs={[{ label: "Offer terms" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <div className="policy-block">
            <p className="eyebrow">Current offer</p>
            <h2>{activePromotion.label}</h2>
            <p className="lead" style={{ marginTop: "0.8rem" }}>
              {activePromotion.description}
            </p>
          </div>

          <div className="prose policy-block" style={{ marginTop: "var(--space-lg)" }}>
            <h2>What the offer means</h2>
            <ul>
              <li>
                Your booking needs at least {activePromotion.minBooks} full looks.
                A “full look” is one person receiving both hair and makeup.
              </li>
              <li>
                The least-expensive eligible full look is then free — its makeup and
                hair value is removed from your total.
              </li>
              <li>
                The bride always counts towards the threshold, but is never the look
                that is freed.
              </li>
              <li>Flower girls under 12 are never the look that is freed.</li>
              <li>
                A trial is never the part that is freed; trials remain chargeable.
              </li>
              <li>Only one promotion applies to a booking at a time.</li>
            </ul>

            <h2>Availability &amp; changes</h2>
            <ul>
              <li>The offer applies to confirmed wedding bookings, subject to diary availability.</li>
              <li>It cannot be combined with any other discount or offer.</li>
              <li>
                We may change or withdraw the offer at any time; the terms applying to
                your booking are those in place when it is confirmed.
              </li>
              <li>Destination weddings and bespoke arrangements are quoted separately.</li>
            </ul>

            <h2>Where the discount appears</h2>
            <p>
              Your live estimate applies the offer automatically as soon as your
              booking reaches the threshold, and shows it as a separate line in your
              breakdown — so you can always see exactly what was removed.
            </p>
          </div>

          <div className="policy-note" style={{ marginTop: "var(--space-lg)" }}>
            Other promotions we may run from time to time:{" "}
            {others.map((p) => p.label).join(" · ")}. Only the active offer is applied
            to your estimate.
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