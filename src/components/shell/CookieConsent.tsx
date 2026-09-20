import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";
import { clearConsent, initAnalytics, readConsent, writeConsent } from "@/lib/consent";

/** POPIA cookie banner. Analytics only ever load after an explicit accept. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If consent was already given, load analytics (no banner).
    if (readConsent() === "accepted") initAnalytics();
    else setVisible(readConsent() === null);

    // The footer's "Manage cookies" link re-opens the banner.
    const onManage = () => {
      clearConsent();
      setVisible(true);
    };
    window.addEventListener("lustique:manage-cookies", onManage);
    return () => window.removeEventListener("lustique:manage-cookies", onManage);
  }, []);

  if (!visible) return null;

  const decide = (value: "accepted" | "declined") => {
    writeConsent(value);
    setVisible(false);
    if (value === "accepted") initAnalytics();
  };

  return (
    <div className="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie preferences">
      <p>
        We use essential cookies to run this site, and — only with your consent —
        analytics to understand how brides find us. See our{" "}
        <Link to="/privacy">privacy notice</Link>.
      </p>
      <div className="btn-row">
        <Button variant="outline" size="sm" onClick={() => decide("declined")}>
          Decline
        </Button>
        <Button variant="primary" size="sm" onClick={() => decide("accepted")}>
          Accept
        </Button>
      </div>
    </div>
  );
}