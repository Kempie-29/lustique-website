import { useParams } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Article } from "@/components/content/Article";
import { Button } from "@/components/primitives/Button";
import { journal } from "@/content/journal";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import { Placeholder } from "@/pages/Placeholder";

export default function JournalDetail() {
  const { slug } = useParams();
  const entry = journal.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <Placeholder
        eyebrow="Journal"
        title="We couldn't find that entry."
        intro="It may have moved. Browse the journal instead."
        path="/journal"
      />
    );
  }

  return (
    <>
      <Seo title={entry.title} description={entry.excerpt} path={`/journal/${entry.slug}`} />
      <JsonLd
        data={[
          breadcrumbSchema([
            { label: "Journal", to: "/journal" },
            { label: entry.title, to: `/journal/${entry.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: entry.excerpt,
            datePublished: entry.date,
            author: { "@type": "Organization", name: site.name, url: site.url },
            publisher: { "@type": "Organization", name: site.name, url: site.url },
            mainEntityOfPage: `${site.url}/journal/${entry.slug}`,
          },
        ]}
      />

      <PageHero
        eyebrow="Journal"
        title={entry.title}
        intro={entry.excerpt}
        crumbs={[{ label: "Journal", to: "/journal" }, { label: entry.title }]}
      />

      <section className="section">
        <div className="wrap--narrow">
          <p className="updated">
            {formatDate(entry.date)} · {entry.readingMinutes} minute read
          </p>
          <Article sections={entry.body} />

          <hr className="divider" />

          <div className="btn-row">
            <Button to="/journal" variant="outline">
              All entries
            </Button>
            <Button to="/quote" variant="primary">
              Build your estimate
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}