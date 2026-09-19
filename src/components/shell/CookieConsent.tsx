import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";
import { clearConsent, readConsent, writeConsent } from "@/lib/consent";

/** POPIA cookie banner. Analytics only ever load after an explicit accept. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);

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
  };

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie preferences">
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