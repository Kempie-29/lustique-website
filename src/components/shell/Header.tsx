import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "@/components/shell/Brand";
import { Button } from "@/components/primitives/Button";
import { site, whatsappLink } from "@/content/site";

export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "The Team", to: "/team" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Pricing", to: "/pricing" },
  { label: "Guides", to: "/guides" },
  { label: "Journal", to: "/journal" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Sticky-nav shadow once the page has scrolled past 20px (live behaviour).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <header id="nav" className={`site-header ${scrolled ? "scrolled" : ""}`.trim()}>
      <div className="wrap header-inner">
        <Brand />

        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              aria-current={isActive(item.to) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Button to="/quote" variant="primary" size="sm">
            Get a Quote
          </Button>
          <Button
            href={whatsappLink()}
            variant="whatsapp"
            size="sm"
            target="_blank"
            rel="noopener"
            aria-label={`Chat with ${site.name} on WhatsApp`}
          >
            WhatsApp
          </Button>
        </div>

        <button
          className="hamburger"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-nav" className={`mobile-nav ${open ? "is-open open" : ""}`.trim()}>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link to={item.to} aria-current={isActive(item.to) ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav__actions" style={{ padding: "0 var(--gutter) var(--space-md)" }}>
          <Button to="/quote" variant="primary" block>
            Get a Quote
          </Button>
          <Button
            href={whatsappLink()}
            variant="whatsapp"
            block
            target="_blank"
            rel="noopener"
            aria-label={`Chat with ${site.name} on WhatsApp`}
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </header>
  );
}