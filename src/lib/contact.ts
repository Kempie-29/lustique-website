/**
 * Contact-form layer. Shares the same endpoint and dev-mode behaviour as the
 * enquiry layer, so both are wired the moment VITE_ENQUIRY_ENDPOINT is set.
 */

import { getEndpoint } from "@/lib/submitEnquiry";

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export interface ContactPayload extends ContactForm {
  submittedAt: string;
  source: "contact";
}

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  if (!form.name.trim()) errors.name = "Please add your name.";
  if (!form.email.trim()) errors.email = "Please add an email address.";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "That email doesn't look right.";
  if (!form.message.trim()) errors.message = "Please add a short message.";
  if (!form.consent) errors.consent = "Please agree to the POPIA consent to continue.";
  return errors;
}

const STORAGE_KEY = "lustique:contact-messages";

export async function submitContact(
  form: ContactForm,
): Promise<{ ok: boolean; message: string }> {
  const payload: ContactPayload = {
    ...form,
    submittedAt: new Date().toISOString(),
    source: "contact",
  };
  const endpoint = getEndpoint();

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return { ok: false, message: "We couldn't send your message. Please try again, or message us on WhatsApp." };
      }
      return { ok: true, message: "Thank you — your message is with us." };
    } catch {
      return { ok: false, message: "We couldn't send your message. Please try again, or message us on WhatsApp." };
    }
  }

  // eslint-disable-next-line no-console
  console.info("[Lustique] contact message (dev mode):", payload);
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
    existing.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    /* storage unavailable — the console log above is still the record */
  }
  return { ok: true, message: "Thank you — your message is with us." };
}