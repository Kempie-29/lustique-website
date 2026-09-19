import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Button } from "@/components/primitives/Button";
import { site } from "@/content/site";

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of service"
        description="The plain-language terms that govern bookings with Lustique Co."
        path="/terms"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Terms", to: "/terms" }])} />

      <PageHero
        eyebrow="Terms"
        title="Terms of service."
        intro="The terms that govern bookings with Lustique Co., written in plain language."
        crumbs={[{ label: "Terms" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <p className="policy-note">
            These are our current plain-language terms. If you would like anything
            clarified before you book, please ask — we would rather answer a question
            than have you sign past one.
          </p>

          <div className="prose" style={{ marginTop: "var(--space-lg)" }}>
            <h2>1. Enquiries and estimates</h2>
            <p>
              An enquiry through our website, and any estimate it produces, is not a
              booking. Estimates are indicative and are confirmed with you before
              anything is agreed.
            </p>

            <h2>2. Confirming your date</h2>
            <p>
              Your date is secured once we have confirmed availability with you and any
              booking steps we agree have been completed. Until then, dates remain
              open to other brides.
            </p>

            <h2>3. Pricing</h2>
            <p>
              Prices are as published on our pricing page and in the estimator at the
              time of your enquiry. Final pricing is confirmed in writing before the
              booking is secured, and is based on the services, party size, hair
              lengths and travel agreed.
            </p>

            <h2>4. Travel</h2>
            <p>
              Travel within 40 km round trip of our {site.address.suburb} studio is
              free. Beyond that, travel is charged per kilometre round trip and
              confirmed with you in advance. We never charge travel we have not
              calculated and agreed.
            </p>

            <h2>5. Trials</h2>
            <p>
              A bridal trial is included in the bridal estimate unless you choose to
              decline it. Trials take place at our studio and are arranged by
              appointment.
            </p>

            <h2>6. Changes and cancellations</h2>
            <p>
              If your plans change, please tell us as early as you can so we can
              adjust the diary. Any fees that apply to a change or cancellation will be
              set out when you book.
            </p>

            <h2>7. On the day</h2>
            <p>
              We ask for a clean, quiet space, good light and a steady supply of power
              where possible, so we can look after your party properly and on time.
            </p>

            <h2>8. Liability</h2>
            <p>
              We take care with every service. Our liability is limited to the services
              we provide and is otherwise governed by South African law.
            </p>

            <h2>9. Governing law</h2>
            <p>These terms are governed by the laws of the Republic of South Africa.</p>
          </div>

          <div className="btn-row cta-line">
            <Button to="/privacy" variant="outline">
              Privacy notice
            </Button>
            <Button to="/contact" variant="primary">
              Ask a question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}