/**
 * POPIA cookie consent. Analytics must only ever be loaded after an explicit
 * "accept". Persisted in localStorage.
 */

export type ConsentValue = "accepted" | "declined";

export const CONSENT_KEY = "lustique:consent";

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

/** Analytics placeholder — only runs once consent has been accepted. */
export function initAnalytics(): void {
  if (readConsent() !== "accepted") return;
  // Analytics provider is intentionally not wired in Phase 1.
}