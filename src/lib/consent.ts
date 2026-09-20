/**
 * POPIA cookie consent. Analytics must only ever be loaded after an explicit
 * "accept". Persisted in localStorage under `lc_cookie` (the live key).
 */

export type ConsentValue = "accepted" | "declined";

export const CONSENT_KEY = "lc_cookie";

export function readConsent(): ConsentValue | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw === "accepted" || raw === "declined" ? raw : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable — fail closed, no analytics */
  }
}

export function clearConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
}

function getGaId(): string | undefined {
  const id = import.meta.env?.VITE_GA_ID as string | undefined;
  if (!id || id.trim().length === 0 || id === "G-XXXXXXXXXX") return undefined;
  return id;
}

/**
 * Load GA4 — only once, and only after consent has been accepted. The GA ID
 * comes from `VITE_GA_ID`; without it (or with the placeholder) nothing loads.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (readConsent() !== "accepted") return;

  const gaId = getGaId();
  if (!gaId) return;

  const w = window as unknown as {
    __lustiqueGaLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (w.__lustiqueGaLoaded) return;
  w.__lustiqueGaLoaded = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("consent", "default", { analytics_storage: "denied" });
  w.gtag("config", gaId);
  w.gtag("consent", "update", { analytics_storage: "granted" });
}