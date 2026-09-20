import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BackToTop } from "@/components/shell/BackToTop";
import { CookieConsent } from "@/components/shell/CookieConsent";
import { Footer } from "@/components/shell/Footer";
import { GrainOverlay } from "@/components/shell/GrainOverlay";
import { Header } from "@/components/shell/Header";
import { SkipLink } from "@/components/shell/SkipLink";
import { TopBar } from "@/components/shell/TopBar";
import { WhatsAppFloat } from "@/components/shell/WhatsAppFloat";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/** Global shell wrapped around every route. */
export function SiteLayout() {
  return (
    <>
      <GrainOverlay />
      <SkipLink />
      <TopBar />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <WhatsAppFloat />
      <BackToTop />
      <ScrollToTop />
    </>
  );
}