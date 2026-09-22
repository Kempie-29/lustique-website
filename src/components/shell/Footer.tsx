import { Link } from "react-router-dom";
import { Logo } from "@/components/shell/Logo";
import { NAV_ITEMS } from "@/components/shell/Header";
import { directionsLink, site, whatsappLink } from "@/content/site";

function manageCookies() {
  window.dispatchEvent(new Event("lustique:manage-cookies"));
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-brand-link" aria-label={`${site.name} — home`}>
              <Logo variant="full" className="footer-logo" alt="" />
            </Link>
            <p>
              Bridal hair &amp; makeup artistry from {site.address.suburb}, Pretoria.
              Quiet, personal, and unhurried — from trial to touch-up.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/quote">Get a Quote</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener">
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Location</h4>
            <ul>
              <li>
                <address>{site.address.full}</address>
              </li>
              <li>
                <a href={directionsLink()} target="_blank" rel="noopener">
                  Get directions
                </a>
              </li>
              {site.hours.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.value}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul>
              <li>
                <a href={site.socials.instagram} target="_blank" rel="noopener">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.socials.facebook} target="_blank" rel="noopener">
                  Facebook
                </a>
              </li>
              <li>
                <a href={site.socials.tiktok} target="_blank" rel="noopener">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <nav aria-label="Legal">
            <span>© 2026 {site.name} · Pretoria</span>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <button type="button" id="manageCookies" onClick={manageCookies}>
                          Manage cookies
                        </button>
          </nav>
          <span className="blessing">Blessings, The Lustique Cosmetology Team</span>
        </div>
      </div>
    </footer>
  );
}