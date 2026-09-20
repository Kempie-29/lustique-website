import { Link, useParams } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema, articleSchema } from "@/components/JsonLd";
import { Article } from "@/components/content/Article";
import { Button } from "@/components/primitives/Button";
import { guides } from "@/content/guides";
import { Placeholder } from "@/pages/Placeholder";

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <Placeholder
        eyebrow="Guides"
        title="We couldn't find that guide."
        intro="It may have moved. Browse the full set of guides instead — they're all free."
        path="/guides"
      />
    );
  }

  return (
    <>
      <Seo
        title={guide.title}
        description={guide.excerpt}
        path={`/guides/${guide.slug}`}
      />
      <JsonLd
        data={[
          breadcrumbSchema([
                      { label: "Guides", to: "/guides" },
                      { label: guide.title, to: `/guides/${guide.slug}` },
                    ]),
                    articleSchema({
                      title: guide.title,
                      description: guide.excerpt,
                      path: `/guides/${guide.slug}`,
                    }),
                  ]}
      />

      <PageHero
        eyebrow="Guide"
        title={guide.title}
        intro={guide.excerpt}
        crumbs={[{ label: "Guides", to: "/guides" }, { label: guide.title }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <p className="updated">{guide.readingMinutes} minute read</p>
          <Article sections={guide.body} />

          <hr className="divider" />

          <div className="btn-row">
            <Button to="/guides" variant="outline">
              All guides
            </Button>
            <Button to="/quote" variant="primary">
              Build your estimate
            </Button>
          </div>
          <p className="muted" style={{ marginTop: "1.2rem" }}>
            Prefer to ask us directly?{" "}
            <Link to="/contact" style={{ textDecoration: "underline" }}>
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}