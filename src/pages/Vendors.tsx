import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Button } from "@/components/primitives/Button";
import { site, whatsappLink } from "@/content/site";

const WORKING = [
  {
    title: "A running order everyone can see",
    body: "Share the morning timeline and we'll build our part around it, so your photographs and the ceremony stay on schedule.",
  },
  {
    title: "Light and space",
    body: "A corner with natural light and a spare plug point is all we need. If the getting-ready room is tight, we'll help find a better one.",
  },
  {
    title: "Referrals both ways",
    body: "We're happy to recommend photographers, planners and venues we trust, and we welcome brides referred to us in return.",
  },
];

export default function Vendors() {
  return (
    <>
      <Seo
        title="For vendors"
        description="How Lustique Co. works alongside planners, photographers, venues and florists in Gauteng."
        path="/vendors"
      />
      <JsonLd data={breadcrumbSchema([{ label: "For vendors", to: "/vendors" }])} />

      <PageHero
        eyebrow="Vendors"
        title="For our fellow suppliers."
        intro="A wedding day is a relay, and the people around the bride decide how smoothly it runs. Here's how we like to work."
        crumbs={[{ label: "For vendors" }]}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            {WORKING.map((item) => (
              <Reveal key={item.title} variant="rise">
                <div className="panel" style={{ height: "100%" }}>
                  <h3 style={{ fontSize: "var(--step-2)" }}>{item.title}</h3>
                  <p className="muted" style={{ marginTop: "0.6rem" }}>
                    {item.body}
                  </p>
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
              <p className="eyebrow">Say hello</p>
              <h2 style={{ fontSize: "var(--step-2)" }}>Let's work together.</h2>
              <p className="muted" style={{ marginTop: "0.6rem" }}>
                If you plan, photograph or host weddings in {site.address.region} and
                would like to work together, we'd love to hear from you. Introductions,
                referrals and supplier-listings are always welcome.
              </p>
              <div className="btn-row" style={{ marginTop: "1.2rem" }}>
                <Button to="/contact" variant="primary">
                  Get in touch
                </Button>
                <Button
                  href={whatsappLink(`Hi ${site.name}, I'd like to work together.`)}
                  variant="whatsapp"
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp us
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}