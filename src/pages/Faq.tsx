import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/components/JsonLd";
import { Reveal } from "@/components/shell/Reveal";
import { Accordion } from "@/components/primitives/Accordion";
import { Button } from "@/components/primitives/Button";
import { faqs } from "@/content/faq";
import { site, whatsappLink } from "@/content/site";

export default function Faq() {
  return (
    <>
      <Seo
        title="FAQ"
        description="The things brides most often ask Lustique Co. about trials, travel, pricing and timing."
        path="/faq"
      />
      <JsonLd data={[breadcrumbSchema([{ label: "FAQ", to: "/faq" }]), faqPageSchema()]} />

      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        intro="The things brides ask us most. If yours isn't here, we're happy to answer it directly."
        crumbs={[{ label: "FAQ" }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <Reveal variant="fade">
            <Accordion items={faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))} />
          </Reveal>

          <div className="btn-row cta-line">
            <Button to="/quote" variant="primary" size="lg">
              Build your estimate
            </Button>
            <Button
              href={whatsappLink(`Hi ${site.name}, I have a question about my wedding.`)}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener"
            >
              Ask on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}