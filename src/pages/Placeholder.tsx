import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/primitives/Button";

interface PlaceholderProps {
  eyebrow: string;
  title: string;
  intro: string;
  path: string;
}

/**
 * Real, navigable route for pages scheduled for Phase 2. Nothing links to a
 * dead URL — these render the shared shell with an honest "in progress" note.
 */
export function Placeholder({ eyebrow, title, intro, path }: PlaceholderProps) {
  return (
    <>
      <Seo title={title} description={intro} path={path} />
      <PageHero eyebrow={eyebrow} title={title} intro={intro} crumbs={[{ label: title }]} />
      <section className="section">
        <div className="wrap--narrow center-narrow">
          <p className="eyebrow">In progress</p>
          <h2>This page is on its way.</h2>
          <p className="lead">
            We're building this section out in full. In the meantime, the fastest
            way to plan your morning is a live estimate — it takes about two
            minutes and tells you your investment before you enquire.
          </p>
          <div className="btn-row cta-line" style={{ justifyContent: "center" }}>
            <Button to="/quote" variant="primary" size="lg">
              Build your estimate
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