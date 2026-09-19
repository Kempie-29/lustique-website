import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/primitives/Button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 — no route for:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo
        title="Page not found"
        description="We couldn't find that page."
        path={location.pathname}
        noindex
      />
      <PageHero
        eyebrow="404"
        title="We couldn't find that page."
        intro="The link may have moved, or the page may not be ready yet. Let's get you back on track."
        crumbs={[{ label: "Not found" }]}
      />
      <section className="section">
        <div className="wrap--narrow center-narrow">
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Button to="/" variant="primary" size="lg">
              Back to home
            </Button>
            <Button to="/quote" variant="ink" size="lg">
              Build your estimate
            </Button>
            <Button to="/portfolio" variant="outline" size="lg">
              View the portfolio
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}