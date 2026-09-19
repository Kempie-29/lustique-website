import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Button } from "@/components/primitives/Button";
import { site } from "@/content/site";

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy notice"
        description="How Lustique Co. collects, uses and protects your information under POPIA."
        path="/privacy"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Privacy", to: "/privacy" }])} />

      <PageHero
        eyebrow="Privacy"
        title="Privacy notice."
        intro="How we handle your information under the Protection of Personal Information Act (POPIA)."
        crumbs={[{ label: "Privacy" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <p className="policy-note">
            This is our current plain-language privacy notice. If you have a question
            about your information, please ask us directly.
          </p>

          <div className="prose" style={{ marginTop: "var(--space-lg)" }}>
            <h2>What we collect</h2>
            <p>
              When you send an enquiry or a message, we collect the details you give
              us: your name, email address, mobile or WhatsApp number, the details of
              your wedding or event, and anything you choose to tell us in your notes.
            </p>

            <h2>Why we collect it</h2>
            <p>
              We use your information only to respond to your enquiry, prepare your
              estimate, arrange your booking and look after you on the day.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep enquiry details for as long as we need them to answer you and to
              look after your booking, and no longer than is necessary.
            </p>

            <h2>Sharing</h2>
            <p>
              We do not sell your information. We only share it where it is necessary
              to provide our services, or where the law requires it.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              The site uses essential cookies to run. Analytics only ever load if you
              choose “Accept” on our cookie banner — nothing is tracked before then.
              You can change your choice at any time using “Manage cookies” in the
              footer.
            </p>

            <h2>Your rights</h2>
            <p>
              You may ask us what information we hold about you, ask us to correct it,
              or ask us to delete it. We will respond to reasonable requests promptly.
            </p>

            <h2>Contact</h2>
            <p>
              To exercise any of these rights, email{" "}
              <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>
                {site.email}
              </a>{" "}
              or write to us at {site.address.full}.
            </p>
          </div>

          <div className="btn-row cta-line">
            <Button to="/terms" variant="outline">
              Terms of service
            </Button>
            <Button to="/contact" variant="primary">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}