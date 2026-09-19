import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/primitives/Button";
import { site, whatsappLink } from "@/content/site";

const NEXT_STEPS = [
  "We'll read through your enquiry and your estimate.",
  "We'll check the diary against your date and venue.",
  "We'll come back to you by email or WhatsApp with next steps.",
];

export default function ThankYou() {
  return (
    <>
      <Seo
        title="Thank you"
        description="Your enquiry is with the Lustique Co. team."
        path="/thank-you"
        noindex
      />
      <PageHero
        eyebrow="Thank you"
        title="Your enquiry is with us."
        intro="We're so glad you're here. Your details have reached the team and your estimate is saved with them."
      />
      <section className="section">
        <div className="wrap--narrow">
          <h2>What happens next</h2>
          <ul className="stack" style={{ marginTop: "1rem" }}>
            {NEXT_STEPS.map((step) => (
              <li key={step} style={{ display: "flex", gap: "0.7rem" }}>
                <span aria-hidden="true" style={{ color: "var(--rose-deep)" }}>
                  —
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: "1.5rem" }}>
            You're welcome to reach out sooner — {site.phoneDisplay} or{" "}
            <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>
              {site.email}
            </a>
            .
          </p>
          <div className="btn-row cta-line">
            <Button to="/portfolio" variant="primary" size="lg">
              Explore the portfolio
            </Button>
            <Button
              href={whatsappLink("Hi Lustique Co., I've just sent an enquiry.")}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener"
            >
              Chat on WhatsApp
            </Button>
            <Button to="/" variant="outline" size="lg">
              Back to home
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}